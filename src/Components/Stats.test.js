import { renderWithProviders } from '../test-utils';
import useSearchStore from '../zustand/search.store.js';
import Stats from './Stats.js';

describe('Stats', () => {
  afterEach(() => {
    // Reset the shared zustand store back to its default shape so other
    // tests (in this file or others sharing the module registry) aren't
    // affected by state we set here.
    useSearchStore.setState({
      stats: { regulators: 'Loading ...', ligands: 'Loading ...' },
    });
  });

  test('shows the default loading placeholders before stats have been fetched', () => {
    const { container } = renderWithProviders(<Stats />);
    expect(container.querySelector('#regulators-count')).toHaveTextContent(
      'Regulators: Loading ...'
    );
    expect(container.querySelector('#ligands-count')).toHaveTextContent(
      'Unique ligands: Loading ...'
    );
  });

  test('renders the regulator and ligand counts once the search store has stats', () => {
    useSearchStore.setState({ stats: { regulators: 42, ligands: 17 } });

    const { container } = renderWithProviders(<Stats />);
    expect(container.querySelector('#regulators-count')).toHaveTextContent(
      'Regulators: 42'
    );
    expect(container.querySelector('#ligands-count')).toHaveTextContent(
      'Unique ligands: 17'
    );
  });
});
