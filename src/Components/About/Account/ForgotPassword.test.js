import { Auth } from 'aws-amplify';
import { renderWithProviders, screen, waitFor } from '../../../test-utils';
import ForgotPassword from './ForgotPassword';
import useUserStore from '../../../zustand/user.store';

describe('ForgotPassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useUserStore.setState({ user: null });
    Auth.forgotPassword.mockResolvedValue();
    Auth.forgotPasswordSubmit.mockResolvedValue();
  });

  test('step 1: renders the username/email field and Request Verification Code button', () => {
    renderWithProviders(<ForgotPassword setShowForgotPassword={() => {}} />);
    expect(screen.getByRole('heading', { name: /reset password/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/username or email/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /request verification code/i })
    ).toBeInTheDocument();
  });

  test('requesting a code with an empty username shows an error and does not call Auth.forgotPassword', async () => {
    const { user } = renderWithProviders(<ForgotPassword setShowForgotPassword={() => {}} />);
    await user.click(screen.getByRole('button', { name: /request verification code/i }));

    expect(
      await screen.findByText(/please enter your username or email/i)
    ).toBeInTheDocument();
    expect(Auth.forgotPassword).not.toHaveBeenCalled();
  });

  test('requesting a code with a username calls Auth.forgotPassword and advances to step 2', async () => {
    const { user } = renderWithProviders(<ForgotPassword setShowForgotPassword={() => {}} />);
    await user.type(screen.getByLabelText(/username or email/i), 'bob');
    await user.click(screen.getByRole('button', { name: /request verification code/i }));

    await waitFor(() => expect(Auth.forgotPassword).toHaveBeenCalledWith('bob'));
    expect(
      await screen.findByRole('heading', { name: /enter verification code/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/verification code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
  });

  test('step 2: submitting the code and new password calls Auth.forgotPasswordSubmit and closes the dialog', async () => {
    const setShowForgotPassword = jest.fn();
    const { user } = renderWithProviders(
      <ForgotPassword setShowForgotPassword={setShowForgotPassword} />
    );
    await user.type(screen.getByLabelText(/username or email/i), 'bob');
    await user.click(screen.getByRole('button', { name: /request verification code/i }));

    await screen.findByRole('heading', { name: /enter verification code/i });
    await user.type(screen.getByLabelText(/verification code/i), '123456');
    await user.type(screen.getByLabelText(/new password/i), 'NewPass1');
    await user.click(screen.getByRole('button', { name: /^reset password$/i }));

    await waitFor(() =>
      expect(Auth.forgotPasswordSubmit).toHaveBeenCalledWith('bob', '123456', 'NewPass1')
    );
    await waitFor(() => expect(setShowForgotPassword).toHaveBeenCalledWith(false));
  });
});
