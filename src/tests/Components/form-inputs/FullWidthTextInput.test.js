import { useForm } from 'react-hook-form';
import { renderWithProviders, screen } from '../../../test-utils';
import FullWidthTextInput from '../../../Components/form-inputs/FullWidthTextInput';

// FullWidthTextInput wraps a react-hook-form Controller, so it needs a real
// `control` object from useForm(). mode: 'onChange' so Controller's
// fieldState.error updates as the user types instead of only on submit.
function Harness() {
  const { control } = useForm({
    mode: 'onChange',
    defaultValues: { email: '' },
  });
  return (
    <FullWidthTextInput
      inputName="email"
      control={control}
      inputId="email-input"
      inputLabel="Email"
      validationPattern={/^\S+@\S+\.\S+$/}
    />
  );
}

describe('FullWidthTextInput', () => {
  test('renders with the given label and lets the user type a value', async () => {
    const { user } = renderWithProviders(<Harness />);
    const input = screen.getByLabelText('Email');
    await user.type(input, 'a@b.com');
    expect(input).toHaveValue('a@b.com');
  });

  test('shows a required error after the field is cleared', async () => {
    const { user } = renderWithProviders(<Harness />);
    const input = screen.getByLabelText('Email');
    await user.type(input, 'a');
    await user.clear(input);
    expect(await screen.findByText('email is required')).toBeInTheDocument();
  });

  test('shows a pattern error for a value that does not match the pattern', async () => {
    const { user } = renderWithProviders(<Harness />);
    const input = screen.getByLabelText('Email');
    await user.type(input, 'not-an-email');
    expect(await screen.findByText('Invalid email')).toBeInTheDocument();
  });
});
