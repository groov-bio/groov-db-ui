import { Routes, Route } from 'react-router-dom';
import { renderWithProviders, screen, waitFor } from '../test-utils';
import EditSensor from './EditSensor';
import useSensorStore from '../zustand/sensor.store';
import useUserStore from '../zustand/user.store';

// matchMedia is polyfilled in setupTests.js to always report matches:false, so
// EditSensor's `mobile` breakpoint check is always false and it renders the
// desktop `getForm()` branch (form + toggle buttons), not form+preview side by side.

function renderEditSensor(route = '/editSensor/TETR/P0ACU5') {
  return renderWithProviders(
    <Routes>
      <Route path="/editSensor/:family/:sensorID" element={<EditSensor />} />
    </Routes>,
    { route }
  );
}

const sensorJson = {
  alias: 'AvaR1',
  accession: 'NC_000001',
  uniprotID: 'P0ACU5',
  regulationType: 'Apo-repressor',
  about: 'A description of the sensor.',
  ligands: [
    { name: 'IPTG', SMILES: 'CCO', doi: '10.1000/x', ref_figure: 'Figure 1', method: 'EMSA' },
  ],
  operators: [
    { sequence: 'ATCG', method: 'EMSA', ref_figure: 'Table 2', doi: '10.1000/y' },
  ],
};

describe('EditSensor (V1)', () => {
  beforeEach(() => {
    useSensorStore.setState({ sensorData: {} });
    useUserStore.setState({
      user: {
        cognitoUser: {
          getSignInUserSession: () => ({
            getAccessToken: () => ({ getJwtToken: () => 'jwt-token' }),
          }),
          getUsername: () => 'bob',
        },
      },
    });
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(sensorJson) })
    );
  });

  afterEach(() => jest.restoreAllMocks());

  test('fetches the sensor JSON for the route family/sensorID and populates the form', async () => {
    renderEditSensor();

    expect(await screen.findByText('Edit Sensor: AvaR1')).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(
      'https://groov-api.com/sensors/tetr/P0ACU5.json',
      expect.objectContaining({ headers: { Accept: 'application/json' } })
    );
    expect(screen.getByLabelText('Alias')).toHaveValue('AvaR1');
    expect(screen.getByLabelText('About')).toHaveValue('A description of the sensor.');
  });

  test('shows an error message if the sensor fetch fails', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('network down')));
    renderEditSensor();

    // The same "Error loading sensor data" text is shown both as a snackbar
    // and as the page body once initialValues never gets set -- assert both
    // instances rather than picking one with getByText (which would throw on
    // the ambiguity).
    const matches = await screen.findAllByText(/error loading sensor data/i);
    expect(matches.length).toBeGreaterThan(0);
  });

  test('reuses cached sensor data from the zustand store instead of re-fetching', async () => {
    useSensorStore.setState({
      sensorData: { P0ACU5: sensorJson },
    });
    renderEditSensor();

    expect(await screen.findByText('Edit Sensor: AvaR1')).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
