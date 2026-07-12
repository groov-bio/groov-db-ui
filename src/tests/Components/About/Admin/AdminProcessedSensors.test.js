// AdminProcessedSensors uses @mui/x-data-grid, which hashes a value at module
// load time using the platform TextEncoder -- not provided by jsdom. Polyfill
// it before requiring the component (via `require`, not a hoisted `import`, so
// this assignment actually executes first).
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

import { renderWithProviders, screen, waitFor } from '../../../../test-utils';
const AdminProcessedSensors = require('../../../../Components/About/Admin/AdminProcessedSensors').default;

function makeUser() {
  return {
    cognitoUser: {
      getSignInUserSession: () => ({
        getIdToken: () => ({ getJwtToken: () => 'jwt-token' }),
      }),
    },
  };
}

describe('AdminProcessedSensors', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({}) })
    );
  });

  afterEach(() => jest.restoreAllMocks());

  const processedData = [
    { alias: 'AvaR1', family: 'TETR', uniprotID: 'Q82H41' },
    { alias: 'LuxR2', family: 'LUXR', uniprotID: 'P0ACU5' },
  ];

  test('renders a DataGrid row with family/alias/uniProtID from processedData', async () => {
    renderWithProviders(
      <AdminProcessedSensors
        processedData={processedData}
        setViewSensorPage={() => {}}
        user={makeUser()}
        handleSensorPromoted={() => {}}
      />
    );

    expect(await screen.findByText('AvaR1')).toBeInTheDocument();
    expect(screen.getByText('TETR')).toBeInTheDocument();
    expect(screen.getByText('Q82H41')).toBeInTheDocument();
  });

  test('clicking "View" on a row calls setViewSensorPage with that row\'s family/uniProtID', async () => {
    const setViewSensorPage = jest.fn();
    const { user } = renderWithProviders(
      <AdminProcessedSensors
        processedData={processedData}
        setViewSensorPage={setViewSensorPage}
        user={makeUser()}
        handleSensorPromoted={() => {}}
      />
    );

    const viewButtons = await screen.findAllByRole('button', { name: 'View' });
    await user.click(viewButtons[0]);

    expect(setViewSensorPage).toHaveBeenCalledWith({
      open: true,
      data: { family: 'TETR', uniProtID: 'Q82H41' },
    });
  });

  test('clicking "Approve" POSTs to approveProcessedSensor with the row family/uniProtID', async () => {
    const { user } = renderWithProviders(
      <AdminProcessedSensors
        processedData={processedData}
        setViewSensorPage={() => {}}
        user={makeUser()}
        handleSensorPromoted={() => {}}
      />
    );

    const approveButtons = await screen.findAllByRole('button', { name: 'Approve' });
    await user.click(approveButtons[0]);

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.groov.bio/approveProcessedSensor',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ family: 'TETR', uniProtID: 'Q82H41' }),
        })
      )
    );
  });

  test('clicking "Reject" POSTs to rejectProcessedSensor with the row family/uniProtID', async () => {
    const { user } = renderWithProviders(
      <AdminProcessedSensors
        processedData={processedData}
        setViewSensorPage={() => {}}
        user={makeUser()}
        handleSensorPromoted={() => {}}
      />
    );

    const rejectButtons = await screen.findAllByRole('button', { name: 'Reject' });
    await user.click(rejectButtons[0]);

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.groov.bio/rejectProcessedSensor',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ family: 'TETR', uniProtID: 'Q82H41' }),
        })
      )
    );
  });
});
