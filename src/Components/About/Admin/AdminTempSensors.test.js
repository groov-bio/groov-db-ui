// AdminTempSensors uses @mui/x-data-grid, which hashes a value at module load
// time using the platform TextEncoder -- not provided by jsdom. Polyfill it
// before requiring the component (via `require`, not a hoisted `import`, so
// this assignment actually executes first).
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

import { renderWithProviders, screen, waitFor } from '../../../test-utils';
import useUserStore from '../../../zustand/user.store';
const AdminTempSensors = require('./AdminTempSensors').default;

function makeUser() {
  return {
    cognitoUser: {
      getSignInUserSession: () => ({
        getIdToken: () => ({ getJwtToken: () => 'jwt-token' }),
      }),
    },
  };
}

const tempData = [
  {
    PK: 'TETR',
    SK: 'Q82H41#ABOUT',
    uniProtID: 'Q82H41',
    family: 'TETR',
    user: 'alice@example.com',
    timeSubmit: 1700000000000,
    // TempSensor (the preview shown after clicking the alias) destructures
    // `data.about` unconditionally, so it must always be present.
    about: { alias: 'AvaR1', accession: 'ABC123', mechanism: 'Apo-repressor', about: 'desc' },
  },
];

describe('AdminTempSensors', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useUserStore.setState({ user: makeUser() });
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({}) })
    );
  });

  afterEach(() => jest.restoreAllMocks());

  test('renders a DataGrid row with the alias and user from tempData', async () => {
    renderWithProviders(
      <AdminTempSensors
        tempData={tempData}
        processedData={[]}
        setApproveIsLoading={() => {}}
        handleProcessedAdded={() => {}}
      />
    );

    expect(await screen.findByRole('button', { name: 'Q82H41#ABOUT' })).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
  });

  test('clicking "Reject" POSTs to deleteTemp with the row alias (SK) as sensorId', async () => {
    const { user } = renderWithProviders(
      <AdminTempSensors
        tempData={tempData}
        processedData={[]}
        setApproveIsLoading={() => {}}
        handleProcessedAdded={() => {}}
      />
    );

    const rejectButton = await screen.findByRole('button', { name: 'Reject' });
    await user.click(rejectButton);

    // rejectEntry builds the URL with a plain template literal (no
    // encodeURIComponent), so the '#' in the SK is sent through unencoded.
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.groov.bio/deleteTemp?sensorId=Q82H41#ABOUT',
        expect.objectContaining({ method: 'POST' })
      )
    );
  });

  test('the Approve button is disabled once the sensor already exists in processedData', async () => {
    renderWithProviders(
      <AdminTempSensors
        tempData={tempData}
        processedData={[{ uniprotID: 'Q82H41#ABOUT' }]}
        setApproveIsLoading={() => {}}
        handleProcessedAdded={() => {}}
      />
    );

    expect(await screen.findByRole('button', { name: 'Approve' })).toBeDisabled();
  });

  test('clicking the alias switches to the Sensor Preview tab', async () => {
    const { user } = renderWithProviders(
      <AdminTempSensors
        tempData={tempData}
        processedData={[]}
        setApproveIsLoading={() => {}}
        handleProcessedAdded={() => {}}
      />
    );

    const aliasButton = await screen.findByRole('button', { name: 'Q82H41#ABOUT' });
    await user.click(aliasButton);

    expect(
      await screen.findByRole('tab', { name: /sensor preview/i })
    ).toHaveAttribute('aria-selected', 'true');
  });
});
