import { Formik, Form } from 'formik';
import { renderWithProviders, screen, within } from '../../../test-utils';
import AboutSensorTab from './AboutSensorTab';

const aboutValues = (overrides = {}) => ({
  about: {
    alias: '',
    accession: '',
    uniProtID: '',
    family: '',
    mechanism: '',
    about: '',
    ...overrides,
  },
});

function Harness({ initialValues = aboutValues(), fieldPrefix }) {
  return (
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      <Form>
        <AboutSensorTab fieldPrefix={fieldPrefix} />
      </Form>
    </Formik>
  );
}

describe('AboutSensorTab', () => {
  test('renders the heading and all About fields with their ids', () => {
    const { container } = renderWithProviders(<Harness />);
    expect(screen.getByText('Basic information:')).toBeInTheDocument();
    expect(container.querySelector('#new-sensor-basic-info')).toBeInTheDocument();
    expect(container.querySelector('#new-sensor-about-alias')).toBeInTheDocument();
    expect(container.querySelector('#new-sensor-about-accession')).toBeInTheDocument();
    expect(container.querySelector('#new-sensor-about-uniprot')).toBeInTheDocument();
    expect(container.querySelector('#new-sensor-about-about')).toBeInTheDocument();
    expect(screen.getByText('Structural Family', { selector: 'label' })).toBeInTheDocument();
    expect(screen.getByText('Mechanism', { selector: 'label' })).toBeInTheDocument();
  });

  test('shows the initial Formik values in the alias/accession/uniprot fields', () => {
    const { container } = renderWithProviders(
      <Harness
        initialValues={aboutValues({
          alias: 'TetR1',
          accession: 'NP_123',
          uniProtID: 'P0ACT4',
        })}
      />
    );
    expect(container.querySelector('#new-sensor-about-alias')).toHaveValue('TetR1');
    expect(container.querySelector('#new-sensor-about-accession')).toHaveValue('NP_123');
    expect(container.querySelector('#new-sensor-about-uniprot')).toHaveValue('P0ACT4');
  });

  test('typing into the Alias field updates its displayed value', async () => {
    const { user, container } = renderWithProviders(<Harness />);
    const alias = container.querySelector('#new-sensor-about-alias');
    await user.type(alias, 'LacI');
    expect(alias).toHaveValue('LacI');
  });

  test('selecting a Structural Family option updates the select', async () => {
    const { user } = renderWithProviders(<Harness />);
    const familyLabel = screen.getByText('Structural Family', { selector: 'label' });
    const familyControl = familyLabel.closest('.MuiFormControl-root');
    const combobox = within(familyControl).getByRole('combobox');

    await user.click(combobox);
    const option = await screen.findByRole('option', { name: 'LysR' });
    await user.click(option);

    expect(within(familyControl).getByRole('combobox')).toHaveTextContent('LysR');
  });

  test('with a fieldPrefix, field names are namespaced (e.g. "protein.about.alias")', async () => {
    const { user, container } = renderWithProviders(
      <Harness
        initialValues={{ protein: aboutValues() }}
        fieldPrefix="protein"
      />
    );
    const alias = container.querySelector('#new-sensor-about-alias');
    await user.type(alias, 'Prefixed');
    expect(alias).toHaveValue('Prefixed');
  });
});
