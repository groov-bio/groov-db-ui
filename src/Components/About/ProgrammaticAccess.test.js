import { renderWithProviders, screen, waitFor } from '../../test-utils';
import ProgrammaticAccess from './ProgrammaticAccess.js';

describe('ProgrammaticAccess', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ sensors: [] }) })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders the "Programmatic access" header', () => {
    const { container } = renderWithProviders(<ProgrammaticAccess />);
    const header = container.querySelector('#about-programmatic-access-header');
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent('Programmatic access');
  });

  test('renders the "Download all sensors" label', () => {
    const { container } = renderWithProviders(<ProgrammaticAccess />);
    const label = container.querySelector('#about-download-all-sensors');
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('Download all sensors');
  });

  test('the download-all-sensors button is enabled once data has loaded', async () => {
    const { container } = renderWithProviders(<ProgrammaticAccess />);
    const button = container.querySelector('#download-all-sensors-button');
    expect(button).toBeInTheDocument();
    await waitFor(() => expect(button).toBeEnabled());
  });

  test('links to the swagger REST API page', () => {
    const { container } = renderWithProviders(<ProgrammaticAccess />);
    const link = container.querySelector('#swagger-page');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://api.groov.bio/swagger');
  });
});
