import React, { useEffect, useState } from 'react';

import {
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogContent,
  CircularProgress,
} from '@mui/material';

import { Auth } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import useUserStore from '../../../zustand/user.store';
import ChangePassword from './ChangePassword';
import DeleteAccount from './DeleteAccount';
import ForgotPassword from './ForgotPassword';
import { Amplify } from 'aws-amplify';
import awsConfig from '../../../aws-exports';
import { checkAuthStatus } from '../../../utils/auth';
import { useLocation, useNavigate } from 'react-router-dom';

Amplify.configure(awsConfig);

export default function Account() {
  // Local state
  // Trying to combine these two dialogs into one state and one dialog is too slow
  // Opening/closing the dialog shows the async nature of state updates
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Router hooks
  const location = useLocation();
  const navigate = useNavigate();

  // Zustand
  const user = useUserStore((context) => context.user);
  const setUser = useUserStore((context) => context.setUser);

  // Check for authenticated user on component mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        // Check if we have a code from the OAuth redirect
        const params = new URLSearchParams(location.search);
        const code = params.get('code');

        if (code) {
          // When we have an authorization code, we need to manually handle it
          try {
            // After exchanging the code, we can get the user
            await Auth.currentAuthenticatedUser();
            // If successful, get user data and update state
            const userData = await checkAuthStatus(setUser);
            if (!userData) {
              throw new Error('Failed to get user data after authentication');
            }
            // Clear the URL parameters
            navigate('/account', { replace: true });
          } catch (err) {
            setAuthError('Failed to process authentication. Please try again.');
          }
        } else {
          // Regular auth check for returning users
          await checkAuthStatus(setUser);
        }
      } catch (err) {
        return;
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [location.search, setUser, navigate]);

  // Handle sign-in if not authenticated
  const handleSignIn = async () => {
    try {
      await Auth.federatedSignIn();
    } catch (error) {
      setAuthError('Failed to initiate sign in. Please try again.');
    }
  };

  // Get the reason parameter to customize the message
  const params = new URLSearchParams(location.search);
  const reason = params.get('reason');

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  const determineName = () => {
    if (user?.firstName && user?.firstName.length > 0) {
      return `Hey, ${user.firstName}`;
    } else if (user?.name) {
      return `Hey, ${user.name}`;
    } else {
      return 'Welcome to groov!';
    }
  };

  const getSignInMessage = () => {
    if (reason === 'editSensor') {
      return 'To edit a sensor, please sign in or create an account';
    }
    return 'Please sign in to access your account';
  };

  return (
    <>
      {user ? (
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)">
          <Box
            gridColumn={{
              xs: 'span 12',
              sm: '4 / 10',
            }}
            mt={6}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: 26,
                  sm: 36,
                },
                marginLeft: {
                  xs: 5,
                  sm: 0,
                },
              }}
            >
              {determineName()}
            </Typography>
          </Box>
          <Box
            gridColumn={{
              xs: 'span 10',
              sm: '4 / 10',
            }}
            mt={4}
          >
            <Button
              sx={{
                border: '1px solid blue',
                borderRadius: '3px',
                width: 200,
                marginLeft: {
                  xs: 5,
                  sm: 0,
                },
              }}
              onClick={() => setShowChangePwd(true)}
            >
              Change Password
            </Button>
          </Box>
          <Box
            gridColumn={{
              xs: 'span 10',
              sm: '4 / 10',
            }}
            mt={4}
          >
            <Button
              sx={{
                border: '1px solid green',
                borderRadius: '3px',
                width: 200,
                color: 'green',
                marginLeft: {
                  xs: 5,
                  sm: 0,
                },
              }}
              onClick={() => setShowForgotPassword(true)}
            >
              Reset Password
            </Button>
          </Box>
          <Box
            gridColumn={{
              xs: 'span 10',
              sm: '4 / 10',
            }}
            mt={4}
          >
            <Button
              sx={{
                border: '1px solid red',
                borderRadius: '3px',
                width: 200,
                color: 'red',
                marginLeft: {
                  xs: 5,
                  sm: 0,
                },
              }}
              onClick={() => {
                setShowDeleteAccount(true);
              }}
            >
              Delete Account
            </Button>
          </Box>
          <Dialog
            open={showChangePwd}
            onClose={() => setShowChangePwd(false)}
            fullWidth
          >
            <DialogContent>
              <ChangePassword setShowChangePwd={setShowChangePwd} />
            </DialogContent>
          </Dialog>
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
            open={showDeleteAccount}
            onClose={() => {
              setShowDeleteAccount(false);
            }}
          >
            <DialogContent>
              <DeleteAccount />
            </DialogContent>
          </Dialog>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 8,
          }}
        >
          <Typography variant="h5" sx={{ mb: 4 }}>
            {getSignInMessage()}
          </Typography>
          {authError && (
            <Typography color="error" sx={{ mb: 2 }}>
              {authError}
            </Typography>
          )}
          <Button
            variant="contained"
            onClick={handleSignIn}
            sx={{ width: '200px' }}
          >
            Sign In
          </Button>
        </Box>
      )}
    </>
  );
}
