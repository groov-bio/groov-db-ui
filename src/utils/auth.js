import { Auth } from 'aws-amplify';
import { LOCAL_AUTH, LOCAL_AUTH_USER, COGNITO_ENDPOINT, COGNITO_CLIENT_ID } from '../lib/config';

// ---------------------------------------------------------------------------
// Local-auth (dev-only) internals. Everything in this block is unreachable
// unless REACT_APP_LOCAL_AUTH === 'true' — every exported function below
// branches on LOCAL_AUTH before touching any of it, and the non-local branch
// of each export is untouched/byte-identical to the pre-existing Amplify
// implementation.
//
// Local dev seeded users (single source of truth = the Floci provisioner):
// admin@groov.local (group "Admin") and user@groov.local (no group), both
// with password GroovLocal1!. Which identity the auto-sign-in shim uses is
// LOCAL_AUTH_USER (REACT_APP_LOCAL_AUTH_USER, default admin@groov.local).
// ---------------------------------------------------------------------------

const LOCAL_SEED_PASSWORD = 'GroovLocal1!';
const LOCAL_TOKENS_KEY = 'groov_local_auth_tokens';

function base64UrlDecode(segment) {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder('utf-8').decode(bytes);
}

function decodeJwtPayload(jwt) {
  try {
    const [, payload] = jwt.split('.');
    return JSON.parse(base64UrlDecode(payload));
  } catch {
    return {};
  }
}

function readLocalTokens() {
  try {
    const raw = localStorage.getItem(LOCAL_TOKENS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeLocalTokens(tokens) {
  localStorage.setItem(LOCAL_TOKENS_KEY, JSON.stringify(tokens));
}

function clearLocalTokens() {
  localStorage.removeItem(LOCAL_TOKENS_KEY);
}

// Raw Cognito IDP `InitiateAuth` call against the locally-emulated pool
// (Floci). No Amplify involved — Amplify v5 can't be cleanly pointed at
// localhost:4566 and doesn't emulate the Hosted UI / OAuth code flow anyway.
async function cognitoInitiateAuth(authFlow, authParameters) {
  const res = await fetch(COGNITO_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
    },
    body: JSON.stringify({
      AuthFlow: authFlow,
      ClientId: COGNITO_CLIENT_ID,
      AuthParameters: authParameters,
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Local Cognito auth failed (${res.status})`);
  }

  const data = await res.json();
  return data.AuthenticationResult;
}

// Builds a session object that mimics the shape of the Amplify
// (amazon-cognito-identity-js) CognitoUser + CognitoUserSession, so every
// existing consumer keeps working unchanged against a local session exactly
// as it does against a real Amplify one:
//   - user.cognitoUser.getSignInUserSession().getIdToken().getJwtToken()
//   - user.cognitoUser.getSignInUserSession().getAccessToken().getJwtToken()
//   - user.cognitoUser.signInUserSession.accessToken.payload['cognito:groups']
//   - user.cognitoUser.getUsername()
function buildLocalCognitoUser(tokens) {
  const idPayload = decodeJwtPayload(tokens.IdToken);
  const accessPayload = decodeJwtPayload(tokens.AccessToken);
  const username = idPayload['cognito:username'] || idPayload.sub;

  const makeToken = (jwt, payload) => ({
    jwtToken: jwt,
    payload,
    getJwtToken: () => jwt,
  });

  const idToken = makeToken(tokens.IdToken, idPayload);
  const accessToken = makeToken(tokens.AccessToken, accessPayload);
  const refreshToken = { token: tokens.RefreshToken, getToken: () => tokens.RefreshToken };

  const signInUserSession = {
    idToken,
    accessToken,
    refreshToken,
    getIdToken: () => idToken,
    getAccessToken: () => accessToken,
    getRefreshToken: () => refreshToken,
    isValid: () => Date.now() < (idPayload.exp || 0) * 1000,
  };

  const cognitoUser = {
    username,
    signInUserSession,
    attributes: {
      sub: idPayload.sub,
      email: idPayload.email,
    },
    getSignInUserSession: () => signInUserSession,
    getUsername: () => username,
  };

  return { cognitoUser, idPayload };
}

function buildLocalUserData(tokens) {
  const { cognitoUser, idPayload } = buildLocalCognitoUser(tokens);
  return {
    id: cognitoUser.username || idPayload.sub,
    email: idPayload.email || '',
    firstName: idPayload.given_name || '',
    lastName: idPayload.family_name || '',
    name: idPayload.name || '',
    picture: idPayload.picture || '',
    cognitoUser,
  };
}

async function localSignIn(setUser) {
  const result = await cognitoInitiateAuth('USER_PASSWORD_AUTH', {
    USERNAME: LOCAL_AUTH_USER,
    PASSWORD: LOCAL_SEED_PASSWORD,
  });

  const tokens = {
    IdToken: result.IdToken,
    AccessToken: result.AccessToken,
    RefreshToken: result.RefreshToken,
  };
  writeLocalTokens(tokens);

  const userData = buildLocalUserData(tokens);
  if (setUser) setUser(userData);
  return userData;
}

async function localRefresh(refreshToken) {
  const result = await cognitoInitiateAuth('REFRESH_TOKEN_AUTH', {
    REFRESH_TOKEN: refreshToken,
  });
  // REFRESH_TOKEN_AUTH doesn't return a new refresh token — keep the old one.
  const tokens = {
    IdToken: result.IdToken,
    AccessToken: result.AccessToken,
    RefreshToken: refreshToken,
  };
  writeLocalTokens(tokens);
  return tokens;
}

// ---------------------------------------------------------------------------
// Public API. Signatures are unchanged from before local-auth existed
// (checkAuthStatus/signIn optionally take a setUser callback). The non-local
// branch of every export below is byte-identical to the pre-existing code.
// ---------------------------------------------------------------------------

export const checkAuthStatus = async (setUser = null) => {
  if (LOCAL_AUTH) {
    const tokens = readLocalTokens();
    if (!tokens) {
      if (setUser) setUser(null);
      return null;
    }
    const userData = buildLocalUserData(tokens);
    if (setUser) setUser(userData);
    return userData;
  }

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
  if (LOCAL_AUTH) {
    clearLocalTokens();
    setUser(null);
    return;
  }

  try {
    await Auth.signOut();
    setUser(null);
  } catch (error) {
    throw error;
  }
};

export const signIn = async (setUser = null) => {
  if (LOCAL_AUTH) {
    await localSignIn(setUser);
    return;
  }

  try {
    await Auth.federatedSignIn();
  } catch (error) {
    throw error;
  }
};

export const handleAuthCode = async (code, setUser = null) => {
  if (LOCAL_AUTH) {
    // Local auth never redirects through an OAuth code flow — there's
    // nothing to exchange, just reflect whatever session is already stored.
    return checkAuthStatus(setUser);
  }

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

export const getValidToken = async () => {
  if (LOCAL_AUTH) {
    const tokens = readLocalTokens();
    if (!tokens) {
      throw new Error('Not signed in');
    }

    const accessPayload = decodeJwtPayload(tokens.AccessToken);
    const expiresAt = (accessPayload.exp || 0) * 1000;
    const fiveMinutesFromNow = Date.now() + 5 * 60 * 1000;

    if (expiresAt < fiveMinutesFromNow && tokens.RefreshToken) {
      const refreshed = await localRefresh(tokens.RefreshToken);
      return refreshed.AccessToken;
    }

    return tokens.AccessToken;
  }

  try {
    const session = await Auth.currentSession();
    const accessToken = session.getAccessToken();
    const tokenExpiresAt = accessToken.payload.exp * 1000;
    const now = Date.now();
    const fiveMinutesFromNow = now + (59 * 60 * 1000);

    // If token expires within 5 minutes, refresh it
    if (tokenExpiresAt < fiveMinutesFromNow) {
      const refreshedSession = await Auth.currentSession({ bypassCache: true });
      return refreshedSession.getAccessToken().getJwtToken();
    }

    return accessToken.getJwtToken();
  } catch (error) {
    throw error;
  }
};

// Shared helper so the ID-token-extraction chain lives in one place instead
// of being re-derived in every consumer (v2Admin.js authHeaders,
// SensorPage.js's admin fetch). Works identically against a real Amplify
// CognitoUser and against the local mimic built above.
export const getIdToken = (user) =>
  user.cognitoUser.getSignInUserSession().getIdToken().getJwtToken();
