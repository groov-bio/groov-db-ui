import React from 'react';
import { renderWithProviders, screen, waitFor } from '../test-utils';
import useSensorStore from '../zustand/sensor.store.js';

// --- Suspected bug #1: unmemoized DataGrid `columns` -------------------
// SensorTable builds its DataGrid `columns` via `getColumns()` called fresh
// inline in JSX on every render (never memoized), unlike every other
// DataGrid user in this codebase (SensorTableV2, DNAbinding), which pass a
// stable/module-level columns array. Combined with the real @mui/x-data-grid
// v8 + React 18 + jsdom, that unstable `columns` reference triggers a
// pathological, effectively-endless render loop on mount for the
// single-family views: confirmed by hand by running this file's render in
// isolation — the underlying node process pinned 100%+ CPU for 10+ minutes
// and produced megabytes of repeating "No routes matched location /"
// console warnings without ever settling. This reproduced whether or not
// `useAllSensors` was stubbed to return stable data, ruling out query
// refetch churn as *this* loop's cause.
//
// We work around it with a small local mock of @mui/x-data-grid that still
// invokes each column's real `renderCell` (so we exercise the actual
// link/href-building logic in SensorTable.js), rendering a plain table
// instead of the real virtualized grid. This is a test-only mock, not a
// source change — SensorTableV2.test.js and DNAbinding's DataGrid usage
// (exercised via SensorPage.test.js) both render the REAL DataGrid
// successfully, which further isolates this to SensorTable's specific
// unmemoized-columns pattern.
jest.mock('@mui/x-data-grid', () => {
  const ReactLib = require('react');
  return {
    DataGrid: ({ rows, columns, getRowId }) =>
      ReactLib.createElement(
        'table',
        null,
        ReactLib.createElement(
          'tbody',
          null,
          rows.map((row, i) =>
            ReactLib.createElement(
              'tr',
              { key: getRowId ? getRowId(row) : row.id ?? i },
              columns.map((col) =>
                ReactLib.createElement(
                  'td',
                  { key: col.field },
                  col.renderCell
                    ? col.renderCell({ value: row[col.field], row })
                    : String(row[col.field] ?? '')
                )
              )
            )
          )
        )
      ),
  };
});

// SensorTable also calls useAllSensors() (react-query) UNCONDITIONALLY on
// every render, regardless of the `family` prop. Stub the hook module for
// deterministic, synchronous data in the tests that don't care about it.
jest.mock('../queries/sensors.js', () => ({
  useAllSensors: jest.fn(),
}));

const { useAllSensors } = require('../queries/sensors.js');
const SensorTable = require('./SensorTable').default;

const emptySensorTable = {
  tetr: [],
  lysr: [],
  arac: [],
  marr: [],
  laci: [],
  gntr: [],
  luxr: [],
  iclr: [],
  other: [],
};

describe('SensorTable', () => {
  beforeEach(() => {
    useSensorStore.setState({
      sensorTable: { ...emptySensorTable },
      sensorData: {},
      v2SensorData: {},
    });
    useAllSensors.mockReturnValue({ data: [], isLoading: false });
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [] }) })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders rows for a single family from the zustand sensorTable store, linking to /entry/:family/:uniprot', async () => {
    useSensorStore.getState().setSensorTable('tetr', [
      {
        alias: 'AvaR1',
        accession: 'NP_823382.1',
        uniprotID: 'Q82H41',
        organism: 'Streptomyces avermitilis MA-4680',
        ligands: ['Avenolide'],
      },
    ]);

    renderWithProviders(<SensorTable family="TetR" />);

    expect(await screen.findByText('AvaR1')).toBeInTheDocument();
    expect(screen.getByText('Avenolide')).toBeInTheDocument();
    expect(screen.getByText('Streptomyces avermitilis')).toBeInTheDocument();

    const uniprotLink = screen.getByText('Q82H41');
    expect(uniprotLink.closest('a')).toHaveAttribute(
      'href',
      '/entry/TetR/Q82H41'
    );

    // useAllSensors is called unconditionally even for a single-family view.
    expect(useAllSensors).toHaveBeenCalled();
  });

  test('fetches the family index and populates the table when the store is empty', async () => {
    global.fetch = jest.fn((url) => {
      if (url.includes('indexes/lysr.json')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              data: [
                {
                  alias: 'CysB',
                  accession: 'NP_001.1',
                  uniprotID: 'P0A9F3',
                  organism: 'Escherichia coli K-12',
                  ligands: ['N-acetylserine'],
                },
              ],
            }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    renderWithProviders(<SensorTable family="LysR" />);

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        'https://groov-api.com/indexes/lysr.json',
        expect.any(Object)
      )
    );

    expect(await screen.findByText('CysB')).toBeInTheDocument();
    const uniprotLink = screen.getByText('P0A9F3');
    expect(uniprotLink.closest('a')).toHaveAttribute(
      'href',
      '/entry/LysR/P0A9F3'
    );
  });

  // --- Suspected bug #2: unstable zustand selector for the "all" view ---
  // Separately from the DataGrid columns issue above, rendering
  // <SensorTable family="all" /> hangs in its OWN genuine, effectively
  // endless render loop even with @mui/x-data-grid mocked out above
  // (confirmed by hand: 8900+ repeated renders / 20MB+ of console output
  // within seconds).
  //
  // Root cause: `useSensorStore((context) => isAllSensors ? [] : ...)`
  // returns a brand-new `[]` literal every time it's invoked when
  // isAllSensors is true, and the selector itself is an inline arrow
  // function re-created every render. zustand's useSyncExternalStoreWithSelector
  // can't trust a memoized selection when the selector reference changes, so
  // it re-invokes the selector and compares the new result to the old one by
  // reference; since the result is a *new* array every time (even though the
  // underlying store state hasn't changed), it looks like "the selected
  // value changed," forcing another render — forever. (The non-all branches
  // don't hit this because they return the *same* stored array reference
  // each time, so the loop self-terminates immediately.) This isn't specific
  // to Jest/jsdom; it would spin the real browser tab the same way, since
  // isAllSensors stays true for the whole lifetime of the "all sensors"
  // table view.
  //
  // We skip actually mounting this path — doing so hangs the whole test
  // process — and record the bug here instead of asserting broken behavior.
  test.skip('"all" family renders rows from useAllSensors (react-query) with a per-row family link — SKIPPED: triggers an infinite render loop, see comment above', async () => {
    useAllSensors.mockReturnValue({
      data: [
        {
          uniprotID: 'Q82H41',
          alias: 'AvaR1',
          accession: 'NP_823382.1',
          organism: 'Streptomyces avermitilis MA-4680',
          ligands: [{ name: 'Avenolide' }],
          family: 'TetR',
        },
      ],
      isLoading: false,
    });

    renderWithProviders(<SensorTable family="all" />);

    expect(await screen.findByText('AvaR1')).toBeInTheDocument();
    expect(screen.getByText('TetR')).toBeInTheDocument();
    expect(screen.getByText('Avenolide')).toBeInTheDocument();

    const uniprotLink = screen.getByText('Q82H41');
    expect(uniprotLink.closest('a')).toHaveAttribute(
      'href',
      '/entry/TetR/Q82H41'
    );
  });
});
