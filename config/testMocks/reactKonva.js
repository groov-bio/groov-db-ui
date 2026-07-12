// Mock for react-konva. Each canvas primitive becomes a plain <div> that
// renders its children, so component trees that use <Stage>/<Layer>/<Rect>
// mount in jsdom without a real canvas. data-konva marks them for querying.
const React = require('react');

const passthrough = (name) => {
  const Comp = ({ children, ...props }) =>
    React.createElement(
      'div',
      { 'data-konva': name, ...filterDomProps(props) },
      children
    );
  Comp.displayName = `Konva.${name}`;
  return Comp;
};

// Konva components accept many non-DOM props (fill, points, etc.) that React
// would warn about on a <div>. Strip anything that isn't a safe DOM attribute.
const SAFE = new Set(['id', 'className', 'style', 'role', 'onClick']);
function filterDomProps(props) {
  const out = {};
  for (const key of Object.keys(props)) {
    if (SAFE.has(key) || key.startsWith('data-') || key.startsWith('aria-')) {
      out[key] = props[key];
    }
  }
  return out;
}

module.exports = new Proxy(
  {},
  {
    get(target, prop) {
      if (prop === '__esModule') return true;
      if (!(prop in target)) {
        target[prop] = passthrough(String(prop));
      }
      return target[prop];
    },
  }
);
