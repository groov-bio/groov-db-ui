// NOTE: ForgotPasswordConfirm is not imported/used anywhere else in the app
// (grep confirms no other module references it) -- Account/ForgotPassword.js
// implements its own inline 2-step reset flow instead. This appears to be dead
// code, but it is in-scope for this test pass so it is tested standalone.
import { Auth } from 'aws-amplify';
import { renderWithProviders, screen, waitFor } from '../../../../test-utils';
import ForgotPasswordConfirm from '../../../../Components/About/Account/ForgotPasswordConfirm';

describe('ForgotPasswordConfirm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Auth.forgotPasswordSubmit.mockResolvedValue();
  });

  test('renders the verification code and new password fields', () => {
    renderWithProviders(
      <ForgotPasswordConfirm userName="bob" closeAllDialogs={() => {}} />
    );
    expect(screen.getByLabelText(/verification code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
  });

  test('submitting with empty fields shows a validation error and does not call Auth.forgotPasswordSubmit', async () => {
    const { user } = renderWithProviders(
      <ForgotPasswordConfirm userName="bob" closeAllDialogs={() => {}} />
    );
    await user.click(screen.getByRole('button', { name: /^submit$/i }));

    expect(
      await screen.findByText(/please provide your new password and verification code/i)
    ).toBeInTheDocument();
    expect(Auth.forgotPasswordSubmit).not.toHaveBeenCalled();
  });

  test('submitting a code and password calls Auth.forgotPasswordSubmit and then closeAllDialogs', async () => {
    const closeAllDialogs = jest.fn();
    const { user } = renderWithProviders(
      <ForgotPasswordConfirm userName="bob" closeAllDialogs={closeAllDialogs} />
    );

    await user.type(screen.getByLabelText(/verification code/i), '123456');
    await user.type(screen.getByLabelText(/new password/i), 'NewPass1');
    await user.click(screen.getByRole('button', { name: /^submit$/i }));

    await waitFor(() =>
      expect(Auth.forgotPasswordSubmit).toHaveBeenCalledWith('bob', '123456', 'NewPass1')
    );
    await waitFor(() => expect(closeAllDialogs).toHaveBeenCalled());
  });

  test('clicking "Return to Login" calls closeAllDialogs without submitting', async () => {
    const closeAllDialogs = jest.fn();
    const { user } = renderWithProviders(
      <ForgotPasswordConfirm userName="bob" closeAllDialogs={closeAllDialogs} />
    );
    await user.click(screen.getByRole('button', { name: /return to login/i }));

    expect(closeAllDialogs).toHaveBeenCalledTimes(1);
    expect(Auth.forgotPasswordSubmit).not.toHaveBeenCalled();
  });
});
