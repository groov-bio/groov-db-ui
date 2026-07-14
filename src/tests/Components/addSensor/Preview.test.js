import { Formik } from 'formik';
import { renderWithProviders, screen } from '../../../test-utils';
import Preview from '../../../Components/addSensor/Preview';

function Harness({ initialValues }) {
  return (
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      {() => <Preview proteinIndex={initialValues.proteins ? 0 : null} />}
    </Formik>
  );
}

describe('Preview (add-sensor)', () => {
  test('v1 shape: reads alias/uniProtID/accession/family/mechanism from values.about', () => {
    renderWithProviders(
      <Harness
        initialValues={{
          about: {
            alias: 'AliasV1',
            uniProtID: 'P0ACT4',
            accession: 'NP_123456',
            family: 'TetR',
            mechanism: 'Apo-repressor',
          },
          ligands: [],
          operators: [],
        }}
      />
    );

    expect(screen.getByText('AliasV1')).toBeInTheDocument();
    expect(screen.getByText('TetR')).toBeInTheDocument();
    expect(screen.getByText('Apo-repressor')).toBeInTheDocument();

    const uniprotLink = screen.getByRole('link', { name: 'P0ACT4' });
    expect(uniprotLink).toHaveAttribute(
      'href',
      'https://www.uniprot.org/uniprot/P0ACT4'
    );
    const accessionLink = screen.getByRole('link', { name: 'NP_123456' });
    expect(accessionLink).toHaveAttribute(
      'href',
      'https://www.ncbi.nlm.nih.gov/protein/NP_123456'
    );
  });

  test('v2 shape: reads alias/uniProtID/accession/family from proteins[proteinIndex], mechanism from values.sensor', () => {
    renderWithProviders(
      <Harness
        initialValues={{
          sensor: { mechanism: 'Signal transduction' },
          proteins: [
            {
              alias: 'ProtA',
              uniProtID: 'P1',
              accession: 'NP1',
              family: 'OmpR',
              ligands: [],
              operators: [],
            },
          ],
        }}
      />
    );

    expect(screen.getByText('ProtA')).toBeInTheDocument();
    expect(screen.getByText('OmpR')).toBeInTheDocument();
    expect(screen.getByText('Signal transduction')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'P1' })).toHaveAttribute(
      'href',
      'https://www.uniprot.org/uniprot/P1'
    );
  });

  test('v2 shape with no protein at that index renders an empty metadata table (no Alias row)', () => {
    renderWithProviders(
      <Harness
        initialValues={{
          sensor: { mechanism: '' },
          proteins: [],
        }}
      />
    );
    expect(screen.queryByText('Alias', { selector: 'b' })).not.toBeInTheDocument();
  });

  test('renders without crashing when ligands/operators are present (LigandViewer/OperatorViewer are globally stubbed)', () => {
    renderWithProviders(
      <Harness
        initialValues={{
          about: {
            alias: 'AliasWithData',
            uniProtID: 'P2',
            accession: 'NP2',
            family: '',
            mechanism: '',
          },
          ligands: [
            {
              name: 'IPTG',
              SMILES: 'CC',
              doi: '10.1000/x',
              method: 'EMSA',
              ref_figure: 'Figure 1',
            },
          ],
          operators: [
            { sequence: 'ATCG', doi: '10.1000/y', method: 'EMSA', ref_figure: 'Figure 2' },
          ],
        }}
      />
    );
    // Concrete assertion: the metadata table still renders correctly alongside
    // the (stubbed) ligand/operator viewers.
    expect(screen.getByText('AliasWithData')).toBeInTheDocument();
  });
});
