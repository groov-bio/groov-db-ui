import { renderWithProviders, screen } from '../../test-utils';
import TextInput from './TextInput';
import { useAddSensorStore } from '../../zustand/addSensor.store';

// TextInput is bound to the zustand addSensor store (not react-hook-form,
// despite the unused `Controller` import in the source) — field/accessKey
// select which store slice it reads/writes.
describe('TextInput', () => {
  afterEach(() => {
    useAddSensorStore.getState().reset();
  });

  test('renders with the given label and shows the current store value', () => {
    useAddSensorStore.getState().updateField('about', 'alias', 'TetR');
    renderWithProviders(
      <TextInput label="Alias" field="about" accessKey="alias" pattern={/^[A-Za-z]*$/} />
    );
    expect(screen.getByLabelText('Alias')).toHaveValue('TetR');
  });

  test('typing updates the underlying store field', async () => {
    const { user } = renderWithProviders(
      <TextInput label="Alias" field="about" accessKey="alias" pattern={/^[A-Za-z]*$/} />
    );
    const input = screen.getByLabelText('Alias');
    await user.type(input, 'LacI');
    expect(input).toHaveValue('LacI');
    expect(useAddSensorStore.getState().about.alias).toBe('LacI');
  });

  test('shows a required helper text when the field is cleared', async () => {
    const { user } = renderWithProviders(
      <TextInput label="Alias" field="about" accessKey="alias" pattern={/^[A-Za-z]*$/} />
    );
    const input = screen.getByLabelText('Alias');
    await user.type(input, 'A');
    await user.clear(input);
    expect(await screen.findByText('Alias is required')).toBeInTheDocument();
  });

  test('shows a pattern helper text when the value fails validation', async () => {
    const { user } = renderWithProviders(
      <TextInput label="Alias" field="about" accessKey="alias" pattern={/^[A-Za-z]+$/} />
    );
    const input = screen.getByLabelText('Alias');
    await user.type(input, '123');
    expect(await screen.findByText('Invalid Alias.')).toBeInTheDocument();
  });
});
