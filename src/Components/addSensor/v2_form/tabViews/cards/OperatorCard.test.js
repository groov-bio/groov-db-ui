import { Formik, Form } from 'formik';
import { renderWithProviders, screen, within } from '../../../../../test-utils';
import OperatorCard from './OperatorCard';

const operatorEntry = (overrides = {}) => ({
  sequence: '',
  doi: '',
  fig_type: '',
  ref_figure: '',
  method: '',
  kd: '',
  kd_unit: '',
  ...overrides,
});

// v2_form OperatorCard requires a fieldPrefix (no default), and the FieldArray
// name is `${fieldPrefix}.operators`.
function Harness({ operators, index = 0, fieldPrefix = 'entry' }) {
  return (
    <Formik initialValues={{ [fieldPrefix]: { operators } }} onSubmit={() => {}}>
      {({ values }) => (
        <Form>
          <OperatorCard index={index} fieldPrefix={fieldPrefix} />
          <div data-testid="operator-count">
            {values[fieldPrefix].operators.length}
          </div>
        </Form>
      )}
    </Formik>
  );
}

describe('OperatorCard (v2_form)', () => {
  test('renders its 1-based heading and the given field values, including the figure-type select', () => {
    renderWithProviders(
      <Harness
        operators={[
          operatorEntry({
            sequence: 'ATCGATCG',
            doi: '10.1000/xyz',
            fig_type: 'Table',
          }),
        ]}
      />
    );
    expect(screen.getByText('Operator #1')).toBeInTheDocument();
    expect(screen.getByLabelText('Operator Sequence')).toHaveValue('ATCGATCG');
    expect(screen.getByLabelText('Operator DOI')).toHaveValue('10.1000/xyz');

    const figureTypeLabel = screen.getByText('Figure Type', { selector: 'label' });
    const figureTypeControl = figureTypeLabel.closest('.MuiFormControl-root');
    expect(within(figureTypeControl).getByRole('combobox')).toHaveTextContent(
      'Table'
    );
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
