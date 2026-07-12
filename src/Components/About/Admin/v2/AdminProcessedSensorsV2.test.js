// Uses @mui/x-data-grid, which hashes a value at module load time using the
// platform TextEncoder -- not provided by jsdom. Polyfill it before requiring
// the component (via `require`, not a hoisted `import`, so this assignment
// actually executes first).
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

import { renderWithProviders, screen, waitFor, within } from '../../../../test-utils';
const AdminProcessedSensorsV2 = require('./AdminProcessedSensorsV2').default;

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
// layout size, which jsdom always reports as 0. In practice this means only
// the first data row actually mounts in this test environment, so each case
// below renders a single-row `processed` array rather than asserting on a
// second simultaneously-rendered row.
const newRow = {
  submissionUUID: 'uuid-1',
  category: 'tetr',
  data: { type: 'new', proteins: [{ alias: 'AvaR1' }] },
  isEdit: false,
};

const editRow = {
  submissionUUID: 'uuid-2',
  category: 'luxr',
  data: { type: 'edit', proteins: [{ alias: 'LuxR2' }] },
  previousData: { type: 'edit', proteins: [{ alias: 'LuxR2-old' }] },
  isEdit: true,
  editTarget: { grv_id: 'GRV-X001' },
};

describe('AdminProcessedSensorsV2', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 200, ok: true, json: () => Promise.resolve({}) })
    );
  });

  afterEach(() => jest.restoreAllMocks());

  test('renders a DataGrid row for a NEW submission with its alias and a "NEW" kind chip', async () => {
    renderWithProviders(
      <AdminProcessedSensorsV2
        processed={[newRow]}
        user={makeUser()}
        onPromoted={() => {}}
        onRejected={() => {}}
      />
    );

    expect(await screen.findByText('AvaR1')).toBeInTheDocument();
    // "NEW" also appears in the panel's static description text, so scope the
    // chip assertion to the grid itself.
    expect(within(screen.getByRole('grid')).getByText('NEW')).toBeInTheDocument();
  });

  test('renders a DataGrid row for an EDIT submission with its alias, "EDIT" chip and target GRV ID', async () => {
    renderWithProviders(
      <AdminProcessedSensorsV2
        processed={[editRow]}
        user={makeUser()}
        onPromoted={() => {}}
        onRejected={() => {}}
      />
    );

    expect(await screen.findByText('LuxR2')).toBeInTheDocument();
    // "EDIT" also appears in the panel's static description text, so scope the
    // chip assertion to the grid itself.
    expect(within(screen.getByRole('grid')).getByText('EDIT')).toBeInTheDocument();
    expect(screen.getByText('GRV-X001')).toBeInTheDocument();
  });

  test('clicking Promote opens a confirmation dialog naming the row', async () => {
    const { user } = renderWithProviders(
      <AdminProcessedSensorsV2
        processed={[newRow]}
        user={makeUser()}
        onPromoted={() => {}}
        onRejected={() => {}}
      />
    );
    const promoteButton = await screen.findByRole('button', { name: 'Promote' });
    await user.click(promoteButton);

    expect(
      await screen.findByRole('heading', { name: /promote to production/i })
    ).toBeInTheDocument();
  });

  test('confirming Promote calls approveProcessedSensorV2 and, on 200, calls onPromoted', async () => {
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        ok: true,
        json: () => Promise.resolve({ grv_id: 'GRV-T099' }),
      })
    );
    const onPromoted = jest.fn();
    const { user } = renderWithProviders(
      <AdminProcessedSensorsV2
        processed={[newRow]}
        user={makeUser()}
        onPromoted={onPromoted}
        onRejected={() => {}}
      />
    );

    await user.click(await screen.findByRole('button', { name: 'Promote' }));
    // The dialog's own confirm button is the last "Promote" button on screen
    // (the grid action button plus the dialog's confirm button both say "Promote").
    const confirmButtons = await screen.findAllByRole('button', { name: 'Promote' });
    await user.click(confirmButtons[confirmButtons.length - 1]);

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.groov.bio/v2/approveProcessedSensor',
        expect.objectContaining({ method: 'POST' })
      )
    );
    await waitFor(() => expect(onPromoted).toHaveBeenCalledWith('uuid-1'));
  });

  test('clicking View on an EDIT row shows the diff view with "Sections changed"', async () => {
    const { user } = renderWithProviders(
      <AdminProcessedSensorsV2
        processed={[editRow]}
        user={makeUser()}
        onPromoted={() => {}}
        onRejected={() => {}}
      />
    );
    const viewButton = await screen.findByRole('button', { name: 'View' });
    await user.click(viewButton);

    expect(await screen.findByText('Sections changed')).toBeInTheDocument();
  });
});
