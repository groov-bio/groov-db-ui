import { Routes, Route } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { renderWithProviders, screen } from '../../../test-utils';
import { RequireAdminAuth } from '../../../Components/Auth/RequireAdminAuth';

// RequireAdminAuth is a thin auth wrapper: it reads
// `data.signInUserSession.accessToken.payload['cognito:groups']` and renders
// its `children` only when the *first* group is exactly 'Admin' (capital A).
// Any other outcome (not signed in, wrong group, or an auth error) redirects
// to /account.
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
    Auth.currentAuthenticatedUser.mockRejectedValue(new Error('No current user'));
  });

  test('redirects to /account when not authenticated', async () => {
    renderGuard();
    expect(await screen.findByText('Account Page')).toBeInTheDocument();
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  test('redirects to /account when authenticated but not in the Admin cognito group', async () => {
    Auth.currentAuthenticatedUser.mockResolvedValue({
      signInUserSession: {
        accessToken: { payload: { 'cognito:groups': ['Member'] } },
      },
    });
    renderGuard();
    expect(await screen.findByText('Account Page')).toBeInTheDocument();
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  test('renders its children when the first cognito group is "Admin"', async () => {
    Auth.currentAuthenticatedUser.mockResolvedValue({
      signInUserSession: {
        accessToken: { payload: { 'cognito:groups': ['Admin'] } },
      },
    });
    renderGuard();
    expect(await screen.findByText('Admin Content')).toBeInTheDocument();
    expect(screen.queryByText('Account Page')).not.toBeInTheDocument();
  });
});
