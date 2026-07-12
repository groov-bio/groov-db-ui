// Signin.js imports `Auth` from '@aws-amplify/auth' directly (not 'aws-amplify'),
// which is NOT covered by the project's global aws-amplify moduleNameMapper mock.
// Mock it locally so Auth.signIn is a controllable jest.fn() for this file only.
jest.mock('@aws-amplify/auth', () => ({
  __esModule: true,
  Auth: { signIn: jest.fn() },
}));

import { Auth } from '@aws-amplify/auth';
import { renderWithProviders, screen, waitFor } from '../../test-utils';
import Signin from './Signin';

describe('Signin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders username, password fields and a submit button', () => {
    renderWithProviders(<Signin />);
    // MUI appends a visually-hidden literal " *" to the label text of required
    // fields, so an exact string match would miss it -- use a prefix regex.
    expect(screen.getByLabelText(/^user name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('submitting calls Auth.signIn with the typed username and password', async () => {
    Auth.signIn.mockResolvedValue({ username: 'bob' });
    const { user } = renderWithProviders(<Signin />);

    await user.type(screen.getByLabelText(/^user name/i), 'bob');
    await user.type(screen.getByLabelText(/^password/i), 'hunter2');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(Auth.signIn).toHaveBeenCalledWith('bob', 'hunter2'));
  });

  test('clicking "Forgot password?" opens the ForgotPassword dialog', async () => {
    const { user } = renderWithProviders(<Signin />);
    await user.click(screen.getByRole('button', { name: /forgot password/i }));
    expect(
      await screen.findByRole('heading', { name: /reset password/i })
    ).toBeInTheDocument();
  });
});
