import { Routes, Route } from 'react-router-dom';
import { renderWithProviders, screen, waitFor } from '../../test-utils';
import EditSensorV2 from '../../Components/EditSensorV2';
import useSensorStore from '../../zustand/sensor.store';
import useUserStore from '../../zustand/user.store';

function renderEditSensorV2(route = '/editSensor/v2/GRV-T001') {
  return renderWithProviders(
    <Routes>
      <Route path="/editSensor/v2/:id" element={<EditSensorV2 />} />
    </Routes>,
    { route }
  );
}

function makeUser() {
  return {
    cognitoUser: {
      getUsername: () => 'bob',
      getSignInUserSession: () => ({
        getIdToken: () => ({ getJwtToken: () => 'jwt-token' }),
      }),
    },
  };
}

const sensorData = {
  id: 'GRV-T001',
  category: 'tetr',
  type: 'transcription factor',
  about: 'A description of the sensor.',
  proteins: [
    {
      uniprot_id: 'Q82H41',
      alias: 'AvaR1',
      refseq_id: 'NC_000001',
      kegg_id: 'K00001',
      regulation_type: 'Apo-repressor',
      sequence: 'MSEQ',
      stimulus: [],
      dna: [],
      references: [],
    },
  ],
};

describe('EditSensorV2', () => {
  beforeEach(() => {
    useSensorStore.setState({ v2SensorData: {} });
    useUserStore.setState({ user: makeUser() });
  });

  afterEach(() => jest.restoreAllMocks());

  test('loads from the zustand v2SensorData cache (no fetch) and renders sensor-level and protein fields', async () => {
    useSensorStore.setState({ v2SensorData: { 'GRV-T001': sensorData } });
    global.fetch = jest.fn();

    renderEditSensorV2();

    expect(await screen.findByText('ID: GRV-T001')).toBeInTheDocument();
    expect(screen.getByText('Category: tetr')).toBeInTheDocument();
    expect(screen.getByDisplayValue('transcription factor')).toBeInTheDocument();
    expect(screen.getByDisplayValue('A description of the sensor.')).toBeInTheDocument();
    expect(screen.getByText('AvaR1')).toBeInTheDocument();
    expect(screen.getByText('Q82H41')).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('falls back to fetching the sensor JSON when there is no cached v2SensorData', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(sensorData) })
    );

    renderEditSensorV2();

    expect(await screen.findByText('ID: GRV-T001')).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(
      'https://groov-api.com/v2/sensors/tetr/GRV-T001.json',
      expect.objectContaining({ headers: { Accept: 'application/json' } })
    );
  });

  test('shows an error and a "Go back" button when the category cannot be determined from the id', async () => {
    renderEditSensorV2('/editSensor/v2/NOT-A-VALID-ID');

    expect(
      await screen.findByText(/cannot determine category for sensor id/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
  });

  test('submitting calls editSensorV2 and shows the "submitted for review" success screen', async () => {
    useSensorStore.setState({ v2SensorData: { 'GRV-T001': sensorData } });
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 202, ok: true, json: () => Promise.resolve({}) })
    );

    const { user } = renderEditSensorV2();
    await screen.findByText('ID: GRV-T001');

    await user.click(screen.getByRole('button', { name: /submit for review/i }));

    expect(
      await screen.findByText(/edit submitted for admin review/i)
    ).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.groov.bio/v2/editSensor',
      expect.objectContaining({ method: 'POST' })
    );
  });
});
