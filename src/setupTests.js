// Runs before every test file (auto-detected by react-scripts / CRA Jest).
// Adds jest-dom matchers and polyfills the browser APIs jsdom lacks but that
// MUI, MUI DataGrid, and various viewers rely on.
import '@testing-library/jest-dom';

// --- matchMedia (MUI useMediaQuery / responsive components) ---
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

// --- ResizeObserver (MUI DataGrid, charts) ---
if (!window.ResizeObserver) {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
global.ResizeObserver = window.ResizeObserver;

// --- IntersectionObserver (lazy sections) ---
if (!window.IntersectionObserver) {
  window.IntersectionObserver = class {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  };
}
global.IntersectionObserver = window.IntersectionObserver;

// --- scrollTo (called on route changes / some components) ---
window.scrollTo = window.scrollTo || (() => {});

// --- Canvas 2d context (smiles-drawer / logo / any <canvas>) ---
// smiles-drawer is mocked, but stray canvas access should not throw.
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext =
    HTMLCanvasElement.prototype.getContext ||
    function () {
      return {
        fillRect: () => {},
        clearRect: () => {},
        getImageData: () => ({ data: [] }),
        putImageData: () => {},
        createImageData: () => [],
        setTransform: () => {},
        drawImage: () => {},
        save: () => {},
        restore: () => {},
        beginPath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        closePath: () => {},
        stroke: () => {},
        translate: () => {},
        scale: () => {},
        rotate: () => {},
        arc: () => {},
        fill: () => {},
        measureText: () => ({ width: 0 }),
        transform: () => {},
        rect: () => {},
        clip: () => {},
      };
    };
}

// --- crypto.randomUUID (used by initialValues factory) ---
if (!global.crypto) {
  global.crypto = {};
}
if (!global.crypto.randomUUID) {
  let uuidCounter = 0;
  global.crypto.randomUUID = () => {
    uuidCounter += 1;
    return `${uuidCounter}-${uuidCounter}-${uuidCounter}-${uuidCounter}-${uuidCounter}`;
  };
}

// --- TextEncoder / TextDecoder (jsdom lacks these; @mui/x-data-grid and some
// deps reference them at import time) ---
if (typeof global.TextEncoder === 'undefined') {
  // eslint-disable-next-line global-require
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// --- Quiet known-benign console noise ---
// The suite is green, but passing tests still emit a flood of *expected*
// warnings (React act() warnings from async DataGrid/ripple/transition updates
// settling after an assertion, MUI out-of-range Select values in card tests,
// stray DOM props from the react-konva mock, web-component registration from
// mocked viewers). In CI this buries real failures. We swallow ONLY the
// allow-listed patterns below and pass everything else straight through, so a
// genuinely new error/warning still shows up loud.
//
// Escape hatch: run with SHOW_TEST_LOGS=1 to disable filtering and see it all.
if (!process.env.SHOW_TEST_LOGS) {
  const BENIGN = [
    /not wrapped in act\(/, // React state-update-after-assertion warnings
    /You have provided an out-of-range value/, // MUI Select with empty/placeholder value
    /React does not recognize the .* prop on a DOM element/, // react-konva mock passthrough
    /Unknown event handler property/, // react-konva mock passthrough
    /for a non-boolean attribute/, // stray boolean-ish props on stubs
    /is using incorrect casing/, // custom-element (nightingale/web-component) casing
    /is unrecognized in this browser/, // unregistered custom elements from mocked viewers
    /React Router Future Flag Warning/, // router v7 future-flag notices
    /React Router will begin wrapping state updates/,
    /Support for defaultProps will be removed/, // library deprecation chatter
  ];
  const isBenign = (args) =>
    typeof args[0] === 'string' && BENIGN.some((re) => re.test(args[0]));

  const realError = console.error.bind(console);
  const realWarn = console.warn.bind(console);
  console.error = (...args) => {
    if (!isBenign(args)) realError(...args);
  };
  console.warn = (...args) => {
    if (!isBenign(args)) realWarn(...args);
  };
}
