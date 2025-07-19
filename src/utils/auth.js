import { Auth } from 'aws-amplify';

export const checkAuthStatus = async (setUser = null) => {
  try {
    const currentUser = await Auth.currentAuthenticatedUser();
    const userData = {
      id: currentUser.username || currentUser.attributes.sub,
      email: currentUser.signInUserSession?.idToken?.payload?.email || '',
      firstName:
        currentUser.signInUserSession?.idToken?.payload?.given_name || '',
      lastName:
        currentUser.signInUserSession?.idToken?.payload?.family_name || '',
      name: currentUser.signInUserSession?.idToken?.payload?.name || '',
      picture: currentUser.signInUserSession?.idToken?.payload?.picture || '',
      cognitoUser: currentUser,
    };

    if (setUser) {
      setUser(userData);
    }

    return userData;
  } catch (err) {
    return null;
  }
};

export const signOutUser = async (setUser) => {
  try {
    await Auth.signOut();
    setUser(null);
  } catch (error) {
    throw error;
  }
};

export const signIn = async () => {
  try {
    await Auth.federatedSignIn();
  } catch (error) {
    throw error;
  }
};

export const handleAuthCode = async (code, setUser = null) => {
  try {
    const currentUser = await Auth.currentAuthenticatedUser();

    const userData = {
      id: currentUser.username || currentUser.attributes.sub,
      email: currentUser.signInUserSession?.idToken?.payload?.email || '',
      firstName:
        currentUser.signInUserSession?.idToken?.payload?.given_name || '',
      lastName:
        currentUser.signInUserSession?.idToken?.payload?.family_name || '',
      name: currentUser.signInUserSession?.idToken?.payload?.name || '',
      picture: currentUser.signInUserSession?.idToken?.payload?.picture || '',
      cognitoUser: currentUser,
    };

    if (setUser) {
      setUser(userData);
    }

    return userData;
  } catch (err) {
    throw err;
  }
};
