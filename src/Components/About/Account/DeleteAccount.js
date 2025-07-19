import { Box, Button, Typography } from '@mui/material';
import { Auth } from 'aws-amplify';
import { useSnackbar } from 'notistack';
import useUserStore from '../../../zustand/user.store';

export default function DeleteAccount() {
  const { enqueueSnackbar } = useSnackbar();
  const setUser = useUserStore((context) => context.setUser);

  const deleteAccount = () => {
    // User has confirmed they wish their account to be deleted
    Auth.deleteUser()
      .then(() => {
        // Successfully deleted user
        // Set zustand state which will redirect
        enqueueSnackbar('Successfully deleted your account.', {
          variant: 'success',
          preventDuplicate: true,
        });
        setUser(null);
      })
      .catch((err) =>
        enqueueSnackbar(`Unable to delete account: ${err}`, {
          // Something went wrong, display to the user
          variant: 'error',
          preventDuplicate: true,
        })
      );
  };

  return (
    <Box>
      <Typography>
        Are you sure you want to delete your account? This cannot be undone.
      </Typography>
      <Button
        sx={{
          border: '1px solid red',
          borderRadius: '3px',
          width: '100%',
          color: 'red',
          marginTop: 3,
        }}
        onClick={deleteAccount}
      >
        Yes - I understand this cannot be undone.
      </Button>
    </Box>
  );
}
