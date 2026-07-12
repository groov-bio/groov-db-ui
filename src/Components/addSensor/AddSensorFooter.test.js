import { Formik, Form } from 'formik';
import { renderWithProviders, screen, waitFor } from '../../test-utils';
import AddSensorFooter from './AddSensorFooter';

const ligand = () => ({
  name: '',
  SMILES: '',
  doi: '',
  ref_figure: '',
  fig_type: '',
  method: '',
});

const operator = () => ({
  sequence: '',
  method: '',
  ref_figure: '',
  fig_type: '',
  doi: '',
});

function Harness({ stepValue, setStepValue = () => {}, onSubmit = () => {} }) {
  return (
    <Formik
      initialValues={{ ligands: [ligand()], operators: [operator()] }}
      onSubmit={onSubmit}
    >
      {({ values }) => (
        <Form>
          <AddSensorFooter stepValue={stepValue} setStepValue={setStepValue} />
          <div data-testid="ligand-count">{values.ligands.length}</div>
          <div data-testid="operator-count">{values.operators.length}</div>
        </Form>
      )}
    </Formik>
  );
}

describe('AddSensorFooter', () => {
  test('disables Previous on the first step, and shows Next (not Submit) on steps 0 and 1', () => {
    renderWithProviders(<Harness stepValue={0} />);
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Submit' })).not.toBeInTheDocument();
  });

  test('shows "Add New Ligand" on step 1 (Ligands) and clicking it appends a ligand', async () => {
    const { user } = renderWithProviders(<Harness stepValue={1} />);
    expect(screen.getByTestId('ligand-count')).toHaveTextContent('1');
    await user.click(screen.getByRole('button', { name: 'Add New Ligand' }));
    expect(await screen.findByTestId('ligand-count')).toHaveTextContent('2');
  });

  test('shows "Add New Operator" and the Submit button on step 2 (Operators), and clicking Add appends an operator', async () => {
    const { user } = renderWithProviders(<Harness stepValue={2} />);
    expect(screen.getByTestId('operator-count')).toHaveTextContent('1');
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    expect(submitButton).toHaveAttribute('id', 'add-new-sensor-submit');

    await user.click(screen.getByRole('button', { name: 'Add New Operator' }));
    expect(await screen.findByTestId('operator-count')).toHaveTextContent('2');
  });

  test('Previous calls setStepValue(stepValue - 1) and Next calls setStepValue(stepValue + 1)', async () => {
    const setStepValue = jest.fn();
    const { user } = renderWithProviders(
      <Harness stepValue={1} setStepValue={setStepValue} />
    );
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(setStepValue).toHaveBeenCalledWith(0);

    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(setStepValue).toHaveBeenCalledWith(2);
  });

  test('clicking Submit on the last step invokes the Formik onSubmit handler', async () => {
    const onSubmit = jest.fn();
    const { user } = renderWithProviders(<Harness stepValue={2} onSubmit={onSubmit} />);
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
  });
});
