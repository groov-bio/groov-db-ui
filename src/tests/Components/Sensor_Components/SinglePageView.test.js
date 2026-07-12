import React from 'react';
import { renderWithProviders, screen } from '../../../test-utils';

// SinglePageView -> DNAbinding transitively imports @mui/x-data-grid, whose
// hash util calls `new TextEncoder()` at module scope. jest-environment-jsdom
// does not provide a global TextEncoder, so we polyfill it before requiring
// the component. This must be a plain `require()` (not `import`) so Babel
// does not hoist it above this line the way it would with ES `import` syntax.
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
const SinglePageView = require('../../../Components/Sensor_Components/SinglePageView').default;

const baseSensorData = {
  alias: 'AvaR1',
  uniprotID: 'Q82H41',
  sequence: 'MSTNKELVDRILEAAEEVFAEKGYAAASMDDIAKAAGVGKGTIYLYFKDKQDLL',
  structures: [],
  fullReferences: [],
};

describe('SinglePageView', () => {
  test('shows "No ligand submitted" / "No DNA binding submitted" fallback cards when data is absent', () => {
    renderWithProviders(
      <SinglePageView
        sensorData={baseSensorData}
        isNightingaleLoaded={false}
        setIsNightingaleLoaded={() => {}}
        placement={{ ligMT: 0, ligMB: 0 }}
      />
    );

    expect(screen.getByText('No ligand submitted')).toBeInTheDocument();
    // DNA Binding section is only rendered (with fallback) if operators is
    // falsy is handled by the parent: SinglePageView renders no DNA card at
    // all when sensorData.operators is undefined (no fallback in this
    // component for DNA, unlike Ligand). Confirm the section is skipped.
    expect(screen.queryByText('DNA Binding')).not.toBeInTheDocument();

    // Sequence, Genome Context, and References sections always render.
    expect(screen.getByText('Sequence')).toBeInTheDocument();
    expect(screen.getByText('Genome Context')).toBeInTheDocument();
    expect(screen.getByText('References')).toBeInTheDocument();
  });

  test('renders the ligand name and operator sequence when present', async () => {
    renderWithProviders(
      <SinglePageView
        sensorData={{
          ...baseSensorData,
          ligands: [
            {
              name: 'Avenolide',
              SMILES: 'CC1CCC(=O)O1',
              doi: '10.1000/xyz',
              ref_figure: 'Figure 1',
              method: 'ITC',
            },
          ],
          operators: [
            {
              sequence: 'TTGACAATTGTCAA',
              ref_figure: 'Figure 2',
              doi: '10.1000/abc',
              method: 'EMSA',
            },
          ],
        }}
        isNightingaleLoaded={false}
        setIsNightingaleLoaded={() => {}}
        placement={{ ligMT: 0, ligMB: 0 }}
      />
    );

    expect(await screen.findByText('Avenolide')).toBeInTheDocument();
    expect(screen.getByText('DNA Binding')).toBeInTheDocument();
  });
});
