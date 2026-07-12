// Admin.js does `import '@aws-amplify/ui-react/styles.css'`. The installed
// @aws-amplify/ui-react only exposes that path via its package.json "exports"
// map (to dist/styles.css); Jest 27's resolver does not honor "exports" subpath
// mappings, so the bare specifier fails to resolve. Declare it virtual so Jest
// treats the side-effect-only CSS import as a no-op module.
jest.mock('@aws-amplify/ui-react/styles.css', () => ({}), { virtual: true });

// Admin.js -> AdminTempSensors.js/AdminProcessedSensors.js -> @mui/x-data-grid
// hashes a value at module load time using the platform TextEncoder, which
// jsdom's test environment does not provide. Polyfill it before requiring the
// component chain below (via `require`, not a hoisted `import`, so this
// assignment actually executes first).
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

import { renderWithProviders, screen, waitFor } from '../../../test-utils';
import useUserStore from '../../../zustand/user.store';
import useFeatureFlagsStore from '../../../zustand/featureFlags.store';
const Admin = require('./Admin').default;

function makeUser() {
  return {
    cognitoUser: {
      getSignInUserSession: () => ({
        getIdToken: () => ({ getJwtToken: () => 'jwt-token' }),
      }),
    },
  };
}

describe('Admin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useUserStore.setState({ user: makeUser() });
    useFeatureFlagsStore.setState({ flags: {}, loading: false, error: null });
  });

  afterEach(() => jest.restoreAllMocks());

  test('shows a loading spinner (and no header) while feature flags have not loaded yet', () => {
    // Default store state above: flags = {} (not ready).
    renderWithProviders(<Admin />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByText(/administrator page/i)).not.toBeInTheDocument();
  });

  test('shows a loading spinner while flags are explicitly marked loading', () => {
    useFeatureFlagsStore.setState({ flags: {}, loading: true, error: null });
    renderWithProviders(<Admin />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders the V2 admin portal header when the v2_admin_portal flag is on', async () => {
    useFeatureFlagsStore.setState({
      flags: { v2_admin_portal: { local: true, prod: true } },
      loading: false,
      error: null,
    });
    renderWithProviders(<Admin />);
    expect(await screen.findByText('Administrator page (V2)')).toBeInTheDocument();
  });

  test('renders the V1 admin page and a processed-sensor DataGrid row when the v2_admin_portal flag is off', async () => {
    useFeatureFlagsStore.setState({
      flags: { v2_admin_portal: { local: false, prod: false } },
      loading: false,
      error: null,
    });
    global.fetch = jest.fn((url) => {
      if (url.includes('getAllProcessedTemp')) {
        return Promise.resolve({
          status: 200,
          ok: true,
          json: () =>
            Promise.resolve([
              { alias: 'AvaR1', family: 'TETR', uniprotID: 'Q82H41' },
            ]),
        });
      }
      // getAllTempSensors
      return Promise.resolve({ status: 200, ok: true, json: () => Promise.resolve([]) });
    });

    renderWithProviders(<Admin />);

    expect(await screen.findByText('Administrator page')).toBeInTheDocument();
    // The processed-sensor row flows through from fetch -> AdminV1 state ->
    // AdminProcessedSensors -> DataGrid.
    expect(await screen.findByText('AvaR1')).toBeInTheDocument();
    expect(screen.getByText('Q82H41')).toBeInTheDocument();
  });
});
