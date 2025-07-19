import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Auth } from '@aws-amplify/auth';
import { useState } from 'react';
import {
  emailValidation,
  alphaValidation,
  alphaNumericValidation,
  passwordValidation,
} from '../../lib/Validations';
import { useNavigate } from 'react-router';
import useUserStore from '../../zustand/user.store';
import { DialogContent, Dialog, Typography } from '@mui/material';
import ConfirmCode from './ConfirmCode';
import { useSnackbar } from 'notistack';

const defaultSignUpData = {
  username: {
    data: null,
    isError: false,
    validation: alphaNumericValidation,
  },
  password: {
    data: null,
    isError: false,
    validation: passwordValidation,
  },
  confirmPassword: {
    data: null,
    isError: false,
  },
  email: {
    data: null,
    isError: false,
    validation: emailValidation,
  },
  givenName: {
    data: null,
    isError: false,
    validation: alphaValidation,
  },
  familyName: {
    data: null,
    isError: false,
    validation: alphaValidation,
  },
};

export default function Signup() {
  const { enqueueSnackbar } = useSnackbar();

  const [openConfirmUser, setOpenConfirmUser] = useState(false);

  const [signUpData, setSignUpData] = useState(defaultSignUpData);
  const [childData, setChildData] = useState({
    username: null,
    password: null,
  });

  const validateFields = () => {
    let copyState = { ...signUpData };

    let errorFound = false;

    Object.entries(signUpData).map(([key, value]) => {
      if (key === 'confirmPassword') {
        if (value.data !== signUpData.password.data) {
          copyState[key].isError = true;
          errorFound = true;
        }
      } else if (
        !value.data ||
        value.data === '' ||
        !value?.validation?.test(value.data)
      ) {
        copyState[key].isError = true;
        errorFound = true;
      } else {
        copyState[key].isError = false;
      }
    });

    setSignUpData(copyState);

    return errorFound;
  };

  const handleFieldChange = (event, field) => {
    event.preventDefault();

    // Need to capture username/password field to pass to child
    // Since state is reset on submit
    if (field === 'username' || field === 'password') {
      setChildData((prevState) => ({
        ...prevState,
        [field]: event.target.value ? event.target.value : null,
      }));
    }

    setSignUpData((prevState) => ({
      ...prevState,
      [field]: {
        ...prevState[field],
        data: event.target.value ? event.target.value : null,
      },
    }));
  };

  const handleSignup = async () => {
    let formIsInvalid = validateFields();

    if (!formIsInvalid) {
      try {
        await Auth.signUp({
          username: signUpData.username.data,
          password: signUpData.password.data,
          attributes: {
            email: signUpData.email.data,
            given_name: signUpData.givenName.data,
            family_name: signUpData.familyName.data,
          },
        });
        setOpenConfirmUser(true);
        setSignUpData(defaultSignUpData);
      } catch (err) {
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
        error={signUpData.username.isError}
        helperText={
          signUpData.username.isError
            ? 'Invalid username, please use alpha-numeric characters.'
            : null
        }
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
        error={signUpData.password.isError}
        helperText={
          signUpData.password.isError
            ? 'Invalid password - must be at least 8 characters long and contain a number, uppercase letter and lowercase letter.'
            : null
        }
        onChange={(e) => handleFieldChange(e, 'password')}
      />
      <TextField
        margin="dense"
        required
        id="confirmPassword"
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        fullWidth
        error={signUpData.confirmPassword.isError}
        helperText={
          signUpData.confirmPassword.isError ? `Passwords don't match.` : null
        }
        onChange={(e) => handleFieldChange(e, 'confirmPassword')}
      />
      <TextField
        margin="dense"
        required
        id="email"
        label="Email"
        name="email"
        fullWidth
        error={signUpData.email.isError}
        helperText={signUpData.email.isError ? 'Invalid email' : null}
        onChange={(e) => handleFieldChange(e, 'email')}
      />
      <TextField
        margin="dense"
        required
        id="givenName"
        label="Given Name"
        name="givenName"
        fullWidth
        onChange={(e) => handleFieldChange(e, 'givenName')}
      />
      <TextField
        margin="dense"
        required
        id="familyName"
        label="Family Name"
        name="familyName"
        fullWidth
        onChange={(e) => handleFieldChange(e, 'familyName')}
      />
      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 1 }}
        onClick={() => handleSignup()}
      >
        Submit
      </Button>
      <Dialog open={openConfirmUser} onClose={() => setOpenConfirmUser(false)}>
        <DialogContent>
          <ConfirmCode
            username={childData.username}
            password={childData.password}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
