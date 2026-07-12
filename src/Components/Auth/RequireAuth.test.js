import { Routes, Route } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { renderWithProviders, screen } from '../../test-utils';
import { RequireAuth } from './RequireAuth';
import useUserStore from '../../zustand/user.store';

// RequireAuth renders its `children` prop directly once authenticated (unlike
// RequireAdminAuth, which ignores `children` entirely -- see RequireAdminAuth.test.js).
function renderGuard(route = '/protected') {
  return renderWithProviders(
    <Routes>
      <Route
        path="/protected"
        element={
          <RequireAuth>
            <div>Protected Content</div>
          </RequireAuth>
        }
      />
      <Route path="/account" element={<div>Account Page</div>} />
    </Routes>,
    { route }
  );
}

describe('RequireAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useUserStore.setState({ user: null });
    // Default = logged out for every test unless overridden below.
    Auth.currentAuthenticatedUser.mockRejectedValue(new Error('No current user'));
    Auth.currentSession.mockRejectedValue(new Error('No current user'));
  });

  test('redirects to /account and does not render the protected child when logged out', async () => {
    renderGuard();
    expect(await screen.findByText('Account Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('renders the protected child when Auth.currentAuthenticatedUser resolves', async () => {
    Auth.currentAuthenticatedUser.mockResolvedValue({
      username: 'user1',
      signInUserSession: { idToken: { payload: { email: 'a@b.com' } } },
    });
    renderGuard();
    expect(await screen.findByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Account Page')).not.toBeInTheDocument();
  });

  test('renders the protected child immediately when a user is already in the zustand store', async () => {
    useUserStore.setState({ user: { cognitoUser: { username: 'cached-user' } } });
    renderGuard();
    expect(await screen.findByText('Protected Content')).toBeInTheDocument();
    // Because the store already had a user, checkAuthStatus (and therefore
    // Auth.currentAuthenticatedUser) should never have been consulted.
    expect(Auth.currentAuthenticatedUser).not.toHaveBeenCalled();
  });
});
