import { Routes, Route } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { renderWithProviders, screen, waitFor } from '../../test-utils';
import useUserStore from '../../zustand/user.store';
import useFeatureFlagsStore from '../../zustand/featureFlags.store';

// RequireAdminAuth -> Admin.js does `import '@aws-amplify/ui-react/styles.css'`.
// The installed @aws-amplify/ui-react only exposes that path via its package.json
// "exports" map (to dist/styles.css); Jest 27's resolver does not honor "exports"
// subpath mappings, so the bare specifier fails to resolve at all. Declare it
// virtual so Jest treats the side-effect-only CSS import as a no-op module.
jest.mock('@aws-amplify/ui-react/styles.css', () => ({}), { virtual: true });

// Admin.js -> AdminTempSensors.js -> @mui/x-data-grid hashes a value at module
// load time using the platform TextEncoder, which jsdom's test environment does
// not provide. Polyfill it before requiring the component chain below (using
// `require`, not a hoisted `import`, so this assignment actually runs first).
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

const { RequireAdminAuth } = require('./RequireAdminAuth');

function renderGuard(route = '/admin') {
  return renderWithProviders(
    <Routes>
      <Route
        path="/admin"
        element={
          <RequireAdminAuth>
            <div>Should not render</div>
          </RequireAdminAuth>
        }
      />
      <Route path="/account" element={<div>Account Page</div>} />
    </Routes>,
    { route }
  );
}

describe('RequireAdminAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useUserStore.setState({ user: null });
    useFeatureFlagsStore.setState({ flags: {}, loading: false, error: null });
    Auth.currentAuthenticatedUser.mockRejectedValue(new Error('No current user'));
  });

  test('navigates to /account when not authenticated', async () => {
    renderGuard();
    expect(await screen.findByText('Account Page')).toBeInTheDocument();
    expect(screen.queryByText('Should not render')).not.toBeInTheDocument();
  });

  test('navigates to /account when authenticated but not in the Admin cognito group', async () => {
    Auth.currentAuthenticatedUser.mockResolvedValue({
      signInUserSession: {
        accessToken: { payload: { 'cognito:groups': ['Member'] } },
      },
    });
    renderGuard();
    expect(await screen.findByText('Account Page')).toBeInTheDocument();
  });

  // RequireAdminAuth reads `data.signInUserSession.accessToken.payload['cognito:groups']`
  // and only admits when the *first* group is exactly 'Admin' (capital A).
  test('renders the real Admin component (not the passed children) when the first cognito group is "Admin"', async () => {
    Auth.currentAuthenticatedUser.mockResolvedValue({
      signInUserSession: {
        accessToken: { payload: { 'cognito:groups': ['Admin'] } },
      },
    });
    renderGuard();
    // Suspected bug: RequireAdminAuth's `children` prop is unused -- it always
    // renders the imported `Admin` component instead. Admin.js gates on feature
    // flags being loaded and shows a spinner until they are, so the presence of
    // that spinner (and absence of our children marker) demonstrates the guard
    // ignored `children` and mounted <Admin/> directly.
    await waitFor(() => expect(screen.getByRole('progressbar')).toBeInTheDocument());
    expect(screen.queryByText('Should not render')).not.toBeInTheDocument();
  });
});
