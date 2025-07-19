import { Box, Typography, TextField, Button } from '@mui/material';
import { Auth } from 'aws-amplify';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

export default function ForgotPasswordConfirm({ userName, closeAllDialogs }) {
  const { enqueueSnackbar } = useSnackbar();

  const [confirmData, setConfirmData] = useState({
    newPass: null,
    code: null,
  });

  // Update local state
  const updateField = (field, value) => {
    setConfirmData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const submitPasswordConfirm = () => {
    // Reject empty fields
    if (!confirmData.newPass || !confirmData.code) {
      enqueueSnackbar(
        `Please provide your new password and verification code.`,
        {
          variant: 'error',
          preventDuplicate: true,
        }
      );
    } else {
      // Submit new password with verification code
      Auth.forgotPasswordSubmit(userName, confirmData.code, confirmData.newPass)
        .then(() => {
          enqueueSnackbar('Password successfully reset. Please login!', {
            variant: 'success',
            preventDuplicate: true,
          });
          closeAllDialogs();
        })
        .catch((err) =>
          enqueueSnackbar(err.message, {
            variant: 'error',
            preventDuplicate: true,
          })
        );
    }
  };

  return (
    <Box>
      <Typography>
        If that username exists, check your email and provide the code below:
      </Typography>
      <TextField
        label="Verification code"
        variant="outlined"
        fullWidth
        onChange={(e) => {
          e.preventDefault();
          updateField('code', e.target.value);
        }}
        sx={{
          mt: 3,
        }}
      />
      <TextField
        label="New Password"
        variant="outlined"
        fullWidth
        onChange={(e) => {
          e.preventDefault();
          updateField('newPass', e.target.value);
        }}
        sx={{
          mt: 3,
        }}
        type="password"
      />
      <Button
        sx={{
          border: '1px solid blue',
          borderRadius: '3px',
          width: '100%',
          marginTop: 3,
        }}
        onClick={() => {
          submitPasswordConfirm();
        }}
      >
        Submit
      </Button>
      <Button
        sx={{
          color: '#1976d2',
          mt: 3,
        }}
        align="center"
        fullWidth
        onClick={() => closeAllDialogs()}
      >
        Return to Login
      </Button>
    </Box>
  );
}
