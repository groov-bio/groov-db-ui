import { Auth } from 'aws-amplify';
import { renderWithProviders, screen, waitFor } from '../../../../test-utils';
import ChangePassword from '../../../../Components/About/Account/ChangePassword';
import useUserStore from '../../../../zustand/user.store';

describe('ChangePassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useUserStore.setState({ user: { cognitoUser: { username: 'bob' } } });
    Auth.changePassword.mockResolvedValue('SUCCESS');
  });

  test('renders current/new password fields and the update button', () => {
    renderWithProviders(<ChangePassword setShowChangePwd={() => {}} />);
    expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update password/i })).toBeInTheDocument();
  });

  test('submitting with an empty field shows a validation error and does not call Auth.changePassword', async () => {
    const { user } = renderWithProviders(<ChangePassword setShowChangePwd={() => {}} />);
    await user.click(screen.getByRole('button', { name: /update password/i }));

    expect(
      await screen.findByText(/please include both your current and new password/i)
    ).toBeInTheDocument();
    expect(Auth.changePassword).not.toHaveBeenCalled();
  });

  test('submitting identical old/new passwords shows an error and does not call Auth.changePassword', async () => {
    const { user } = renderWithProviders(<ChangePassword setShowChangePwd={() => {}} />);
    await user.type(screen.getByLabelText(/current password/i), 'samepass1');
    await user.type(screen.getByLabelText(/new password/i), 'samepass1');
    await user.click(screen.getByRole('button', { name: /update password/i }));

    expect(
      await screen.findByText(/current and new passwords cannot be the same/i)
    ).toBeInTheDocument();
    expect(Auth.changePassword).not.toHaveBeenCalled();
  });

  test('submitting valid, distinct passwords calls Auth.changePassword and closes the dialog', async () => {
    const setShowChangePwd = jest.fn();
    const { user } = renderWithProviders(<ChangePassword setShowChangePwd={setShowChangePwd} />);

    await user.type(screen.getByLabelText(/current password/i), 'OldPass1');
    await user.type(screen.getByLabelText(/new password/i), 'NewPass1');
    await user.click(screen.getByRole('button', { name: /update password/i }));

    await waitFor(() =>
      expect(Auth.changePassword).toHaveBeenCalledWith(
        useUserStore.getState().user,
        'OldPass1',
        'NewPass1'
      )
    );
    await waitFor(() => expect(setShowChangePwd).toHaveBeenCalledWith(false));
  });
});
