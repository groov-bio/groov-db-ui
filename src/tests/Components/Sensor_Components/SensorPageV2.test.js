import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { renderWithProviders, screen } from '../../../test-utils';
import useSensorStore from '../../../zustand/sensor.store.js';
import useFeatureFlagsStore from '../../../zustand/featureFlags.store.js';

// SensorPageV2 -> SensorPageV2View -> ProteinPanel -> DNAbinding transitively
// imports @mui/x-data-grid, whose hash util calls `new TextEncoder()` at
// module scope. jest-environment-jsdom does not provide a global
// TextEncoder, so we polyfill it before requiring the component. This must
// be a plain `require()` (not `import`) so Babel does not hoist it above
// this line the way it would with ES `import` syntax.
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
const SensorPageV2 = require('../../../Components/Sensor_Components/SensorPageV2').default;

const mockV2Sensor = {
  id: 'GRV-T00001',
  category: 'TetR',
  type: 'One Component',
  about: 'A TetR-family transcriptional regulator.',
  proteins: [
    {
      alias: 'AvaR1',
      uniprot_id: 'Q82H41',
      sequence: 'MSTNKELVDRILEAAEEVFAEKGYAAASMDDIAKAAGVGKGTIYLYFKDKQDLL',
      regulation_type: 'Apo-repressor',
      structures: [],
      dna: [],
      stimulus: [],
      context: [],
      references: [],
    },
  ],
};

function renderSensorPageV2(route = '/sensor/GRV-T00001') {
  return renderWithProviders(
    <Routes>
      <Route path="/sensor/:id" element={<SensorPageV2 />} />
      <Route path="/" element={<div>Home Page</div>} />
    </Routes>,
    { route }
  );
}

describe('SensorPageV2', () => {
  beforeEach(() => {
    useSensorStore.setState({ sensorData: {}, v2SensorData: {} });
    useFeatureFlagsStore.setState({ flags: {}, loading: false, error: null });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders nothing while feature flags have not resolved', () => {
    const { container } = renderSensorPageV2();
    expect(container).toBeEmptyDOMElement();
  });

  test('redirects home when the v2_sensor_page flag is off', () => {
    useFeatureFlagsStore.getState().setFlags({
      v2_sensor_page: { local: false },
    });

    renderSensorPageV2();

    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  test('renders the v2 sensor (alias, GRV id, category chip) from store-seeded data when the flag is on', () => {
    useFeatureFlagsStore.getState().setFlags({
      v2_sensor_page: { local: true },
    });
    useSensorStore.getState().setV2SensorData('GRV-T00001', mockV2Sensor);
    global.fetch = jest.fn();

    renderSensorPageV2();

    expect(
      screen.getByRole('heading', { level: 1, name: 'AvaR1' })
    ).toBeInTheDocument();
    expect(screen.getByText('GRV-T00001')).toBeInTheDocument();
    expect(screen.getByText('TetR')).toBeInTheDocument();
    expect(screen.getByText('One Component')).toBeInTheDocument();
    expect(screen.getByText('Apo-repressor')).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('fetches from the v2 category endpoint derived from the GRV id prefix when not in the store', async () => {
    useFeatureFlagsStore.getState().setFlags({
      v2_sensor_page: { local: true },
    });
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockV2Sensor),
      })
    );

    renderSensorPageV2();

    expect(
      await screen.findByRole('heading', { level: 1, name: 'AvaR1' })
    ).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(
      'https://groov-api.com/v2/sensors/tetr/GRV-T00001.json',
      expect.objectContaining({ headers: { Accept: 'application/json' } })
    );
  });

  test('shows a "Sensor not found" message when the id prefix maps to no known category', async () => {
    useFeatureFlagsStore.getState().setFlags({
      v2_sensor_page: { local: true },
    });
    global.fetch = jest.fn();

    renderSensorPageV2('/sensor/GRV-Q99999');

    expect(
      await screen.findByText('Sensor not found')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Could not determine category from ID: GRV-Q99999')
    ).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
