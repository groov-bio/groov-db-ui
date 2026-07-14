import { LOCAL_AUTH, COGNITO_REGION, COGNITO_USER_POOL_ID, COGNITO_CLIENT_ID } from './lib/config';

const awsConfig = {
  Auth: {
    mandatorySignIn: true,

    // REQUIRED - Amazon Cognito Region
    // Env-driven via REACT_APP_COGNITO_REGION, fallback = prod value.
    region: COGNITO_REGION,

    // OPTIONAL - Amazon Cognito User Pool ID
    // Env-driven via REACT_APP_COGNITO_USER_POOL_ID (dynamic, written by
    // floci-init locally), fallback = prod value.
    userPoolId: COGNITO_USER_POOL_ID,

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    // Env-driven via REACT_APP_COGNITO_CLIENT_ID (dynamic, written by
    // floci-init locally), fallback = prod value.
    userPoolWebClientId: COGNITO_CLIENT_ID,
    oauth: {
      domain: 'groov.auth.us-east-2.amazoncognito.com',
      scope: ['email', 'openid', 'profile'],
      // Floci doesn't emulate the Hosted UI, so these are never actually hit
      // when REACT_APP_LOCAL_AUTH === 'true' (src/utils/auth.js bypasses
      // Amplify entirely in that mode) — kept env-driven for correctness
      // anyway. Prod values are the fallback/default.
      redirectSignIn: LOCAL_AUTH
        ? 'http://localhost:3000/account/'
        : 'https://www.groov.bio/account/',
      redirectSignOut: LOCAL_AUTH ? 'http://localhost:3000/' : 'https://www.groov.bio/',
      responseType: 'code',
    },
    signUpVerificationMethod: 'code',
  },
};
export default awsConfig;
