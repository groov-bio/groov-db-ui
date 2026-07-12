import { Auth } from 'aws-amplify';
import { renderWithProviders, screen, waitFor } from '../../../test-utils';
import DeleteAccount from './DeleteAccount';
import useUserStore from '../../../zustand/user.store';

describe('DeleteAccount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useUserStore.setState({ user: { cognitoUser: { username: 'bob' } } });
    Auth.deleteUser.mockResolvedValue();
  });

  test('renders the confirmation instructions with the Delete button disabled', () => {
    renderWithProviders(<DeleteAccount />);
    expect(screen.getByText(/type/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete my account/i })).toBeDisabled();
  });

  test('typing anything other than DELETE keeps the button disabled', async () => {
    const { user } = renderWithProviders(<DeleteAccount />);
    await user.type(screen.getByRole('textbox'), 'delete me');
    expect(screen.getByRole('button', { name: /delete my account/i })).toBeDisabled();
  });

  test('typing DELETE enables the button, and clicking it calls Auth.deleteUser and clears the user store', async () => {
    const { user } = renderWithProviders(<DeleteAccount />);
    await user.type(screen.getByRole('textbox'), 'DELETE');

    const deleteButton = screen.getByRole('button', { name: /delete my account/i });
    expect(deleteButton).toBeEnabled();

    await user.click(deleteButton);

    await waitFor(() => expect(Auth.deleteUser).toHaveBeenCalled());
    await waitFor(() => expect(useUserStore.getState().user).toBeNull());
  });

  test('confirmation is case-insensitive and trims whitespace', async () => {
    const { user } = renderWithProviders(<DeleteAccount />);
    await user.type(screen.getByRole('textbox'), '  delete  ');
    // Trailing/leading spaces plus lowercase should NOT match CONFIRM_WORD
    // exactly ("delete".trim().toUpperCase() === 'DELETE' actually would match
    // after trim+uppercase) -- confirm the button reflects that behavior.
    expect(screen.getByRole('button', { name: /delete my account/i })).toBeEnabled();
  });
});
