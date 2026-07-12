import { Formik, Form } from 'formik';
import { renderWithProviders, screen } from '../../../../test-utils';
import OperatorCard from './OperatorCard';

const operatorEntry = (overrides = {}) => ({
  sequence: '',
  method: '',
  ref_figure: '',
  fig_type: '',
  doi: '',
  ...overrides,
});

// fieldPrefix defaults to '' in the source, so the FieldArray name is plain
// "operators" (no dotted prefix).
function Harness({ operators, index = 0 }) {
  return (
    <Formik initialValues={{ operators }} onSubmit={() => {}}>
      {({ values }) => (
        <Form>
          <OperatorCard index={index} />
          <div data-testid="operator-count">{values.operators.length}</div>
        </Form>
      )}
    </Formik>
  );
}

describe('OperatorCard (add-sensor v1)', () => {
  test('renders its 1-based heading and the given field values', () => {
    renderWithProviders(
      <Harness
        operators={[operatorEntry({ sequence: 'ATCGATCG', doi: '10.1000/xyz' })]}
      />
    );
    expect(screen.getByText('Operator #1')).toBeInTheDocument();
    expect(screen.getByLabelText('Operator Sequence')).toHaveValue('ATCGATCG');
    expect(screen.getByLabelText('Operator DOI')).toHaveValue('10.1000/xyz');
  });

  test('hides the delete button for the first entry (index 0)', () => {
    renderWithProviders(<Harness operators={[operatorEntry()]} index={0} />);
    expect(screen.queryByTestId('DeleteForeverIcon')).not.toBeInTheDocument();
  });

  test('clicking the delete button removes that entry from the Formik array', async () => {
    const { user } = renderWithProviders(
      <Harness
        operators={[
          operatorEntry({ sequence: 'AAA' }),
          operatorEntry({ sequence: 'BBB' }),
        ]}
        index={1}
      />
    );
    expect(screen.getByText('Operator #2')).toBeInTheDocument();
    expect(screen.getByTestId('operator-count')).toHaveTextContent('2');

    await user.click(screen.getByTestId('DeleteForeverIcon').closest('button'));

    expect(await screen.findByTestId('operator-count')).toHaveTextContent('1');
  });
});
