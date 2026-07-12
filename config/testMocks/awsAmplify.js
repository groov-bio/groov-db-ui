// Mock for aws-amplify. `Auth` methods are jest mocks so tests can control
// auth state. Defaults simulate a LOGGED-OUT user: currentAuthenticatedUser /
// currentSession reject, so utils/auth.checkAuthStatus resolves to null.
//
// To simulate a signed-in user in a test:
//   import { Auth } from 'aws-amplify';
//   Auth.currentAuthenticatedUser.mockResolvedValue({ username: 'u', ... });
const noSession = () => Promise.reject(new Error('No current user'));

const Auth = {
  currentAuthenticatedUser: jest.fn(noSession),
  currentSession: jest.fn(noSession),
  currentUserInfo: jest.fn(() => Promise.resolve(null)),
  signIn: jest.fn(() => Promise.resolve({})),
  signOut: jest.fn(() => Promise.resolve()),
  signUp: jest.fn(() => Promise.resolve({})),
  confirmSignUp: jest.fn(() => Promise.resolve()),
  resendSignUp: jest.fn(() => Promise.resolve()),
  forgotPassword: jest.fn(() => Promise.resolve()),
  forgotPasswordSubmit: jest.fn(() => Promise.resolve()),
  changePassword: jest.fn(() => Promise.resolve('SUCCESS')),
  completeNewPassword: jest.fn(() => Promise.resolve({})),
  federatedSignIn: jest.fn(() => Promise.resolve()),
  deleteUser: jest.fn(() => Promise.resolve()),
  updateUserAttributes: jest.fn(() => Promise.resolve('SUCCESS')),
};

const Amplify = {
  configure: jest.fn(),
  register: jest.fn(),
};

const Hub = {
  listen: jest.fn(() => () => {}),
  dispatch: jest.fn(),
  remove: jest.fn(),
};

module.exports = {
  __esModule: true,
  Auth,
  Amplify,
  Hub,
  API: { get: jest.fn(), post: jest.fn(), put: jest.fn(), del: jest.fn() },
  Storage: { get: jest.fn(), put: jest.fn() },
  default: { configure: jest.fn() },
};
