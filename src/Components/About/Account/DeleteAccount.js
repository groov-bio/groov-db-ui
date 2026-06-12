import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Auth } from 'aws-amplify';
import { useSnackbar } from 'notistack';
import useUserStore from '../../../zustand/user.store';

const CONFIRM_WORD = 'DELETE';

export default function DeleteAccount() {
  const { enqueueSnackbar } = useSnackbar();
  const setUser = useUserStore((context) => context.setUser);

  const [confirmText, setConfirmText] = useState('');
  const confirmed = confirmText.trim().toUpperCase() === CONFIRM_WORD;

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
        Are you sure you want to delete your account? This permanently removes
        your account and cannot be undone.
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Type <strong>{CONFIRM_WORD}</strong> to confirm.
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        placeholder={CONFIRM_WORD}
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        sx={{ mt: 1 }}
      />
      <Button
        variant="contained"
        color="error"
        fullWidth
        disabled={!confirmed}
        onClick={deleteAccount}
        sx={{ mt: 3, py: 1.25 }}
      >
        Delete my account
      </Button>
    </Box>
  );
}
