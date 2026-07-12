import { Formik, Form } from 'formik';
import { renderWithProviders, screen } from '../../../../../test-utils';
import OperatorTab from '../../../../../Components/addSensor/v2_form/tabViews/OperatorTab';

const operator = (overrides = {}) => ({
  sequence: '',
  method: '',
  ref_figure: '',
  fig_type: '',
  doi: '',
  kd: '',
  kd_unit: 'nM',
  ...overrides,
});

function Harness({ operators, toggles = { operators: true } }) {
  return (
    <Formik
      initialValues={{ proteins: [{ operators, toggles }] }}
      onSubmit={() => {}}
    >
      <Form>
        <OperatorTab fieldPrefix="proteins[0]" />
      </Form>
    </Formik>
  );
}

describe('OperatorTab', () => {
  test('renders the heading, an enabled switch, and the initial operator card when toggled on', () => {
    renderWithProviders(<Harness operators={[operator({ sequence: 'ATCG' })]} />);
    expect(screen.getByText('DNA-binding information')).toBeInTheDocument();
    const toggle = screen.getByRole('checkbox', {
      name: 'This protein has a DNA operator',
    });
    expect(toggle).toBeChecked();
    expect(screen.getByText('Operator #1')).toBeInTheDocument();
    expect(screen.getByLabelText('Operator Sequence')).toHaveValue('ATCG');
  });

  test('toggling the switch off clears the operators array', async () => {
    const { user } = renderWithProviders(
      <Harness operators={[operator({ sequence: 'ATCG' })]} />
    );
    const toggle = screen.getByRole('checkbox', {
      name: 'This protein has a DNA operator',
    });
    await user.click(toggle);
    expect(screen.queryByText('Operator #1')).not.toBeInTheDocument();
  });

  test('when toggles.operators is false, the switch is unchecked and no operator card renders', () => {
    renderWithProviders(
      <Harness operators={[]} toggles={{ operators: false }} />
    );
    const toggle = screen.getByRole('checkbox', {
      name: 'This protein has a DNA operator',
    });
    expect(toggle).not.toBeChecked();
    expect(screen.queryByText(/^Operator #/)).not.toBeInTheDocument();
  });

  test('toggling the switch back on adds a fresh empty operator', async () => {
    const { user } = renderWithProviders(
      <Harness operators={[]} toggles={{ operators: false }} />
    );
    const toggle = screen.getByRole('checkbox', {
      name: 'This protein has a DNA operator',
    });
    await user.click(toggle);
    expect(await screen.findByText('Operator #1')).toBeInTheDocument();
    expect(screen.getByLabelText('Operator Sequence')).toHaveValue('');
  });

  test('"+ Add another operator" appends a second operator card', async () => {
    const { user } = renderWithProviders(
      <Harness operators={[operator({ sequence: 'ATCG' })]} />
    );
    await user.click(screen.getByRole('button', { name: '+ Add another operator' }));
    expect(await screen.findByText('Operator #2')).toBeInTheDocument();
  });
});
