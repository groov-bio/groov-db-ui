import { Box, Button, TextField, Typography } from '@mui/material';
import { Auth } from 'aws-amplify';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import useUserStore from '../../zustand/user.store';

export default function ConfirmCode({ username, password }) {
  const [userCode, setUserCode] = useState(null);
  const setUser = useUserStore((context) => context.setUser);

  const { enqueueSnackbar } = useSnackbar();

  const submitUserCode = async () => {
    if (!userCode) {
      enqueueSnackbar('Please enter the code sent to your email.', {
        variant: 'error',
        preventDuplicate: true,
      });
    } else {
      try {
        await Auth.confirmSignUp(username, userCode);
      } catch (err) {
        enqueueSnackbar(`Error submitting code: ${err.message}`, {
          variant: 'error',
          preventDuplicate: true,
        });
      }
    }

    try {
      const user = await Auth.signIn(username, password);
      setUser(user);
      enqueueSnackbar(`Successfully confirmed!`, {
        variant: 'Success',
        preventDuplicate: true,
      });
    } catch (err) {
      enqueueSnackbar(`Error submitting code: ${err.message}`, {
        variant: 'error',
        preventDuplicate: true,
      });
    }
  };

  const resendCode = async () => {
    try {
      await Auth.resendSignUp(username);
      enqueueSnackbar(`Verification Code resent!`, {
        variant: 'Success',
        preventDuplicate: true,
      });
    } catch (err) {
      enqueueSnackbar(`err.message`, {
        variant: 'error',
        preventDuplicate: true,
      });
    }
  };

  return (
    <Box>
      <Typography>
        We sent you a confirmation code to your email. Please enter it here:
      </Typography>
      <TextField
        required
        label="Confirmation Code"
        fullWidth
        sx={{
          marginTop: 3,
        }}
        onChange={(e) => {
          e.preventDefault();
          setUserCode(e.target.value);
        }}
      />
      <Button
        sx={{
          border: '1px solid blue',
          borderRadius: '3px',
          marginTop: 3,
        }}
        fullWidth
        onClick={() => submitUserCode()}
      >
        Submit
      </Button>
      <Button
        sx={{
          marginTop: 3,
        }}
        fullWidth
        onClick={() => resendCode()}
      >
        Resend Code
      </Button>
    </Box>
  );
}
