// Mock for @marsidev/react-turnstile (Cloudflare CAPTCHA widget).
// Renders a marker and immediately fires onSuccess with a fake token so forms
// gated behind the widget can proceed in tests.
const React = require('react');

const Turnstile = ({ onSuccess }) => {
  React.useEffect(() => {
    if (typeof onSuccess === 'function') onSuccess('test-turnstile-token');
  }, [onSuccess]);
  return React.createElement('div', { 'data-testid': 'turnstile-mock' });
};

module.exports = {
  __esModule: true,
  Turnstile,
  default: Turnstile,
};
