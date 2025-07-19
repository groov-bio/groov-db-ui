import { Box, Button, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { Auth } from 'aws-amplify';
import useUserStore from '../../../zustand/user.store';

export default function ChangePassword({ setShowChangePwd }) {
  const { enqueueSnackbar } = useSnackbar();
  const user = useUserStore((context) => context.user); //User object is needed to pass to auth flow

  const [passwordData, setPasswordData] = useState({
    oldPassword: null,
    newPassword: null,
  });

  const sendChangeRequest = () => {
    //Destructure local state
    const { oldPassword, newPassword } = passwordData;

    // User must fill out both fields
    if (!oldPassword || !newPassword) {
      enqueueSnackbar('Please include both your current and new password.', {
        variant: 'error',
        preventDuplicate: true,
      });
    } else if (oldPassword === newPassword) {
      // Old and new can't match
      enqueueSnackbar('Current and new passwords cannot be the same.', {
        variant: 'error',
        preventDuplicate: true,
      });
    } else {
      Auth.changePassword(user, oldPassword, newPassword)
        .then(() => {
          // Password changed successfully
          // Show that to the user and close the dialog
          enqueueSnackbar('Successfully changed your password.', {
            variant: 'success',
            preventDuplicate: true,
          });
          setShowChangePwd(false);
        })
        .catch((err) =>
          // Something failed here on the AWS side
          // This is most likely an error on the users part (such as not following our password policy)
          // Thus, display it to the user
          enqueueSnackbar(err.message, {
            variant: 'error',
            preventDuplicate: true,
          })
        );
    }
  };

  // Update local state
  const updatePassword = (value, field) => {
    setPasswordData(() => ({
      ...passwordData,
      [field]: value,
    }));
  };

  return (
    <Box>
      <TextField
        label="Current Password"
        variant="outlined"
        fullWidth
        onChange={(e) => updatePassword(e.target.value, 'oldPassword')}
        type="password"
      />
      <TextField
        label="New Password"
        variant="outlined"
        fullWidth
        sx={{
          marginTop: 3,
        }}
        type="password"
        onChange={(e) => updatePassword(e.target.value, 'newPassword')}
      />
      <Button
        sx={{
          border: '1px solid blue',
          borderRadius: '3px',
          marginTop: 3,
        }}
        fullWidth
        onClick={sendChangeRequest}
      >
        Submit
      </Button>
    </Box>
  );
}
