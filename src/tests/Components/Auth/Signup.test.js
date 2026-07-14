// Signup.js imports `Auth` from '@aws-amplify/auth' directly (not 'aws-amplify'),
// which is NOT covered by the project's global aws-amplify moduleNameMapper mock.
// Mock it locally so Auth.signUp is a controllable jest.fn() for this file only.
jest.mock('@aws-amplify/auth', () => ({
  __esModule: true,
  Auth: { signUp: jest.fn() },
}));

import { Auth } from '@aws-amplify/auth';
import { renderWithProviders, screen, waitFor } from '../../../test-utils';
import Signup from '../../../Components/Auth/Signup';

describe('Signup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all the sign-up fields and a submit button', () => {
    renderWithProviders(<Signup />);
    expect(screen.getByLabelText(/^user name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^confirm password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^given name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^family name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('submitting with empty fields shows validation errors and does not call Auth.signUp', async () => {
    const { user } = renderWithProviders(<Signup />);
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(
      await screen.findByText(/invalid username, please use alpha-numeric characters/i)
    ).toBeInTheDocument();
    expect(Auth.signUp).not.toHaveBeenCalled();
  });

  test('submitting valid, matching data calls Auth.signUp and opens the confirmation dialog', async () => {
    Auth.signUp.mockResolvedValue({});
    const { user } = renderWithProviders(<Signup />);

    await user.type(screen.getByLabelText(/^user name/i), 'bobsmith123');
    await user.type(screen.getByLabelText(/^password/i), 'Password123');
    await user.type(screen.getByLabelText(/^confirm password/i), 'Password123');
    await user.type(screen.getByLabelText(/^email/i), 'bob@example.com');
    await user.type(screen.getByLabelText(/^given name/i), 'Bob');
    await user.type(screen.getByLabelText(/^family name/i), 'Smith');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() =>
      expect(Auth.signUp).toHaveBeenCalledWith({
        username: 'bobsmith123',
        password: 'Password123',
        attributes: {
          email: 'bob@example.com',
          given_name: 'Bob',
          family_name: 'Smith',
        },
      })
    );

    expect(
      await screen.findByText(/we sent you a confirmation code/i)
    ).toBeInTheDocument();
  });

  test('mismatched passwords show a "Passwords don\'t match" error', async () => {
    const { user } = renderWithProviders(<Signup />);

    await user.type(screen.getByLabelText(/^user name/i), 'bobsmith123');
    await user.type(screen.getByLabelText(/^password/i), 'Password123');
    await user.type(screen.getByLabelText(/^confirm password/i), 'Password124');
    await user.type(screen.getByLabelText(/^email/i), 'bob@example.com');
    await user.type(screen.getByLabelText(/^given name/i), 'Bob');
    await user.type(screen.getByLabelText(/^family name/i), 'Smith');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText(/passwords don.t match/i)).toBeInTheDocument();
    expect(Auth.signUp).not.toHaveBeenCalled();
  });
});
