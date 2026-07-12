// RegFamilyTiles always mounts SensorTable (or SensorTableV2, behind a flag)
// as part of its main content area. SensorTable pulls in SensorPage ->
// DNAbinding -> @mui/x-data-grid, a very heavy dependency chain: under jsdom
// it triggers `ReferenceError: TextEncoder is not defined` (an internal
// @mui/x-internals hashing helper calls `new TextEncoder()` at module scope,
// and jsdom doesn't provide TextEncoder globally) and, even once that's
// polyfilled, real DataGrid rendering in jsdom is extremely slow/unstable
// (no real layout, ResizeObserver only stubbed) and made the suite hang.
// RegFamilyTiles' own behavior (family sidebar, tiles, "Add a sensor",
// download button) doesn't depend on SensorTable's internals, so stub both
// table implementations out here rather than paying that cost.
jest.mock('../../Components/SensorTable.js', () => function MockSensorTable() {
  return null;
});
jest.mock('../../Components/Sensor_Components/SensorTableV2.js', () => function MockSensorTableV2() {
  return null;
});

import { renderWithProviders, screen, waitFor } from '../../test-utils';
import RegFamilyTiles from '../../Components/RegFamilyTiles.js';

describe('RegFamilyTiles', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ sensors: [] }) })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders the "All Sensor Families" heading and sidebar on the default route', () => {
    renderWithProviders(<RegFamilyTiles />);
    expect(screen.getByText('All Sensor Families')).toBeInTheDocument();
    expect(screen.getByText('Regulatory Families')).toBeInTheDocument();
    expect(
      screen.getByText('Browse all sensors or select a family from the sidebar')
    ).toBeInTheDocument();
  });

  test('renders a sidebar link for each regulatory family, with the Dual family labeled "Two-Component"', () => {
    const { container } = renderWithProviders(<RegFamilyTiles />);

    const tetRLink = container.querySelector('#database-link-TetR');
    expect(tetRLink).toBeInTheDocument();
    expect(tetRLink).toHaveAttribute('href', '/database/TetR');
    expect(tetRLink).toHaveTextContent('TetR');

    const dualLink = container.querySelector('#database-link-Dual');
    expect(dualLink).toBeInTheDocument();
    expect(dualLink).toHaveAttribute('href', '/database/Dual');
    expect(dualLink).toHaveTextContent('Two-Component');
  });

  test('renders an "Add a sensor" link to the submission form', () => {
    renderWithProviders(<RegFamilyTiles />);
    const addSensorLink = screen.getByText('Add a sensor');
    expect(addSensorLink).toHaveAttribute('href', '/addSensor');
  });

  test('renders the download-all-sensors button, which becomes enabled once data loads', async () => {
    const { container } = renderWithProviders(<RegFamilyTiles />);
    const button = container.querySelector('#download-all-sensors-button');
    expect(button).toBeInTheDocument();
    await waitFor(() => expect(button).toBeEnabled());
    expect(button).toHaveTextContent('Download All Sensors');
  });
});
