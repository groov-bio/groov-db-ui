// Mock for @aws-amplify/ui-react. Provides passthrough components and the
// common HOCs/hooks so components importing from it mount without the real
// Amplify UI runtime.
const React = require('react');

const Passthrough = ({ children }) =>
  React.createElement(React.Fragment, null, children);

const withAuthenticator = (Component) => Component;

const useAuthenticator = () => ({
  user: null,
  signOut: () => {},
  authStatus: 'unauthenticated',
});

module.exports = new Proxy(
  {
    __esModule: true,
    Authenticator: Object.assign(Passthrough, { Provider: Passthrough }),
    withAuthenticator,
    useAuthenticator,
    View: Passthrough,
    Heading: Passthrough,
    Button: Passthrough,
    ThemeProvider: Passthrough,
  },
  {
    get(target, prop) {
      if (prop in target) return target[prop];
      if (prop === '__esModule') return true;
      // Any other named export -> passthrough component.
      return Passthrough;
    },
  }
);
