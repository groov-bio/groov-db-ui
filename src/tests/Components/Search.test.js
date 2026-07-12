import { renderWithProviders, screen, waitFor } from '../../test-utils';
import Search from '../../Components/Search';
import useSearchStore from '../../zustand/search.store.js';

describe('Search', () => {
  beforeEach(() => {
    useSearchStore.setState({
      stats: { regulators: 'Loading ...', ligands: 'Loading ...' },
      data: [],
      rawData: [],
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('fetches the v2 index on mount and shows a disabled "Loading..." combobox until it resolves', () => {
    // A never-resolving fetch keeps the store's `data` empty, so the field
    // stays in its loading state.
    global.fetch = jest.fn(() => new Promise(() => {}));
    renderWithProviders(<Search />);

    expect(screen.getByLabelText('Loading...')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeDisabled();
    expect(global.fetch.mock.calls[0][0]).toContain(
      'https://groov-api.com/v2/index.json'
    );
  });

  test('lists a GRV-id / ligand result linking to /sensor/:id once the index loads', async () => {
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

    // Field becomes enabled once labels are populated from the index.
    await waitFor(() =>
      expect(screen.getByRole('combobox')).not.toBeDisabled()
    );

    await user.type(screen.getByRole('combobox'), 'Avenolide');

    const option = await screen.findByText(
      'GRV-T00001 — Avenolide (AvaR1/TetR)'
    );
    expect(option.closest('a')).toHaveAttribute('href', '/sensor/GRV-T00001');
  });

  test('keeps a ligand-less sensor reachable, linking to /sensor/:id', async () => {
    const mockV2Index = {
      stats: { ligands: 1, regulators: 1 },
      sensors: [
        { id: 'GRV-T00002', alias: 'RbsR', category: 'LacI', ligands: [] },
      ],
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(mockV2Index) })
    );

    const { user } = renderWithProviders(<Search />);

    await waitFor(() =>
      expect(screen.getByRole('combobox')).not.toBeDisabled()
    );

    await user.type(screen.getByRole('combobox'), 'RbsR');

    const option = await screen.findByText('GRV-T00002 — RbsR (LacI)');
    expect(option.closest('a')).toHaveAttribute('href', '/sensor/GRV-T00002');
  });
});
