import { Auth } from 'aws-amplify';
import {
  checkAuthStatus,
  signOutUser,
  signIn,
  handleAuthCode,
  getValidToken,
} from '../../utils/auth';

function makeCognitoUser({
  username = 'user-123',
  sub = 'sub-456',
  email = 'a@b.com',
  given_name = 'First',
  family_name = 'Last',
  name = 'First Last',
  picture = 'http://example.com/pic.png',
} = {}) {
  return {
    username,
    attributes: { sub },
    signInUserSession: {
      idToken: {
        payload: { email, given_name, family_name, name, picture },
      },
    },
  };
}

function makeSession(expEpochMs, jwt) {
  return {
    getAccessToken: () => ({
      payload: { exp: Math.floor(expEpochMs / 1000) },
      getJwtToken: () => jwt,
    }),
  };
}

describe('utils/auth', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkAuthStatus', () => {
    it('maps the current authenticated user and calls setUser', async () => {
      const cognitoUser = makeCognitoUser();
      Auth.currentAuthenticatedUser.mockResolvedValue(cognitoUser);
      const setUser = jest.fn();

      const result = await checkAuthStatus(setUser);

      expect(result).toEqual({
        id: 'user-123',
        email: 'a@b.com',
        firstName: 'First',
        lastName: 'Last',
        name: 'First Last',
        picture: 'http://example.com/pic.png',
        cognitoUser,
      });
      expect(setUser).toHaveBeenCalledWith(result);
    });

    it('falls back to attributes.sub for id when username is missing', async () => {
      // Note: pass `null`, not `undefined` — the destructured default param in
      // makeCognitoUser would otherwise re-apply on `undefined`.
      const cognitoUser = makeCognitoUser({ username: null, sub: 'sub-only' });
      Auth.currentAuthenticatedUser.mockResolvedValue(cognitoUser);

      const result = await checkAuthStatus();

      expect(result.id).toBe('sub-only');
    });

    it('does not call setUser when it is not provided', async () => {
      Auth.currentAuthenticatedUser.mockResolvedValue(makeCognitoUser());

      await expect(checkAuthStatus()).resolves.toEqual(
        expect.objectContaining({ id: 'user-123' })
      );
    });

    it('returns null and does not call setUser when Auth rejects', async () => {
      Auth.currentAuthenticatedUser.mockRejectedValue(new Error('no user'));
      const setUser = jest.fn();

      const result = await checkAuthStatus(setUser);

      expect(result).toBeNull();
      expect(setUser).not.toHaveBeenCalled();
    });
  });

  describe('signOutUser', () => {
    it('signs out and clears the user on success', async () => {
      Auth.signOut.mockResolvedValue();
      const setUser = jest.fn();

      await signOutUser(setUser);

      expect(Auth.signOut).toHaveBeenCalled();
      expect(setUser).toHaveBeenCalledWith(null);
    });

    it('rethrows and does not clear the user when Auth.signOut rejects', async () => {
      const error = new Error('sign out failed');
      Auth.signOut.mockRejectedValue(error);
      const setUser = jest.fn();

      await expect(signOutUser(setUser)).rejects.toThrow('sign out failed');
      expect(setUser).not.toHaveBeenCalled();
    });
  });

  describe('signIn', () => {
    it('calls Auth.federatedSignIn', async () => {
      Auth.federatedSignIn.mockResolvedValue();

      await signIn();

      expect(Auth.federatedSignIn).toHaveBeenCalled();
    });

    it('rethrows when Auth.federatedSignIn rejects', async () => {
      Auth.federatedSignIn.mockRejectedValue(new Error('federated sign in failed'));

      await expect(signIn()).rejects.toThrow('federated sign in failed');
    });
  });

  describe('handleAuthCode', () => {
    it('maps the current authenticated user and calls setUser', async () => {
      const cognitoUser = makeCognitoUser({ username: 'coded-user' });
      Auth.currentAuthenticatedUser.mockResolvedValue(cognitoUser);
      const setUser = jest.fn();

      const result = await handleAuthCode('auth-code-123', setUser);

      expect(result).toEqual({
        id: 'coded-user',
        email: 'a@b.com',
        firstName: 'First',
        lastName: 'Last',
        name: 'First Last',
        picture: 'http://example.com/pic.png',
        cognitoUser,
      });
      expect(setUser).toHaveBeenCalledWith(result);
    });

    it('throws (rather than returning null) when Auth rejects', async () => {
      Auth.currentAuthenticatedUser.mockRejectedValue(new Error('bad code'));

      await expect(handleAuthCode('auth-code-123')).rejects.toThrow('bad code');
    });
  });

  describe('getValidToken', () => {
    const NOW = 1700000000000;

    it('returns the current access token when it is not close to expiry', async () => {
      const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(NOW);
      // Expires 60 minutes from now: outside the refresh window.
      Auth.currentSession.mockResolvedValue(
        makeSession(NOW + 60 * 60 * 1000, 'still-valid-jwt')
      );

      const token = await getValidToken();

      expect(token).toBe('still-valid-jwt');
      expect(Auth.currentSession).toHaveBeenCalledTimes(1);
      expect(Auth.currentSession).toHaveBeenCalledWith();

      nowSpy.mockRestore();
    });

    it('refreshes and returns the new token when close to expiry', async () => {
      const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(NOW);
      // Expires 30 minutes from now: inside the refresh window computed by
      // the source (see suspected bug note below).
      Auth.currentSession
        .mockResolvedValueOnce(makeSession(NOW + 30 * 60 * 1000, 'old-jwt'))
        .mockResolvedValueOnce(makeSession(NOW + 60 * 60 * 1000, 'refreshed-jwt'));

      const token = await getValidToken();

      expect(token).toBe('refreshed-jwt');
      expect(Auth.currentSession).toHaveBeenCalledTimes(2);
      expect(Auth.currentSession).toHaveBeenNthCalledWith(1);
      expect(Auth.currentSession).toHaveBeenNthCalledWith(2, { bypassCache: true });

      nowSpy.mockRestore();
    });

    it('rethrows when Auth.currentSession rejects', async () => {
      Auth.currentSession.mockRejectedValue(new Error('no session'));

      await expect(getValidToken()).rejects.toThrow('no session');
    });
  });
});
