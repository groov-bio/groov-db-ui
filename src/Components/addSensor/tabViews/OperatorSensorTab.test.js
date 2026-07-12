import { Formik, Form } from 'formik';
import { renderWithProviders, screen } from '../../../test-utils';
import OperatorSensorTab from './OperatorSensorTab';

const operator = (overrides = {}) => ({
  sequence: '',
  method: '',
  ref_figure: '',
  fig_type: '',
  doi: '',
  ...overrides,
});

function Harness({ operators, fieldPrefix }) {
  const initialValues = fieldPrefix
    ? { proteins: [{ operators }] }
    : { operators };
  return (
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      <Form>
        <OperatorSensorTab fieldPrefix={fieldPrefix} />
      </Form>
    </Formik>
  );
}

describe('OperatorSensorTab', () => {
  test('renders the heading and one OperatorCard per entry in values.operators', () => {
    renderWithProviders(
      <Harness
        operators={[operator({ sequence: 'ATCG' }), operator({ sequence: 'GGCC' })]}
      />
    );
    expect(screen.getByText('DNA-binding information:')).toBeInTheDocument();
    expect(screen.getByText('Operator #1')).toBeInTheDocument();
    expect(screen.getByText('Operator #2')).toBeInTheDocument();
    expect(screen.getByLabelText('Operator Sequence')).toHaveValue('ATCG');
  });

  test('renders zero OperatorCards when values.operators is empty', () => {
    renderWithProviders(<Harness operators={[]} />);
    expect(screen.getByText('DNA-binding information:')).toBeInTheDocument();
    expect(screen.queryByText(/^Operator #/)).not.toBeInTheDocument();
  });

  test('with a fieldPrefix, reads operators from the namespaced path', () => {
    renderWithProviders(
      <Harness fieldPrefix="proteins[0]" operators={[operator({ sequence: 'TTTT' })]} />
    );
    expect(screen.getByText('Operator #1')).toBeInTheDocument();
    expect(screen.getByLabelText('Operator Sequence')).toHaveValue('TTTT');
  });
});
