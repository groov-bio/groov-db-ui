import { Formik, Form } from 'formik';
import { renderWithProviders, screen } from '../../../../test-utils';
import LigandSensorTab from '../../../../Components/addSensor/tabViews/LigandSensorTab';

const ligand = (overrides = {}) => ({
  name: '',
  SMILES: '',
  doi: '',
  ref_figure: '',
  fig_type: '',
  method: '',
  ...overrides,
});

function Harness({ ligands, fieldPrefix }) {
  // lodash's `_.get` parses bracket segments (e.g. "proteins[0]") as array
  // indices, so mirror that with real nested structure here.
  const initialValues = fieldPrefix
    ? { proteins: [{ ligands }] }
    : { ligands };
  return (
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      <Form>
        <LigandSensorTab fieldPrefix={fieldPrefix} />
      </Form>
    </Formik>
  );
}

describe('LigandSensorTab', () => {
  test('renders the heading and one LigandCard per entry in values.ligands', () => {
    renderWithProviders(
      <Harness ligands={[ligand({ name: 'IPTG' }), ligand({ name: 'aTc' })]} />
    );
    expect(screen.getByText('Ligand-binding information:')).toBeInTheDocument();
    expect(screen.getByText('Ligand #1')).toBeInTheDocument();
    expect(screen.getByText('Ligand #2')).toBeInTheDocument();
    expect(screen.getByLabelText('Ligand Name')).toHaveValue('IPTG');
  });

  test('renders zero LigandCards when values.ligands is empty', () => {
    renderWithProviders(<Harness ligands={[]} />);
    expect(screen.getByText('Ligand-binding information:')).toBeInTheDocument();
    expect(screen.queryByText(/^Ligand #/)).not.toBeInTheDocument();
  });

  test('with a fieldPrefix, reads ligands from the namespaced path', () => {
    renderWithProviders(
      <Harness fieldPrefix="proteins[0]" ligands={[ligand({ name: 'Naringenin' })]} />
    );
    expect(screen.getByText('Ligand #1')).toBeInTheDocument();
    expect(screen.getByLabelText('Ligand Name')).toHaveValue('Naringenin');
  });
});
