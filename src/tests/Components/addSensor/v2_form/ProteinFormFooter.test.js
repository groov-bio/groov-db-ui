import { Formik, Form } from 'formik';
import { renderWithProviders, screen, waitFor } from '../../../../test-utils';
import ProteinFormFooter from '../../../../Components/addSensor/v2_form/ProteinFormFooter';

function Harness({ stepValue, setStepValue = () => {}, onSubmit = () => {} }) {
  return (
    <Formik initialValues={{}} onSubmit={onSubmit}>
      <Form>
        <ProteinFormFooter stepValue={stepValue} setStepValue={setStepValue} />
      </Form>
    </Formik>
  );
}

describe('ProteinFormFooter', () => {
  test('disables Previous on step 0 and shows Next (not Submit)', () => {
    renderWithProviders(<Harness stepValue={0} />);
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Submit' })).not.toBeInTheDocument();
  });

  test('shows Submit (with id add-new-sensor-submit) on the last step (3)', () => {
    renderWithProviders(<Harness stepValue={3} />);
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    expect(submitButton).toHaveAttribute('id', 'add-new-sensor-submit');
    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();
  });

  test('Previous/Next call setStepValue with the adjacent step', async () => {
    const setStepValue = jest.fn();
    const { user } = renderWithProviders(
      <Harness stepValue={1} setStepValue={setStepValue} />
    );
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(setStepValue).toHaveBeenCalledWith(0);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(setStepValue).toHaveBeenCalledWith(2);
  });

  test('clicking Submit invokes the Formik onSubmit handler', async () => {
    const onSubmit = jest.fn();
    const { user } = renderWithProviders(<Harness stepValue={3} onSubmit={onSubmit} />);
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
  });

  test('while submitting, the Submit button is disabled and reads "Submitting…"', async () => {
    let resolveSubmit;
    const onSubmit = jest.fn(
      () => new Promise((resolve) => { resolveSubmit = resolve; })
    );
    const { user } = renderWithProviders(<Harness stepValue={3} onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    const submittingButton = await screen.findByRole('button', { name: 'Submitting…' });
    expect(submittingButton).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();

    resolveSubmit();
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Submit' })).not.toBeDisabled()
    );
  });
});
