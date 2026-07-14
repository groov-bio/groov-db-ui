// Generic stub for heavy, non-React libraries (molstar, litemol, konva,
// @nightingale-elements, etc.) that only run in a real browser/WebGL context.
// A Proxy returns a callable/constructable stub for ANY property access, so
// `new SomeLib.Thing()`, `SomeLib.foo()`, and named imports all resolve to
// harmless no-ops during tests.
const handler = {
  get(target, prop) {
    if (prop === '__esModule') return true;
    if (prop === 'default') return proxy;
    if (prop === Symbol.toPrimitive || prop === Symbol.toStringTag) {
      return undefined;
    }
    if (!(prop in target)) {
      // eslint-disable-next-line no-empty-function
      target[prop] = new Proxy(function () {}, handler);
    }
    return target[prop];
  },
  apply() {
    return new Proxy(function () {}, handler);
  },
  construct() {
    return new Proxy({}, handler);
  },
};

// eslint-disable-next-line no-empty-function
const proxy = new Proxy(function () {}, handler);

module.exports = proxy;
