import { Formik, Form } from 'formik';
import { renderWithProviders, screen } from '../../test-utils';
import { FormikSelectInput } from './FormikSelectInput';

// NOTE (suspected bug): FormikSelectInput never sets an `id` on the Select or
// a matching `labelId`/`id` pair between it and its InputLabel, so the
// rendered combobox has no accessible name (screen-reader users would just
// hear "combobox"). We work around that in these tests by scoping on the
// single combobox present rather than by accessible name.
function Harness({ initialValues = { fig_type: '' }, validate }) {
  return (
    <Formik initialValues={initialValues} validate={validate} onSubmit={() => {}}>
      <Form>
        <FormikSelectInput
          name="fig_type"
          label="Figure Type"
          options={['Figure', 'Table']}
        />
        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
}

describe('FormikSelectInput', () => {
  test('renders the label and options, and selecting one updates the field', async () => {
    const { user } = renderWithProviders(<Harness />);
    expect(
      screen.getByText('Figure Type', { selector: 'label' })
    ).toBeInTheDocument();

    const combobox = screen.getByRole('combobox');
    await user.click(combobox);
    const option = await screen.findByRole('option', { name: 'Table' });
    await user.click(option);

    expect(screen.getByRole('combobox')).toHaveTextContent('Table');
  });

  test('only shows the error message after a submit attempt', async () => {
    const validate = () => ({ fig_type: 'Figure type is required' });
    const { user } = renderWithProviders(<Harness validate={validate} />);

    expect(
      screen.queryByText('Figure type is required')
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(
      await screen.findByText('Figure type is required')
    ).toBeInTheDocument();
  });
});
