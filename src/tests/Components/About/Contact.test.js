import { renderWithProviders, screen } from '../../../test-utils';
import Contact from '../../../Components/About/Contact.js';

// Contact.js posts to https://api.groov.bio/contact_form via Formik. The
// TurnstileWidget it embeds auto-fills the required `turnstileToken` field
// with a fixed mock value whenever NODE_ENV === 'test' (see
// src/Components/form-inputs/TurnstileWidget.js), so submissions validate
// successfully under Jest without any extra CAPTCHA mocking.
async function fillAndSubmit(user, container) {
  await user.type(container.querySelector('#contact-form-name'), 'Jane Doe');
  await user.type(
    container.querySelector('#contact-form-email'),
    'jane@example.com'
  );
  await user.type(
    container.querySelector('#contact-form-message'),
    'Hello there'
  );
  await user.click(container.querySelector('#contact-send-button'));
}

describe('Contact', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders the "Contact Us" header and the form fields', () => {
    const { container } = renderWithProviders(<Contact />);

    const header = container.querySelector('#about-contact-us-header');
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent('Contact Us');

    expect(container.querySelector('#contact-form-name')).toBeInTheDocument();
    expect(container.querySelector('#contact-form-email')).toBeInTheDocument();
    expect(container.querySelector('#contact-form-message')).toBeInTheDocument();
    expect(container.querySelector('#contact-send-button')).toHaveTextContent(
      'Send'
    );
  });

  test('shows a success message when the contact form submits successfully', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true }));
    const { container, user } = renderWithProviders(<Contact />);

    await fillAndSubmit(user, container);

    const status = await screen.findByText('Message sent successfully!');
    expect(status).toHaveAttribute('id', 'contact-message-status');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.groov.bio/contact_form',
      expect.objectContaining({ method: 'POST' })
    );
  });

  test('shows a failure message when the server responds with a non-ok status', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, status: 400 })
    );
    const { container, user } = renderWithProviders(<Contact />);

    await fillAndSubmit(user, container);

    const status = await screen.findByText('Failed to send message.');
    expect(status).toHaveAttribute('id', 'contact-message-status');
  });

  test('shows a generic error message when the request itself fails (network error)', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network down')));
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const { container, user } = renderWithProviders(<Contact />);

    await fillAndSubmit(user, container);

    const status = await screen.findByText('An error occurred. Please try again.');
    expect(status).toHaveAttribute('id', 'contact-message-status');
  });
});
