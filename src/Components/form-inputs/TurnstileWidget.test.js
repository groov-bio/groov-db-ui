import { Formik } from 'formik';
import { renderWithProviders, screen, waitFor } from '../../test-utils';
import TurnstileWidget from './TurnstileWidget';

// TurnstileWidget short-circuits to a mock Box whenever
// process.env.NODE_ENV === 'test' (true under Jest), before ever touching the
// real @marsidev/react-turnstile import, and auto-fills the Formik field with
// a fixed mock token via a useEffect.
function Harness() {
  return (
    <Formik initialValues={{ captchaToken: '' }} onSubmit={() => {}}>
      {({ values }) => (
        <>
          <TurnstileWidget name="captchaToken" siteKey="test-site-key" />
          <div data-testid="captcha-value">{values.captchaToken}</div>
        </>
      )}
    </Formik>
  );
}

describe('TurnstileWidget', () => {
  test('renders the mock captcha widget in the test environment', () => {
    renderWithProviders(<Harness />);
    expect(screen.getByTestId('mock-turnstile')).toBeInTheDocument();
    expect(screen.getByText('Mock CAPTCHA (Test Mode)')).toBeInTheDocument();
  });

  test('auto-fills the bound Formik field with the mock token', async () => {
    renderWithProviders(<Harness />);
    await waitFor(() =>
      expect(screen.getByTestId('captcha-value')).toHaveTextContent(
        'mock-turnstile-token-for-testing'
      )
    );
  });
});
