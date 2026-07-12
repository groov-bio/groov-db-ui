import React from 'react';
import { renderWithProviders, screen, waitFor } from '../../test-utils';
import useV2SensorTableStore from '../../zustand/v2SensorTable.store.js';

// SensorTableV2 imports @mui/x-data-grid directly, whose hash util calls
// `new TextEncoder()` at module scope. jest-environment-jsdom does not
// provide a global TextEncoder, so we polyfill it before requiring the
// component. This must be a plain `require()` (not `import`) so Babel does
// not hoist it above this line the way it would with ES `import` syntax.
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
const SensorTableV2 = require('./SensorTableV2').default;

function resetV2TableStore() {
  // Reset every family key the store actually knows about (not a hand-picked
  // subset) back to its initial null/false, so keys we don't explicitly
  // list here (e.g. 'luxr') don't end up `undefined` — which would make
  // fetchTable's `tables[key] !== null` guard true and skip the fetch.
  useV2SensorTableStore.setState((state) => ({
    tables: Object.fromEntries(Object.keys(state.tables).map((k) => [k, null])),
    loading: Object.fromEntries(
      Object.keys(state.loading).map((k) => [k, false])
    ),
  }));
}

describe('SensorTableV2', () => {
  beforeEach(() => {
    resetV2TableStore();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders rows for a single family from the store, with an ID link to /sensor/:id', async () => {
    useV2SensorTableStore.setState((state) => ({
      tables: {
        ...state.tables,
        tetr: [
          {
            id: 'GRV-T00001',
            alias: 'AvaR1',
            uniprot_id: 'Q82H41',
            organism_name: 'Streptomyces avermitilis MA-4680',
            ligands: ['Avenolide'],
          },
        ],
      },
    }));
    global.fetch = jest.fn();

    renderWithProviders(<SensorTableV2 family="TetR" />);

    expect(await screen.findByText('AvaR1')).toBeInTheDocument();
    expect(screen.getByText('Streptomyces avermitilis')).toBeInTheDocument();
    expect(screen.getByText('Avenolide')).toBeInTheDocument();

    const idLink = screen.getByText('GRV-T00001');
    expect(idLink.closest('a')).toHaveAttribute('href', '/sensor/GRV-T00001');

    // Store already had data for this family, so fetchTable should bail
    // out before calling fetch.
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('fetches the v2 family index (cache-busted) when the store has not loaded this family yet', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            data: [
              {
                id: 'GRV-Y00002',
                alias: 'LuxR1',
                uniprot_id: 'P99999',
                organism_name: 'Vibrio fischeri',
                ligands: [],
              },
            ],
          }),
      })
    );

    renderWithProviders(<SensorTableV2 family="LuxR" />);

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(global.fetch.mock.calls[0][0]).toEqual(
      expect.stringContaining('https://groov-api.com/v2/indexes/luxr.json')
    );

    expect(await screen.findByText('LuxR1')).toBeInTheDocument();
    expect(screen.getByText('None submitted')).toBeInTheDocument();
  });

  test('"all" family renders a UniProt column linking out to uniprot.org', async () => {
    useV2SensorTableStore.setState((state) => ({
      tables: {
        ...state.tables,
        all: [
          {
            id: 'GRV-T00001',
            alias: 'AvaR1',
            uniprot_id: 'Q82H41',
            organism_name: 'Streptomyces avermitilis MA-4680',
            ligands: ['Avenolide'],
          },
        ],
      },
    }));
    global.fetch = jest.fn();

    renderWithProviders(<SensorTableV2 family="all" />);

    expect(await screen.findByText('Q82H41')).toBeInTheDocument();
    const uniprotLink = screen.getByText('Q82H41');
    expect(uniprotLink.closest('a')).toHaveAttribute(
      'href',
      'https://www.uniprot.org/uniprot/Q82H41'
    );
    expect(uniprotLink.closest('a')).toHaveAttribute('target', '_blank');
  });
});
