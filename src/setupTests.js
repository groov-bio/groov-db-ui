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

// Silence noisy, expected console errors from mocked heavy libs / act warnings
// is intentionally NOT done here — leaving console output visible so agents can
// spot real problems. Individual tests may spyOn(console, 'error') as needed.
