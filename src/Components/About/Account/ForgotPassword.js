import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { Auth } from 'aws-amplify';
import useUserStore from '../../../zustand/user.store';

export default function ForgotPassword({ setShowForgotPassword }) {
  const { enqueueSnackbar } = useSnackbar();
  const user = useUserStore((context) => context.user);

  const [step, setStep] = useState(1);
  const [username, setUsername] = useState(user?.username || '');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Request password reset code
  const handleRequestCode = async () => {
    if (!username) {
      enqueueSnackbar('Please enter your username or email', {
        variant: 'error',
        preventDuplicate: true,
      });
      return;
    }

    try {
      await Auth.forgotPassword(username);
      enqueueSnackbar('Verification code sent to your email or phone', {
        variant: 'success',
        preventDuplicate: true,
      });
      setStep(2);
    } catch (error) {
      enqueueSnackbar(error.message || 'Failed to send verification code', {
        variant: 'error',
        preventDuplicate: true,
      });
    }
  };

  // Submit new password with verification code
  const handleResetPassword = async () => {
    if (!verificationCode || !newPassword) {
      enqueueSnackbar('Please enter both verification code and new password', {
        variant: 'error',
        preventDuplicate: true,
      });
      return;
    }

    try {
      await Auth.forgotPasswordSubmit(username, verificationCode, newPassword);
      enqueueSnackbar('Password reset successfully', {
        variant: 'success',
        preventDuplicate: true,
      });
      setShowForgotPassword(false);
    } catch (error) {
      enqueueSnackbar(error.message || 'Failed to reset password', {
        variant: 'error',
        preventDuplicate: true,
      });
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {step === 1 ? 'Reset Password' : 'Enter Verification Code'}
      </Typography>

      {step === 1 ? (
        <>
          <TextField
            label="Username or Email"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
          />
          <Button
            sx={{
              border: '1px solid blue',
              borderRadius: '3px',
              marginTop: 3,
            }}
            fullWidth
            onClick={handleRequestCode}
          >
            Request Verification Code
          </Button>
        </>
      ) : (
        <>
          <TextField
            label="Verification Code"
            variant="outlined"
            fullWidth
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            margin="normal"
          />
          <TextField
            label="New Password"
            variant="outlined"
            fullWidth
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
          />
          <Button
            sx={{
              border: '1px solid blue',
              borderRadius: '3px',
              marginTop: 3,
            }}
            fullWidth
            onClick={handleResetPassword}
          >
            Reset Password
          </Button>
        </>
      )}
    </Box>
  );
}
