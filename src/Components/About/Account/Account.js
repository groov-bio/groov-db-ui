import React, { useEffect, useState } from 'react';

import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  Avatar,
  Card,
  CardContent,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  CircularProgress,
} from '@mui/material';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

import { Auth } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import useUserStore from '../../../zustand/user.store';
import ChangePassword from './ChangePassword';
import DeleteAccount from './DeleteAccount';
import ForgotPassword from './ForgotPassword';
import { Amplify } from 'aws-amplify';
import awsConfig from '../../../aws-exports';
import { checkAuthStatus, signOutUser } from '../../../utils/auth';
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

  const handleSignOut = async () => {
    try {
      await signOutUser(setUser);
      navigate('/');
    } catch (error) {
      setAuthError('Failed to sign out. Please try again.');
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

  const getDisplayName = () => {
    if (user?.firstName && user?.firstName.length > 0) {
      return `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`;
    } else if (user?.name) {
      return user.name;
    }
    return 'groov member';
  };

  const getInitials = () => {
    if (user?.firstName) {
      return `${user.firstName[0]}${user.lastName ? user.lastName[0] : ''}`.toUpperCase();
    } else if (user?.name) {
      return user.name[0].toUpperCase();
    } else if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return '?';
  };

  // Derive admin status from the Cognito access token groups
  const cognitoGroups =
    user?.cognitoUser?.signInUserSession?.accessToken?.payload?.[
      'cognito:groups'
    ];
  const isAdmin = Array.isArray(cognitoGroups) && cognitoGroups.includes('Admin');

  const getSignInMessage = () => {
    if (reason === 'editSensor') {
      return 'To edit a sensor, please sign in or create an account';
    }
    return 'Please sign in to access your account';
  };

  return (
    <>
      {user ? (
        <Container maxWidth="sm" sx={{ py: { xs: 4, sm: 6 } }}>
          {/* Profile header */}
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={3}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
              >
                <Avatar
                  src={user?.picture || undefined}
                  sx={{
                    width: 72,
                    height: 72,
                    fontSize: 28,
                    bgcolor: 'primary.main',
                    color: 'background.paper',
                  }}
                >
                  {getInitials()}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    flexWrap="wrap"
                  >
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 600, wordBreak: 'break-word' }}
                    >
                      {getDisplayName()}
                    </Typography>
                    <Chip
                      size="small"
                      icon={
                        isAdmin ? (
                          <AdminPanelSettingsOutlinedIcon />
                        ) : undefined
                      }
                      label={isAdmin ? 'Admin' : 'Member'}
                      color={isAdmin ? 'primary' : 'default'}
                      variant={isAdmin ? 'filled' : 'outlined'}
                    />
                  </Stack>
                  {user?.email && (
                    <Stack
                      direction="row"
                      spacing={0.75}
                      alignItems="center"
                      sx={{ mt: 0.5, color: 'text.secondary' }}
                    >
                      <EmailOutlinedIcon fontSize="small" />
                      <Typography
                        variant="body2"
                        sx={{ wordBreak: 'break-all' }}
                      >
                        {user.email}
                      </Typography>
                    </Stack>
                  )}
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Admin shortcut */}
          {isAdmin && (
            <Card variant="outlined" sx={{ borderRadius: 3, mt: 3 }}>
              <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>
                      Admin dashboard
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Review and manage submitted sensors.
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<AdminPanelSettingsOutlinedIcon />}
                    onClick={() => navigate('/admin')}
                    sx={{ flexShrink: 0 }}
                  >
                    Open
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          )}

          {/* Security */}
          <Card variant="outlined" sx={{ borderRadius: 3, mt: 3 }}>
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ letterSpacing: 1 }}
              >
                Security
              </Typography>
              <Stack spacing={1.5} sx={{ mt: 1 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="inherit"
                  startIcon={<LockOutlinedIcon />}
                  onClick={() => setShowChangePwd(true)}
                  sx={{ justifyContent: 'flex-start', py: 1.25 }}
                >
                  Change password
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  color="inherit"
                  startIcon={<RestartAltIcon />}
                  onClick={() => setShowForgotPassword(true)}
                  sx={{ justifyContent: 'flex-start', py: 1.25 }}
                >
                  Reset password with a code
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  color="inherit"
                  startIcon={<LogoutIcon />}
                  onClick={handleSignOut}
                  sx={{ justifyContent: 'flex-start', py: 1.25 }}
                >
                  Sign out
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Danger zone */}
          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              mt: 3,
              borderColor: 'error.main',
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Typography
                variant="overline"
                color="error"
                sx={{ letterSpacing: 1 }}
              >
                Danger zone
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems={{ xs: 'stretch', sm: 'center' }}
                justifyContent="space-between"
                sx={{ mt: 1 }}
              >
                <Typography variant="body2" color="text.secondary">
                  Permanently delete your account and all associated data. This
                  cannot be undone.
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteOutlineIcon />}
                  onClick={() => setShowDeleteAccount(true)}
                  sx={{ flexShrink: 0 }}
                >
                  Delete
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Dialogs */}
          <Dialog
            open={showChangePwd}
            onClose={() => setShowChangePwd(false)}
            fullWidth
          >
            <DialogTitle sx={{ pr: 6 }}>
              Change password
              <IconButton
                onClick={() => setShowChangePwd(false)}
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <ChangePassword setShowChangePwd={setShowChangePwd} />
            </DialogContent>
          </Dialog>
          <Dialog
            open={showForgotPassword}
            onClose={() => setShowForgotPassword(false)}
            fullWidth
          >
            <DialogTitle sx={{ pr: 6 }}>
              Reset password
              <IconButton
                onClick={() => setShowForgotPassword(false)}
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <ForgotPassword setShowForgotPassword={setShowForgotPassword} />
            </DialogContent>
          </Dialog>
          <Dialog
            open={showDeleteAccount}
            onClose={() => setShowDeleteAccount(false)}
            fullWidth
          >
            <DialogTitle sx={{ pr: 6 }}>
              Delete account
              <IconButton
                onClick={() => setShowDeleteAccount(false)}
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <DeleteAccount />
            </DialogContent>
          </Dialog>
        </Container>
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
