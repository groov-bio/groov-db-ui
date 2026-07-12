// Uses @mui/x-data-grid, which hashes a value at module load time using the
// platform TextEncoder -- not provided by jsdom. Polyfill it before requiring
// the component (via `require`, not a hoisted `import`, so this assignment
// actually executes first).
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

import { renderWithProviders, screen, waitFor } from '../../../../test-utils';
const AdminTempSensorsV2 = require('./AdminTempSensorsV2').default;

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
// actually mounts -- keep each `submissions` array to a single entry.
const submission = {
  submissionUUID: 'uuid-temp-1',
  user: 'alice',
  timeSubmit: 1700000000000,
  sensor: { proteins: [{ alias: 'AvaR1' }, { alias: 'AvaR2' }] },
};

describe('AdminTempSensorsV2', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 200, ok: true, json: () => Promise.resolve({}) })
    );
  });

  afterEach(() => jest.restoreAllMocks());

  test('renders a DataGrid row with the joined protein aliases, user, and protein count', async () => {
    renderWithProviders(
      <AdminTempSensorsV2
        user={makeUser()}
        submissions={[submission]}
        processedUUIDs={new Set()}
        onApproved={() => {}}
        onRejected={() => {}}
        setApproveIsLoading={() => {}}
      />
    );

    expect(await screen.findByRole('button', { name: 'AvaR1, AvaR2' })).toBeInTheDocument();
    expect(screen.getByText('alice')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('shows "Processed" (disabled) instead of "Approve" once the submission UUID is in processedUUIDs', async () => {
    renderWithProviders(
      <AdminTempSensorsV2
        user={makeUser()}
        submissions={[submission]}
        processedUUIDs={new Set(['uuid-temp-1'])}
        onApproved={() => {}}
        onRejected={() => {}}
        setApproveIsLoading={() => {}}
      />
    );

    const processedButton = await screen.findByRole('button', { name: 'Processed' });
    expect(processedButton).toBeDisabled();
  });

  test('clicking Approve POSTs to addNewSensor with the submissionUUID and, on 202, calls onApproved', async () => {
    global.fetch.mockImplementation(() =>
      Promise.resolve({ status: 202, ok: true, json: () => Promise.resolve({}) })
    );
    const onApproved = jest.fn();
    const setApproveIsLoading = jest.fn();
    const { user } = renderWithProviders(
      <AdminTempSensorsV2
        user={makeUser()}
        submissions={[submission]}
        processedUUIDs={new Set()}
        onApproved={onApproved}
        onRejected={() => {}}
        setApproveIsLoading={setApproveIsLoading}
      />
    );

    await user.click(await screen.findByRole('button', { name: 'Approve' }));

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.groov.bio/v2/addNewSensor',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ submissionUUID: 'uuid-temp-1' }),
        })
      )
    );
    await waitFor(() => expect(onApproved).toHaveBeenCalledWith('uuid-temp-1'));
    expect(setApproveIsLoading).toHaveBeenCalledWith(true);
    expect(setApproveIsLoading).toHaveBeenCalledWith(false);
  });

  test('clicking the aliases button switches to the Preview tab and shows the submission preview', async () => {
    const { user } = renderWithProviders(
      <AdminTempSensorsV2
        user={makeUser()}
        submissions={[submission]}
        processedUUIDs={new Set()}
        onApproved={() => {}}
        onRejected={() => {}}
        setApproveIsLoading={() => {}}
      />
    );

    await user.click(await screen.findByRole('button', { name: 'AvaR1, AvaR2' }));

    expect(
      await screen.findByRole('tab', { name: /^preview/i })
    ).toHaveAttribute('aria-selected', 'true');
    // TempSensorPreviewV2 shows a "2 proteins" chip for a multi-protein submission.
    expect(await screen.findByText('2 proteins')).toBeInTheDocument();
  });
});
