// Login.js renders Signin/Signup, both of which import `Auth` from
// '@aws-amplify/auth' directly. Mock it so mounting doesn't touch the real SDK.
jest.mock('@aws-amplify/auth', () => ({
  __esModule: true,
  Auth: { signIn: jest.fn(), signUp: jest.fn() },
}));

import { renderWithProviders, screen } from '../../test-utils';
import Login from './Login';

describe('Login', () => {
  test('shows the Sign In tab (with its fields) by default', () => {
    renderWithProviders(<Login />);
    expect(screen.getByRole('tab', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /sign up/i })).toBeInTheDocument();
    // Signin fields visible, Signup-only field not.
    expect(screen.getByLabelText(/^user name/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/^confirm password/i)).not.toBeInTheDocument();
  });

  test('clicking the Sign Up tab switches the panel to the Signup form', async () => {
    const { user } = renderWithProviders(<Login />);
    await user.click(screen.getByRole('tab', { name: /sign up/i }));

    expect(await screen.findByLabelText(/^confirm password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^given name/i)).toBeInTheDocument();
  });
});
