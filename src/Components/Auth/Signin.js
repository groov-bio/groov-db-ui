import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { Auth } from '@aws-amplify/auth';
import { useSnackbar } from 'notistack';
import useUserStore from '../../zustand/user.store';
import { Dialog, DialogContent, Typography } from '@mui/material';
import ForgotPassword from '../About/Account/ForgotPassword';
import ConfirmCode from './ConfirmCode';

export default function Signin() {
  const [signInData, setSignInData] = useState({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({
    username: false,
    password: false,
  });

  const { enqueueSnackbar } = useSnackbar();
  const setUser = useUserStore((context) => context.setUser);

  const handleFieldChange = (event, field) => {
    event.preventDefault();
    setSignInData((prevState) => ({
      ...prevState,
      [field]: event.target.value ? event.target.value : null,
    }));
  };

  const handleSignin = async () => {
    try {
      const user = await Auth.signIn(signInData.username, signInData.password);
      setUser(user);
    } catch (err) {
      if (err.message === 'User is not confirmed.') {
        setShowConfirm(true);
      } else {
        enqueueSnackbar(err.message, {
          variant: 'error',
          preventDuplicate: true,
        });
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: {
          xs: '100%',
          sm: '33%',
        },
      }}
      component="form"
    >
      <TextField
        margin="dense"
        required
        id="username"
        label="User Name"
        name="username"
        fullWidth
        error={errors.username}
        helperText={errors.username ? 'Invalid username' : null}
        onChange={(e) => handleFieldChange(e, 'username')}
      />
      <TextField
        margin="dense"
        required
        id="password"
        label="Password"
        name="password"
        type="password"
        fullWidth
        onChange={(e) => handleFieldChange(e, 'password')}
      />
      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 1 }}
        onClick={() => handleSignin()}
      >
        Submit
      </Button>
      <Button
        sx={{
          color: '#1976d2',
          mt: 3,
        }}
        fullWidth
        onClick={() => setShowForgotPassword(true)}
      >
        Forgot password?
      </Button>
      <Dialog
        open={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        fullWidth
      >
        <DialogContent>
          <ForgotPassword setShowForgotPassword={setShowForgotPassword} />
        </DialogContent>
      </Dialog>
      <Dialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        fullWidth
      >
        <DialogContent>
          <ConfirmCode
            username={signInData.username}
            password={signInData.password}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
