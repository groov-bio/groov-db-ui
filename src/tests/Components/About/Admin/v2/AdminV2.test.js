// AdminV2.js -> AdminTempSensorsV2/AdminProcessedSensorsV2/AdminPublishedSensorsV2
// -> @mui/x-data-grid, which hashes a value at module load time using the
// platform TextEncoder -- not provided by jsdom. Polyfill it before requiring
// the component chain below (via `require`, not a hoisted `import`, so this
// assignment actually executes first).
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

import { renderWithProviders, screen } from '../../../../../test-utils';
import useUserStore from '../../../../../zustand/user.store';
const AdminV2 = require('../../../../../Components/About/Admin/v2/AdminV2').default;

function makeUser() {
  return {
    cognitoUser: {
      getSignInUserSession: () => ({
        getIdToken: () => ({ getJwtToken: () => 'jwt-token' }),
      }),
    },
  };
}

describe('AdminV2', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useUserStore.setState({ user: null });
  });

  afterEach(() => jest.restoreAllMocks());

  test('renders the V2 header and stays in the loading state when there is no user', () => {
    renderWithProviders(<AdminV2 />);
    expect(screen.getByText('Administrator page (V2)')).toBeInTheDocument();
    // With no user in the store, the data-loading effect returns early, so
    // submissions/processed stay null and the page never leaves the spinner.
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('with a signed-in user and mocked fetch, loads submissions/processed and renders their rows', async () => {
    useUserStore.setState({ user: makeUser() });
    global.fetch = jest.fn((url) => {
      if (url.includes('getAllTempSensors')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({
              submissions: [
                {
                  submissionUUID: 'uuid-temp-1',
                  user: 'alice',
                  sensor: { proteins: [{ alias: 'AvaR1' }] },
                },
              ],
            }),
        });
      }
      if (url.includes('getAllProcessedTemp')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({
              processed: [
                {
                  submissionUUID: 'uuid-processed-1',
                  category: 'tetr',
                  data: { type: 'new', proteins: [{ alias: 'LuxR2' }] },
                },
              ],
            }),
        });
      }
      // fetchPublishedSensorsV2 for AdminPublishedSensorsV2
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ sensors: [] }),
      });
    });

    renderWithProviders(<AdminV2 />);

    expect(await screen.findByText('AvaR1')).toBeInTheDocument();
    expect(await screen.findByText('LuxR2')).toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
});
