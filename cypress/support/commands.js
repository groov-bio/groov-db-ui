/**
 * Simple mock authentication for Cognito
 * This sets up the localStorage tokens that AWS Amplify expects
 */
Cypress.Commands.add('mockCognitoAuth', (username = 'test-user') => {
  cy.window().then((win) => {
    const clientId = '2lhdpnuct7nfirl2q8fkq8i2ie'; // From your aws-exports.js
    const userId = 'test-user-id-12345';

    // Mock tokens (these are fake but have the right format)
    const mockIdToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXIiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJleHAiOjk5OTk5OTk5OTl9.mock';
    const mockAccessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXIiLCJleHAiOjk5OTk5OTk5OTl9.mock';

    const keyPrefix = `CognitoIdentityServiceProvider.${clientId}`;
    const keyPrefixWithUsername = `${keyPrefix}.${userId}`;

    // Set the tokens in localStorage like Amplify expects
    win.localStorage.setItem(`${keyPrefixWithUsername}.idToken`, mockIdToken);
    win.localStorage.setItem(
      `${keyPrefixWithUsername}.accessToken`,
      mockAccessToken
    );
    win.localStorage.setItem(`${keyPrefix}.LastAuthUser`, userId);
    win.localStorage.setItem(`${keyPrefixWithUsername}.clockDrift`, '0');

    // Set a flag so your app knows it's in test mode
    win.localStorage.setItem('cypress-auth-mock', 'true');
  });
});

/**
 * Improved admin authentication setup with proper JWT tokens and network intercepts
 * This is the most robust approach that should work with AWS Amplify
 */
Cypress.Commands.add('setupAdminAuth', () => {
  // Clear any existing auth first
  cy.clearAuth();

  // Intercept any AWS Cognito API calls with more comprehensive responses
  cy.intercept('POST', '**/oauth2/token', {
    statusCode: 200,
    body: {
      access_token: createMockJWT({
        'cognito:groups': ['Admin'],
        sub: 'admin-user-id-12345',
        email: 'admin@test.com',
        token_use: 'access',
      }),
      id_token: createMockJWT({
        'cognito:groups': ['Admin'],
        sub: 'admin-user-id-12345',
        email: 'admin@test.com',
        token_use: 'id',
      }),
      token_type: 'Bearer',
      expires_in: 3600,
    },
  });

  // Intercept the main Cognito Identity Provider calls
  cy.intercept(
    'POST',
    'https://cognito-idp.us-east-2.amazonaws.com/',
    (req) => {
      console.log('Cognito API call intercepted:', req.body);

      if (req.body.includes('GetUser') || req.body.includes('InitiateAuth')) {
        req.reply({
          statusCode: 200,
          body: JSON.stringify({
            UserAttributes: [
              { Name: 'sub', Value: 'admin-user-id-12345' },
              { Name: 'email', Value: 'admin@test.com' },
            ],
            Username: 'admin-user-id-12345',
          }),
        });
      }
    }
  );

  // Set up localStorage with proper AWS Amplify structure before visiting the page
  cy.window().then((win) => {
    const clientId = '2lhdpnuct7nfirl2q8fkq8i2ie';
    const username = 'admin-user-id-12345';

    const mockAccessToken = createMockJWT({
      'cognito:groups': ['Admin'],
      sub: username,
      email: 'admin@test.com',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
      token_use: 'access',
      scope: 'aws.cognito.signin.user.admin',
    });

    const mockIdToken = createMockJWT({
      sub: username,
      email: 'admin@test.com',
      'cognito:groups': ['Admin'],
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
      token_use: 'id',
      aud: clientId,
    });

    const keyPrefix = `CognitoIdentityServiceProvider.${clientId}`;
    const userPrefix = `${keyPrefix}.${username}`;

    // Set all required localStorage items
    win.localStorage.setItem(`${userPrefix}.accessToken`, mockAccessToken);
    win.localStorage.setItem(`${userPrefix}.idToken`, mockIdToken);
    win.localStorage.setItem(
      `${userPrefix}.refreshToken`,
      'mock-refresh-token'
    );
    win.localStorage.setItem(`${keyPrefix}.LastAuthUser`, username);
    win.localStorage.setItem(`${userPrefix}.clockDrift`, '0');
    win.localStorage.setItem(
      `${userPrefix}.tokenScopesAccepted`,
      '["email","openid","profile"]'
    );

    // Add user data that Amplify might need
    win.localStorage.setItem(
      `${userPrefix}.userData`,
      JSON.stringify({
        Username: username,
        UserAttributes: [
          { Name: 'sub', Value: username },
          { Name: 'email', Value: 'admin@test.com' },
        ],
      })
    );

    console.log('Admin auth tokens set in localStorage');
  });
});

/**
 * Debug command to check what's happening with auth
 */
Cypress.Commands.add('debugAuth', () => {
  cy.window().then((win) => {
    console.log(
      'localStorage keys:',
      Object.keys(win.localStorage).filter((k) => k.includes('Cognito'))
    );

    // Try to manually call the Auth method and see what happens
    if (win.Auth) {
      win.Auth.currentAuthenticatedUser()
        .then((user) => {
          console.log('Auth.currentAuthenticatedUser() resolved:', user);
          console.log(
            'Groups:',
            user?.signInUserSession?.accessToken?.payload?.['cognito:groups']
          );
        })
        .catch((error) => {
          console.log('Auth.currentAuthenticatedUser() failed:', error);
        });
    }
  });
});

/**
 * Clear all authentication
 */
Cypress.Commands.add('clearAuth', () => {
  cy.window().then((win) => {
    // Clear all Cognito-related localStorage
    Object.keys(win.localStorage)
      .filter(
        (key) =>
          key.includes('CognitoIdentityServiceProvider') ||
          key.includes('cypress-auth')
      )
      .forEach((key) => win.localStorage.removeItem(key));
  });
});

/**
 * Helper function to create a mock JWT token
 * This creates a properly formatted JWT that can be decoded by AWS Amplify
 */
function createMockJWT(payload) {
  const header = {
    alg: 'RS256',
    typ: 'JWT',
    kid: 'mock-key-id',
  };

  // Base64 encode the header and payload (URL-safe)
  const encodedHeader = btoa(JSON.stringify(header))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  const encodedPayload = btoa(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  // Create a mock signature
  const signature = 'mock-signature-that-is-long-enough-to-look-real';

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}
