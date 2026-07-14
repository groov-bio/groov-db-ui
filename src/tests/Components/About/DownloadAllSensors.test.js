import { renderWithProviders, screen, waitFor } from '../../../test-utils';
import DownloadAllSensors from '../../../Components/About/DownloadAllSensors.js';

// DownloadAllSensors is a self-contained button: it starts enabled and only
// fetches the all-sensors JSON when clicked, showing a disabled "Downloading..."
// state while the request is in flight, then triggering a browser file download.
describe('DownloadAllSensors', () => {
  let createObjectURL;
  let revokeObjectURL;

  beforeEach(() => {
    // jsdom doesn't implement the object-URL APIs the download path uses.
    createObjectURL = jest.fn(() => 'blob:mock-url');
    revokeObjectURL = jest.fn();
    global.URL.createObjectURL = createObjectURL;
    global.URL.revokeObjectURL = revokeObjectURL;
    // The component triggers the download via <a>.click(); jsdom logs a
    // "navigation not implemented" error for that, so stub it out.
    jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete global.fetch;
  });

  test('renders an enabled "Download All Sensors" button by default', () => {
    renderWithProviders(<DownloadAllSensors />);
    const button = screen.getByRole('button', { name: /download all sensors/i });
    expect(button).toBeEnabled();
    expect(screen.getByTestId('DownloadIcon')).toBeInTheDocument();
  });

  test('fetches all sensors and triggers a file download on click', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ sensors: [{ id: 's1' }] }),
      })
    );

    const { user } = renderWithProviders(<DownloadAllSensors />);
    await user.click(screen.getByRole('button'));

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://groov-api.com/v2/all-sensors.json')
      )
    );
    // A blob URL is created for the download link and revoked afterward.
    await waitFor(() => expect(createObjectURL).toHaveBeenCalled());
    expect(revokeObjectURL).toHaveBeenCalled();
    // Button returns to its idle state once the download completes.
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /download all sensors/i })
      ).toBeEnabled()
    );
  });

  test('shows a disabled "Downloading..." state while the fetch is in flight', async () => {
    let resolveFetch;
    global.fetch = jest.fn(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );

    const { user } = renderWithProviders(<DownloadAllSensors />);
    await user.click(screen.getByRole('button'));

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /downloading/i })
      ).toBeDisabled()
    );

    resolveFetch({ ok: true, json: () => Promise.resolve({}) });
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /download all sensors/i })
      ).toBeEnabled()
    );
  });

  test('re-enables the button when the fetch fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch = jest.fn(() => Promise.reject(new Error('network error')));

    const { user } = renderWithProviders(<DownloadAllSensors />);
    await user.click(screen.getByRole('button'));

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /download all sensors/i })
      ).toBeEnabled()
    );
  });
});
