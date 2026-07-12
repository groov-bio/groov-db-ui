// Uses @mui/x-data-grid, which hashes a value at module load time using the
// platform TextEncoder -- not provided by jsdom. Polyfill it before requiring
// the component (via `require`, not a hoisted `import`, so this assignment
// actually executes first).
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

import { renderWithProviders, screen, waitFor } from '../../../../../test-utils';
const AdminPublishedSensorsV2 = require('../../../../../Components/About/Admin/v2/AdminPublishedSensorsV2').default;

function makeUser() {
  return {
    cognitoUser: {
      getSignInUserSession: () => ({
        getIdToken: () => ({ getJwtToken: () => 'jwt-token' }),
      }),
    },
  };
}

// NOTE: MUI DataGrid's row virtualizer measures the scroll container's real
// layout size, which jsdom always reports as 0, so only the first data row
// actually mounts -- keep the fetched sensor list to a single entry per test.
const sensor = {
  id: 'GRV-T001',
  alias: 'AvaR1',
  uniprot_id: 'Q82H41',
  organism_name: 'Escherichia coli',
  category: 'tetr',
  ligands: ['IPTG'],
};

describe('AdminPublishedSensorsV2', () => {
  beforeEach(() => {
    global.fetch = jest.fn((url) => {
      if (url.includes('index.json')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ sensors: [sensor] }),
        });
      }
      return Promise.resolve({ status: 200, ok: true, json: () => Promise.resolve({}) });
    });
  });

  afterEach(() => jest.restoreAllMocks());

  test('fetches the published index and renders a DataGrid row for the sensor', async () => {
    renderWithProviders(<AdminPublishedSensorsV2 user={makeUser()} />);

    expect(await screen.findByText('GRV-T001')).toBeInTheDocument();
    expect(screen.getByText('AvaR1')).toBeInTheDocument();
    expect(screen.getByText('Q82H41')).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('https://groov-api.com/v2/index.json'),
      expect.objectContaining({ cache: 'no-store' })
    );
  });

  test('typing in the search box filters out a non-matching sensor', async () => {
    const { user } = renderWithProviders(<AdminPublishedSensorsV2 user={makeUser()} />);
    await screen.findByText('GRV-T001');

    await user.type(screen.getByLabelText(/search sensors/i), 'nonexistent-query');

    expect(screen.queryByText('GRV-T001')).not.toBeInTheDocument();
    expect(screen.getByText('0 of 1 shown')).toBeInTheDocument();
  });

  test('Delete button opens a confirmation dialog, and the Delete confirm button stays disabled until the GRV ID is typed exactly', async () => {
    const { user } = renderWithProviders(<AdminPublishedSensorsV2 user={makeUser()} />);
    await screen.findByText('GRV-T001');

    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(
      await screen.findByRole('heading', { name: /delete sensor permanently/i })
    ).toBeInTheDocument();

    const confirmButton = screen.getByRole('button', { name: /^delete$/i });
    expect(confirmButton).toBeDisabled();

    await user.type(screen.getByLabelText(/type GRV-T001 to confirm/i), 'GRV-T001');
    expect(confirmButton).toBeEnabled();
  });

  test('confirming delete calls deleteSensorV2 and removes the row on 200', async () => {
    global.fetch.mockImplementation((url, opts) => {
      if (url.includes('index.json')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ sensors: [sensor] }) });
      }
      if (url.includes('deleteSensor')) {
        return Promise.resolve({
          status: 200,
          ok: true,
          json: () => Promise.resolve({ message: 'ok', grv_id: 'GRV-T001' }),
        });
      }
      return Promise.resolve({ status: 200, ok: true, json: () => Promise.resolve({}) });
    });

    const { user } = renderWithProviders(<AdminPublishedSensorsV2 user={makeUser()} />);
    await screen.findByText('GRV-T001');

    await user.click(screen.getByRole('button', { name: 'Delete' }));
    await user.type(screen.getByLabelText(/type GRV-T001 to confirm/i), 'GRV-T001');
    await user.click(screen.getByRole('button', { name: /^delete$/i }));

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.groov.bio/v2/deleteSensor',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ category: 'tetr', grv_id: 'GRV-T001' }),
        })
      )
    );
    await waitFor(() => expect(screen.queryByText('GRV-T001')).not.toBeInTheDocument());
  });
});
