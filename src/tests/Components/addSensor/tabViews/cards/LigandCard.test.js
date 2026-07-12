import { Formik, Form } from 'formik';
import { renderWithProviders, screen } from '../../../../../test-utils';
import LigandCard from '../../../../../Components/addSensor/tabViews/cards/LigandCard';

const ligandEntry = (overrides = {}) => ({
  name: '',
  SMILES: '',
  doi: '',
  ref_figure: '',
  fig_type: '',
  method: '',
  ...overrides,
});

// fieldPrefix defaults to '' in the source, so the FieldArray name is plain
// "ligands" (no dotted prefix).
function Harness({ ligands, index = 0 }) {
  return (
    <Formik initialValues={{ ligands }} onSubmit={() => {}}>
      {({ values }) => (
        <Form>
          <LigandCard index={index} />
          <div data-testid="ligand-count">{values.ligands.length}</div>
        </Form>
      )}
    </Formik>
  );
}

describe('LigandCard (add-sensor v1)', () => {
  test('renders its 1-based heading and the given field values', () => {
    renderWithProviders(
      <Harness
        ligands={[
          ligandEntry({ name: 'IPTG', SMILES: 'CC(=O)NC', doi: '10.1000/abc' }),
        ]}
      />
    );
    expect(screen.getByText('Ligand #1')).toBeInTheDocument();
    expect(screen.getByLabelText('Ligand Name')).toHaveValue('IPTG');
    expect(screen.getByLabelText('Ligand SMILES')).toHaveValue('CC(=O)NC');
    expect(screen.getByLabelText('Ligand DOI')).toHaveValue('10.1000/abc');
  });

  test('hides the delete button for the first entry (index 0)', () => {
    renderWithProviders(<Harness ligands={[ligandEntry()]} index={0} />);
    expect(screen.queryByTestId('DeleteForeverIcon')).not.toBeInTheDocument();
  });

  test('clicking the delete button removes that entry from the Formik array', async () => {
    const { user } = renderWithProviders(
      <Harness
        ligands={[
          ligandEntry({ name: 'IPTG' }),
          ligandEntry({ name: 'Anhydrotetracycline' }),
        ]}
        index={1}
      />
    );
    expect(screen.getByText('Ligand #2')).toBeInTheDocument();
    expect(screen.getByTestId('ligand-count')).toHaveTextContent('2');

    await user.click(screen.getByTestId('DeleteForeverIcon').closest('button'));

    expect(await screen.findByTestId('ligand-count')).toHaveTextContent('1');
  });
});
