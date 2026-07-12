import { Formik, Form } from 'formik';
import { renderWithProviders, screen, waitFor } from '../../../test-utils';
import ProteinForm from './ProteinForm';
import { createEmptyProtein } from '../../../lib/constants/v2_form/initialValues';

function Harness({ protein = createEmptyProtein(), onSubmit = () => {} }) {
  return (
    <Formik initialValues={{ proteins: [protein] }} onSubmit={onSubmit}>
      <Form>
        <ProteinForm proteinIndex={0} />
      </Form>
    </Formik>
  );
}

describe('ProteinForm (v2, single protein)', () => {
  test('starts on the About step, showing Alias/UniProt fields', () => {
    renderWithProviders(<Harness />);
    expect(screen.getByText('Protein information')).toBeInTheDocument();
    expect(screen.getByLabelText('Alias')).toBeInTheDocument();
    // Other steps' content is unmounted while not selected.
    expect(screen.queryByText('Stimulus')).not.toBeInTheDocument();
  });

  test('clicking Next walks through Stimuli -> Operators -> Mutations, each replacing the prior step content', async () => {
    const { user } = renderWithProviders(<Harness />);

    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(await screen.findByText('Stimulus')).toBeInTheDocument();
    expect(screen.queryByText('Protein information')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(await screen.findByText('DNA-binding information')).toBeInTheDocument();
    expect(screen.queryByText('Stimulus')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(await screen.findByText('Mutations (optional)')).toBeInTheDocument();
    expect(screen.queryByText('DNA-binding information')).not.toBeInTheDocument();

    // Mutations is the last step (index 3): the footer now shows Submit.
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();
  });

  test('clicking a stepper label jumps directly to that step', async () => {
    const { user } = renderWithProviders(<Harness />);
    await user.click(screen.getByText('Mutations'));
    expect(await screen.findByText('Mutations (optional)')).toBeInTheDocument();
  });

  test('clicking Submit on the last step invokes the Formik onSubmit handler when the values pass (no schema attached here)', async () => {
    const onSubmit = jest.fn();
    const { user } = renderWithProviders(<Harness onSubmit={onSubmit} />);
    await user.click(screen.getByText('Mutations'));
    await user.click(await screen.findByRole('button', { name: 'Submit' }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
  });
});
