import { renderWithProviders, screen, waitFor } from '../../test-utils';
import DownloadAllSensors from './DownloadAllSensors.js';

describe('DownloadAllSensors', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('shows a loading state, then "Download All Sensors" once the query resolves', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ sensors: [{ id: 's1' }] }),
      })
    );

    renderWithProviders(<DownloadAllSensors />);

    // Real truth: button starts disabled while the all-sensors query loads.
    expect(screen.getByRole('button')).toBeDisabled();

    await waitFor(() =>
      expect(screen.getByText('Download All Sensors')).toBeInTheDocument()
    );
    expect(screen.getByRole('button')).toBeEnabled();
  });

  test('shows an error state and disables the button when the fetch fails', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, json: () => Promise.resolve({}) })
    );

    renderWithProviders(<DownloadAllSensors />);

    await waitFor(() =>
      expect(screen.getByText('Error loading data')).toBeInTheDocument()
    );
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
