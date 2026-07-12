import { Auth } from 'aws-amplify';
import { renderWithProviders, screen, waitFor } from '../../test-utils';
import ConfirmCode from './ConfirmCode';

describe('ConfirmCode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Auth.confirmSignUp.mockResolvedValue();
    Auth.signIn.mockResolvedValue({ username: 'bob' });
    Auth.resendSignUp.mockResolvedValue();
  });

  test('renders the confirmation code field and buttons', () => {
    renderWithProviders(<ConfirmCode username="bob" password="hunter2" />);
    expect(screen.getByLabelText(/^confirmation code/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^submit$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /resend code/i })).toBeInTheDocument();
  });

  test('submitting without a code shows an error and does not call Auth.confirmSignUp', async () => {
    const { user } = renderWithProviders(<ConfirmCode username="bob" password="hunter2" />);
    await user.click(screen.getByRole('button', { name: /^submit$/i }));

    expect(
      await screen.findByText(/please enter the code sent to your email/i)
    ).toBeInTheDocument();
    expect(Auth.confirmSignUp).not.toHaveBeenCalled();
  });

  test('submitting a code calls Auth.confirmSignUp and then Auth.signIn with username/password', async () => {
    const { user } = renderWithProviders(<ConfirmCode username="bob" password="hunter2" />);

    await user.type(screen.getByLabelText(/^confirmation code/i), '123456');
    await user.click(screen.getByRole('button', { name: /^submit$/i }));

    await waitFor(() => expect(Auth.confirmSignUp).toHaveBeenCalledWith('bob', '123456'));
    await waitFor(() => expect(Auth.signIn).toHaveBeenCalledWith('bob', 'hunter2'));
  });

  test('clicking Resend Code calls Auth.resendSignUp with the username', async () => {
    const { user } = renderWithProviders(<ConfirmCode username="bob" password="hunter2" />);
    await user.click(screen.getByRole('button', { name: /resend code/i }));

    await waitFor(() => expect(Auth.resendSignUp).toHaveBeenCalledWith('bob'));
    expect(await screen.findByText(/verification code resent/i)).toBeInTheDocument();
  });
});
