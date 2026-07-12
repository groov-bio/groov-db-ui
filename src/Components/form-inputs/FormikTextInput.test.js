import { Formik, Form } from 'formik';
import { renderWithProviders, screen } from '../../test-utils';
import { FormikTextInput } from './FormikTextInput';

function Harness({ initialValues = { alias: '' }, validate }) {
  return (
    <Formik initialValues={initialValues} validate={validate} onSubmit={() => {}}>
      <Form>
        <FormikTextInput name="alias" label="Alias" />
        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
}

describe('FormikTextInput', () => {
  test('shows the initial Formik field value', () => {
    renderWithProviders(<Harness initialValues={{ alias: 'TetR' }} />);
    expect(screen.getByLabelText('Alias')).toHaveValue('TetR');
  });

  test('typing updates the Formik field value', async () => {
    const { user } = renderWithProviders(<Harness />);
    const input = screen.getByLabelText('Alias');
    await user.type(input, 'LacI');
    expect(input).toHaveValue('LacI');
  });

  test('only shows the error message after a submit attempt', async () => {
    const validate = (values) =>
      values.alias ? {} : { alias: 'Alias is required' };
    const { user } = renderWithProviders(<Harness validate={validate} />);

    expect(screen.queryByText('Alias is required')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText('Alias is required')).toBeInTheDocument();
  });
});
