import { Formik, Form } from 'formik';
import { renderWithProviders, screen, within } from '../../../../../../test-utils';
import LigandCard from '../../../../../../Components/addSensor/v2_form/tabViews/cards/LigandCard';

const ligandEntry = (overrides = {}) => ({
  name: '',
  SMILES: '',
  doi: '',
  fig_type: '',
  ref_figure: '',
  method: '',
  regulatory_effect: '',
  kd: '',
  kd_unit: '',
  ...overrides,
});

// v2_form LigandCard requires a fieldPrefix (no default), and the FieldArray
// name is `${fieldPrefix}.ligands`.
function Harness({ ligands, index = 0, fieldPrefix = 'entry' }) {
  return (
    <Formik initialValues={{ [fieldPrefix]: { ligands } }} onSubmit={() => {}}>
      {({ values }) => (
        <Form>
          <LigandCard index={index} fieldPrefix={fieldPrefix} />
          <div data-testid="ligand-count">
            {values[fieldPrefix].ligands.length}
          </div>
        </Form>
      )}
    </Formik>
  );
}

describe('LigandCard (v2_form)', () => {
  test('renders its 1-based heading and the given field values, including the regulatory-effect select', () => {
    renderWithProviders(
      <Harness
        ligands={[
          ligandEntry({
            name: 'IPTG',
            SMILES: 'CC(=O)NC',
            doi: '10.1000/abc',
            regulatory_effect: 'represses',
          }),
        ]}
      />
    );
    expect(screen.getByText('Ligand #1')).toBeInTheDocument();
    expect(screen.getByLabelText('Ligand Name')).toHaveValue('IPTG');
    expect(screen.getByLabelText('Ligand SMILES')).toHaveValue('CC(=O)NC');
    expect(screen.getByLabelText('Ligand DOI')).toHaveValue('10.1000/abc');

    const regEffectLabel = screen.getByText('Regulatory effect (optional)', {
      selector: 'label',
    });
    const regEffectControl = regEffectLabel.closest('.MuiFormControl-root');
    expect(within(regEffectControl).getByRole('combobox')).toHaveTextContent(
      'represses'
    );
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
