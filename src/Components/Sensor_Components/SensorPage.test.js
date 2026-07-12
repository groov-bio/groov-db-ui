import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { renderWithProviders, screen } from '../../test-utils';
import useSensorStore from '../../zustand/sensor.store.js';

// SensorPage -> SinglePageView/DNAbinding transitively import
// @mui/x-data-grid, whose hash util calls `new TextEncoder()` at module
// scope. jest-environment-jsdom does not provide a global TextEncoder, so we
// polyfill it before requiring the component. This must be a plain
// `require()` (not `import`) so Babel does not hoist it above this line the
// way it would with ES `import` syntax.
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
const SensorPage = require('./SensorPage').default;

// Minimal sensor object containing exactly the keys SensorPage / MetadataTable
// / SinglePageView actually read (see SensorPage.js lines ~275-311 and
// SinglePageView.js).
const mockSensor = {
  alias: 'AvaR1',
  about: 'A TetR-family transcriptional regulator responsive to Avenolide.',
  uniprotID: 'Q82H41',
  accession: 'NP_823382.1',
  organism: 'Streptomyces avermitilis MA-4680',
  organismID: '227882',
  keggID: 'None',
  regulationType: 'Apo-repressor',
  sequence: 'MSTNKELVDRILEAAEEVFAEKGYAAASMDDIAKAAGVGKGTIYLYFKDKQDLL',
  ligands: [
    {
      name: 'Avenolide',
      SMILES: 'CC1CCC(=O)O1',
      doi: '10.1000/xyz',
      ref_figure: 'Figure 1',
      method: 'ITC',
    },
  ],
  operators: [
    {
      sequence: 'TTGACAATTGTCAA',
      ref_figure: 'Figure 2',
      doi: '10.1000/abc',
      method: 'EMSA',
    },
  ],
  structures: [],
  fullReferences: [
    {
      title: 'Discovery and characterization of AvaR1',
      authors: [{ firstName: 'Jane', lastName: 'Doe' }],
      year: 2020,
      journal: 'Nature Chemical Biology',
      doi: '10.1000/xyz',
      url: 'https://doi.org/10.1000/xyz',
    },
  ],
};

function renderSensorPage(route = '/entry/TetR/Q82H41') {
  return renderWithProviders(
    <Routes>
      <Route path="/entry/:family/:uniprotID" element={<SensorPage />} />
    </Routes>,
    { route }
  );
}

describe('SensorPage', () => {
  beforeEach(() => {
    useSensorStore.setState({
      sensorTable: {
        tetr: [],
        lysr: [],
        arac: [],
        marr: [],
        laci: [],
        gntr: [],
        luxr: [],
        iclr: [],
        other: [],
      },
      sensorData: {},
      v2SensorData: {},
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('shows a loading skeleton (no fetch resolved / no store data) before the sensor is available', () => {
    global.fetch = jest.fn(() => new Promise(() => {})); // never resolves
    renderSensorPage();

    // Alias heading has not rendered yet.
    expect(screen.queryByText('AvaR1')).not.toBeInTheDocument();
  });

  test('renders the alias, family chip, and key metadata from store-seeded sensor data', async () => {
    // Seed the store directly so the component's effect (which only fetches
    // when sensorData is undefined) finds data already present and skips
    // the network call entirely.
    useSensorStore.getState().setSensorData('Q82H41', mockSensor);
    global.fetch = jest.fn();

    renderSensorPage();

    // Alias rendered as the h1.
    expect(
      screen.getByRole('heading', { level: 1, name: 'AvaR1' })
    ).toBeInTheDocument();

    // Family chip built from the :family route param, upper-cased.
    expect(screen.getByText('Family: TETR')).toBeInTheDocument();

    // MetadataTable-driven fields.
    expect(screen.getByText('Regulation Type')).toBeInTheDocument();
    expect(screen.getByText('Apo-repressor')).toBeInTheDocument();
    expect(screen.getByText('Q82H41')).toBeInTheDocument();
    expect(screen.getByText('Streptomyces avermitilis')).toBeInTheDocument();

    // No fetch should have occurred since the store already had the data.
    expect(global.fetch).not.toHaveBeenCalled();

    // Ligand name from LigandViewer (SinglePageView is shown by default,
    // isTabView starts false).
    expect(await screen.findByText('Avenolide')).toBeInTheDocument();
  });

  test('fetches sensor JSON from the V1 endpoint when the store has no data for this uniprotID', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve(mockSensor) })
    );

    renderSensorPage();

    expect(
      await screen.findByRole('heading', { level: 1, name: 'AvaR1' })
    ).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(
      'https://groov-api.com/sensors/tetr/Q82H41.json',
      expect.objectContaining({ headers: expect.any(Object) })
    );
  });
});
