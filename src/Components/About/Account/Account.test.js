// Account.js does `import '@aws-amplify/ui-react/styles.css'`. The installed
// @aws-amplify/ui-react only exposes that path via its package.json "exports"
// map (to dist/styles.css); Jest 27's resolver does not honor "exports" subpath
// mappings, so the bare specifier fails to resolve. Declare it virtual so Jest
// treats the side-effect-only CSS import as a no-op module.
jest.mock('@aws-amplify/ui-react/styles.css', () => ({}), { virtual: true });

import { Routes, Route } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { renderWithProviders, screen, waitFor } from '../../../test-utils';
import Account from './Account';
import useUserStore from '../../../zustand/user.store';

function renderAccount(route = '/account') {
  return renderWithProviders(
    <Routes>
      <Route path="/account" element={<Account />} />
      <Route path="/admin" element={<div>Admin Page</div>} />
      <Route path="/" element={<div>Home Page</div>} />
    </Routes>,
    { route }
  );
}

describe('Account', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useUserStore.setState({ user: null });
    Auth.currentAuthenticatedUser.mockRejectedValue(new Error('No current user'));
    Auth.federatedSignIn.mockResolvedValue();
    Auth.signOut.mockResolvedValue();
  });

  test('shows the sign-in prompt and button when logged out', async () => {
    renderAccount();
    expect(
      await screen.findByText(/please sign in to access your account/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('clicking Sign In calls Auth.federatedSignIn', async () => {
    const { user } = renderAccount();
    await screen.findByText(/please sign in to access your account/i);
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => expect(Auth.federatedSignIn).toHaveBeenCalled());
  });

  test('shows the display name, email and "Member" chip for a signed-in non-admin user', async () => {
    Auth.currentAuthenticatedUser.mockResolvedValue({
      username: 'user1',
      attributes: { sub: 'user1' },
      signInUserSession: {
        idToken: {
          payload: {
            email: 'jane@example.com',
            given_name: 'Jane',
            family_name: 'Doe',
          },
        },
        accessToken: { payload: {} },
      },
    });
    renderAccount();

    expect(await screen.findByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('Member')).toBeInTheDocument();
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
    expect(screen.queryByText(/admin dashboard/i)).not.toBeInTheDocument();
  });

  test('shows the "Admin" chip and Admin dashboard shortcut for a user in the Admin cognito group', async () => {
    Auth.currentAuthenticatedUser.mockResolvedValue({
      username: 'admin1',
      attributes: { sub: 'admin1' },
      signInUserSession: {
        idToken: { payload: { email: 'admin@example.com' } },
        accessToken: { payload: { 'cognito:groups': ['Admin'] } },
      },
    });
    const { user } = renderAccount();

    expect(await screen.findByText('Admin')).toBeInTheDocument();
    expect(screen.getByText(/admin dashboard/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^open$/i }));
    expect(await screen.findByText('Admin Page')).toBeInTheDocument();
  });

  test('Sign out calls signOutUser (Auth.signOut) and navigates home', async () => {
    Auth.currentAuthenticatedUser.mockResolvedValue({
      username: 'user1',
      attributes: { sub: 'user1' },
      signInUserSession: {
        idToken: { payload: { email: 'jane@example.com' } },
        accessToken: { payload: {} },
      },
    });
    const { user } = renderAccount();

    await screen.findByText('jane@example.com');
    await user.click(screen.getByRole('button', { name: /sign out/i }));

    await waitFor(() => expect(Auth.signOut).toHaveBeenCalled());
    expect(await screen.findByText('Home Page')).toBeInTheDocument();
  });
});
