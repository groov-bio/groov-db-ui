import { Formik, Form } from 'formik';
import { renderWithProviders, screen } from '../../../test-utils';
import ProteinFormStepper from './ProteinFormStepper';

// ProteinFormStepper reads `submitCount` off Formik context (not a prop), so a
// real submit must occur to flip the "Missing data" markers on. proteinErrors
// is a plain prop (independent of Formik's own error state), so we can hand
// it whatever shape we want to test each step's error condition.
function Harness({ stepValue = 0, setStepValue = () => {}, proteinErrors = {} }) {
  return (
    <Formik initialValues={{}} onSubmit={() => {}}>
      <Form>
        <ProteinFormStepper
          stepValue={stepValue}
          setStepValue={setStepValue}
          proteinErrors={proteinErrors}
        />
        <button type="submit">TriggerSubmit</button>
      </Form>
    </Formik>
  );
}

describe('ProteinFormStepper', () => {
  test('renders the four step labels with no "Missing data" before any submit attempt', () => {
    renderWithProviders(
      <Harness proteinErrors={{ alias: 'Alias is required' }} />
    );
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Stimuli')).toBeInTheDocument();
    expect(screen.getByText('Operators')).toBeInTheDocument();
    expect(screen.getByText('Mutations')).toBeInTheDocument();
    // submitCount is still 0, so errorAt() short-circuits to false regardless
    // of proteinErrors content.
    expect(screen.queryByText('Missing data')).not.toBeInTheDocument();
  });

  test('after a submit attempt, marks "About" as "Missing data" when alias/accession/uniProtID/family errors exist', async () => {
    const { user } = renderWithProviders(
      <Harness proteinErrors={{ alias: 'Alias is required' }} />
    );
    await user.click(screen.getByRole('button', { name: 'TriggerSubmit' }));
    expect(await screen.findByText('Missing data')).toBeInTheDocument();
  });

  test('after a submit attempt, marks "Stimuli" as "Missing data" when ligands errors exist', async () => {
    const { user } = renderWithProviders(
      <Harness proteinErrors={{ ligands: [{ name: 'Name is required' }] }} />
    );
    await user.click(screen.getByRole('button', { name: 'TriggerSubmit' }));
    expect(await screen.findByText('Missing data')).toBeInTheDocument();
  });

  test('after a submit attempt with no proteinErrors, no step shows "Missing data"', async () => {
    const { user } = renderWithProviders(<Harness proteinErrors={{}} />);
    await user.click(screen.getByRole('button', { name: 'TriggerSubmit' }));
    // Give Formik's submit handling a tick to settle before asserting absence.
    await screen.findByRole('button', { name: 'TriggerSubmit' });
    expect(screen.queryByText('Missing data')).not.toBeInTheDocument();
  });

  test('clicking a step label calls setStepValue with that step index', async () => {
    const setStepValue = jest.fn();
    const { user } = renderWithProviders(<Harness setStepValue={setStepValue} />);
    await user.click(screen.getByText('Operators'));
    expect(setStepValue).toHaveBeenCalledWith(2);
  });
});
