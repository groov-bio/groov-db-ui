import { Formik, Form } from 'formik';
import { renderWithProviders, screen, within, waitFor } from '../../../test-utils';
import SensorMetaTab from './SensorMetaTab';

function Harness({ proteins, mechanism = '' }) {
  return (
    <Formik
      initialValues={{ sensor: { mechanism, about: '' }, proteins }}
      onSubmit={() => {}}
    >
      <Form>
        <SensorMetaTab />
      </Form>
    </Formik>
  );
}

function getMechanismSelect() {
  const label = screen.getByText('Mechanism', { selector: 'label' });
  const control = label.closest('.MuiFormControl-root');
  return within(control).getByRole('combobox');
}

describe('SensorMetaTab', () => {
  test('renders the heading, and (single protein) an enabled mechanism select with single-component options', async () => {
    const { user } = renderWithProviders(
      <Harness proteins={[{ family: 'TetR' }]} />
    );
    expect(screen.getByText('Sensor information')).toBeInTheDocument();
    const combobox = getMechanismSelect();
    expect(combobox).not.toHaveAttribute('aria-disabled', 'true');

    await user.click(combobox);
    expect(screen.getByRole('option', { name: 'Apo-repressor' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Signal transduction' })).not.toBeInTheDocument();
  });

  test('with 2+ proteins, forces mechanism to "Signal transduction" and disables the select', async () => {
    renderWithProviders(
      <Harness proteins={[{ family: 'TetR' }, { family: 'OmpR' }]} mechanism="" />
    );
    await waitFor(() => {
      expect(getMechanismSelect()).toHaveTextContent('Signal transduction');
    });
    expect(getMechanismSelect()).toHaveAttribute('aria-disabled', 'true');
    expect(
      screen.getByText(/Multi-component sensor \(2\+ proteins\)/)
    ).toBeInTheDocument();
  });

  test('typing into "About this sensor" updates the value', async () => {
    const { user, container } = renderWithProviders(
      <Harness proteins={[{ family: 'TetR' }]} />
    );
    const about = container.querySelector('#v2-sensor-about');
    await user.type(about, 'A description');
    expect(about).toHaveValue('A description');
  });
});
