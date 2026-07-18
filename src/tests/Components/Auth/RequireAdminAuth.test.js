import { Routes, Route } from 'react-router-dom';
import { renderWithProviders, screen } from '../../../test-utils';
import { RequireAdminAuth } from '../../../Components/Auth/RequireAdminAuth';
import { checkAuthStatus } from '../../../utils/auth';

// RequireAdminAuth is a thin auth wrapper. It reads
// `data.cognitoUser.signInUserSession.accessToken.payload['cognito:groups']`
// from the shared auth seam (utils/auth.checkAuthStatus) and renders its
// `children` only when the *first* group is exactly 'Admin' (capital A). Any
// other outcome (not signed in, wrong group, or an auth error) redirects to
// /account. Mocking the seam (rather than Amplify's Auth directly) keeps this
// test agnostic to whether the session is Amplify (prod) or the local
// Cognito-mimic (REACT_APP_LOCAL_AUTH=true) — both resolve through checkAuthStatus.
jest.mock('../../../utils/auth', () => ({
  checkAuthStatus: jest.fn(),
}));

function adminSession(groups) {
  return {
    cognitoUser: {
      signInUserSession: {
        accessToken: { payload: { 'cognito:groups': groups } },
      },
    },
  };
}

function renderGuard(route = '/admin') {
  return renderWithProviders(
    <Routes>
      <Route
        path="/admin"
        element={
          <RequireAdminAuth>
            <div>Admin Content</div>
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
    // Not signed in: checkAuthStatus resolves null (it swallows auth errors).
    checkAuthStatus.mockResolvedValue(null);
  });

  test('redirects to /account when not authenticated', async () => {
    renderGuard();
    expect(await screen.findByText('Account Page')).toBeInTheDocument();
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  test('redirects to /account when authenticated but not in the Admin cognito group', async () => {
    checkAuthStatus.mockResolvedValue(adminSession(['Member']));
    renderGuard();
    expect(await screen.findByText('Account Page')).toBeInTheDocument();
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  test('renders its children when the first cognito group is "Admin"', async () => {
    checkAuthStatus.mockResolvedValue(adminSession(['Admin']));
    renderGuard();
    expect(await screen.findByText('Admin Content')).toBeInTheDocument();
    expect(screen.queryByText('Account Page')).not.toBeInTheDocument();
  });
});
