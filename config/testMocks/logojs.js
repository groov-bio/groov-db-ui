// Mock for logojs-react (sequence-logo rendering, needs canvas/DOM measuring).
// Every export renders a marker div so trees mount without a real canvas.
const React = require('react');

const Stub = (props) =>
  React.createElement('div', { 'data-testid': 'logojs-mock' });

module.exports = new Proxy(
  { __esModule: true, default: Stub },
  {
    get(target, prop) {
      if (prop === '__esModule') return true;
      if (prop === 'default') return Stub;
      return Stub;
    },
  }
);
