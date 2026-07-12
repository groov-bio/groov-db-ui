import React from 'react';
import { renderWithProviders, screen, waitFor } from '../test-utils';
import Search from './Search';
import useSearchStore from '../zustand/search.store.js';
import useFeatureFlagsStore from '../zustand/featureFlags.store.js';

describe('Search', () => {
  beforeEach(() => {
    useSearchStore.setState({
      stats: { regulators: 'Loading ...', ligands: 'Loading ...' },
      data: [],
      rawData: [],
    });
    useFeatureFlagsStore.setState({ flags: {}, loading: false, error: null });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('shows the loading state and a disabled combobox until feature flags resolve', () => {
    // No fetch is stubbed and flags are never seeded, so the component's
    // effect (which waits on flagsReady/flagsError) never fires a fetch.
    global.fetch = jest.fn();
    renderWithProviders(<Search />);

    expect(screen.getByLabelText('Loading...')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeDisabled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('V1 path: fetches the legacy index and lists a ligand/alias/family match linking to /entry/:family/:uniprot', async () => {
    // v2_sensor_page explicitly off -> legacy branch; flags are "ready"
    // because Object.keys(flags).length > 0.
    useFeatureFlagsStore.getState().setFlags({
      v2_sensor_page: { local: false },
    });

    const mockIndex = {
      Q82H41: {
        alias: 'AvaR1',
        family: 'TetR',
        ligands: ['Avenolide'],
        ligandCount: 1,
      },
      stats: { ligands: 12, regulators: 8 },
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(mockIndex) })
    );

    const { user } = renderWithProviders(<Search />);

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(global.fetch.mock.calls[0][0]).toContain(
      'https://groov-api.com/index.json'
    );

    // Wait for the field to become enabled once labels are populated.
    await waitFor(() =>
      expect(screen.getByRole('combobox')).not.toBeDisabled()
    );

    await user.type(screen.getByRole('combobox'), 'Avenolide');

    const option = await screen.findByText('Avenolide (AvaR1/TetR)');
    expect(option.closest('a')).toHaveAttribute(
      'href',
      '/entry/TetR/Q82H41'
    );
  });

  test('V2 path: fetches the v2 index and lists a GRV-id result linking to /sensor/:id', async () => {
    useFeatureFlagsStore.getState().setFlags({
      v2_sensor_page: { local: true },
    });

    const mockV2Index = {
      stats: { ligands: 20, regulators: 15 },
      sensors: [
        {
          id: 'GRV-T00001',
          alias: 'AvaR1',
          category: 'TetR',
          ligands: ['Avenolide'],
        },
      ],
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(mockV2Index) })
    );

    const { user } = renderWithProviders(<Search />);

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(global.fetch.mock.calls[0][0]).toContain(
      'https://groov-api.com/v2/index.json'
    );

    await waitFor(() =>
      expect(screen.getByRole('combobox')).not.toBeDisabled()
    );

    await user.type(screen.getByRole('combobox'), 'Avenolide');

    const option = await screen.findByText(
      'GRV-T00001 — Avenolide (AvaR1/TetR)'
    );
    expect(option.closest('a')).toHaveAttribute('href', '/sensor/GRV-T00001');
  });
});
