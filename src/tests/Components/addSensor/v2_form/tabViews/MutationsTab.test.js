import { Formik, Form } from 'formik';
import { renderWithProviders, screen, within } from '../../../../../test-utils';
import MutationsTab from '../../../../../Components/addSensor/v2_form/tabViews/MutationsTab';

function Harness({ mutations = [] }) {
  return (
    <Formik
      initialValues={{ proteins: [{ mutations }] }}
      onSubmit={() => {}}
    >
      <Form>
        <MutationsTab fieldPrefix="proteins[0]" />
      </Form>
    </Formik>
  );
}

describe('MutationsTab', () => {
  test('renders the heading, and no mutation rows when the array is empty', () => {
    renderWithProviders(<Harness />);
    expect(screen.getByText('Mutations (optional)')).toBeInTheDocument();
    expect(screen.queryByText(/^Mutation set #/)).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '+ Add mutation set' })
    ).toBeInTheDocument();
  });

  test('clicking "+ Add mutation set" adds a mutation row with its fields', async () => {
    const { user } = renderWithProviders(<Harness />);
    await user.click(screen.getByRole('button', { name: '+ Add mutation set' }));

    expect(await screen.findByText('Mutation set #1')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Mutations (comma-separated)')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Reference protein ID')).toBeInTheDocument();
    // ref_type defaults to 'UniProt' per createEmptyMutation()
    const refTypeLabel = screen.getByText('Reference type', { selector: 'label' });
    const refTypeControl = refTypeLabel.closest('.MuiFormControl-root');
    expect(within(refTypeControl).getByRole('combobox')).toHaveTextContent('UniProt');
  });

  test('typing into "Mutations (comma-separated)" updates the value', async () => {
    const { user } = renderWithProviders(
      <Harness mutations={[{ mutations: '', ref_type: 'UniProt', ref_id: '' }]} />
    );
    const input = screen.getByLabelText('Mutations (comma-separated)');
    await user.type(input, 'L42A, K77R');
    expect(input).toHaveValue('L42A, K77R');
  });

  test('clicking the delete icon removes that mutation row', async () => {
    const { user } = renderWithProviders(
      <Harness
        mutations={[
          { mutations: 'L42A', ref_type: 'UniProt', ref_id: 'P1' },
          { mutations: 'K77R', ref_type: 'UniProt', ref_id: 'P2' },
        ]}
      />
    );
    expect(screen.getByText('Mutation set #1')).toBeInTheDocument();
    expect(screen.getByText('Mutation set #2')).toBeInTheDocument();

    const deleteButtons = screen.getAllByTestId('DeleteForeverIcon');
    await user.click(deleteButtons[0].closest('button'));

    expect(screen.queryByText('Mutation set #2')).not.toBeInTheDocument();
    expect(await screen.findByDisplayValue('K77R')).toBeInTheDocument();
  });
});
