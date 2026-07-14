import { Formik, Form } from 'formik';
import { renderWithProviders, screen, within } from '../../../../../test-utils';
import AboutProteinTab from '../../../../../Components/addSensor/v2_form/tabViews/AboutProteinTab';

const protein = (overrides = {}) => ({
  alias: '',
  uniProtID: '',
  accession: '',
  family: '',
  ...overrides,
});

function Harness({ proteins, fieldPrefix = 'proteins[0]' }) {
  return (
    <Formik initialValues={{ proteins }} onSubmit={() => {}}>
      <Form>
        <AboutProteinTab fieldPrefix={fieldPrefix} />
      </Form>
    </Formik>
  );
}

describe('AboutProteinTab', () => {
  test('renders the heading and Alias/RefSeq/UniProt ID/Family fields', () => {
    renderWithProviders(<Harness proteins={[protein()]} />);
    expect(screen.getByText('Protein information')).toBeInTheDocument();
    expect(screen.getByLabelText('Alias')).toBeInTheDocument();
    expect(screen.getByLabelText('RefSeq (optional)')).toBeInTheDocument();
    expect(screen.getByLabelText('UniProt ID')).toBeInTheDocument();
    expect(screen.getByText('Family', { selector: 'label' })).toBeInTheDocument();
  });

  test('shows the initial Formik values for alias/refseq/uniprot', () => {
    renderWithProviders(
      <Harness
        proteins={[protein({ alias: 'TetR1', accession: 'WP_1', uniProtID: 'P0ACT4' })]}
      />
    );
    expect(screen.getByLabelText('Alias')).toHaveValue('TetR1');
    expect(screen.getByLabelText('RefSeq (optional)')).toHaveValue('WP_1');
    expect(screen.getByLabelText('UniProt ID')).toHaveValue('P0ACT4');
  });

  test('typing into Alias updates the displayed value', async () => {
    const { user } = renderWithProviders(<Harness proteins={[protein()]} />);
    const alias = screen.getByLabelText('Alias');
    await user.type(alias, 'LacI');
    expect(alias).toHaveValue('LacI');
  });

  test('with a single protein, the Family options do not include OmpR/HisKA', async () => {
    const { user } = renderWithProviders(<Harness proteins={[protein()]} />);
    const familyLabel = screen.getByText('Family', { selector: 'label' });
    const familyControl = familyLabel.closest('.MuiFormControl-root');
    await user.click(within(familyControl).getByRole('combobox'));
    expect(screen.getByRole('option', { name: 'TetR' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'OmpR' })).not.toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'HisKA' })).not.toBeInTheDocument();
  });

  test('with 2+ proteins, the Family options include OmpR/HisKA', async () => {
    const { user } = renderWithProviders(
      <Harness proteins={[protein(), protein()]} />
    );
    const familyLabel = screen.getByText('Family', { selector: 'label' });
    const familyControl = familyLabel.closest('.MuiFormControl-root');
    await user.click(within(familyControl).getByRole('combobox'));
    expect(screen.getByRole('option', { name: 'OmpR' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'HisKA' })).toBeInTheDocument();
  });
});
