import { renderWithProviders, screen } from '../../../test-utils';
import FAQ_Tutorial from '../../../Components/About/FAQ_Tutorial.js';

describe('FAQ_Tutorial', () => {
  test('renders the FAQ header', () => {
    renderWithProviders(<FAQ_Tutorial />);
    expect(
      screen.getByText('Frequently asked questions')
    ).toBeInTheDocument();
  });

  test('renders the "how to add a sensor" question with a link to the submission form', () => {
    renderWithProviders(<FAQ_Tutorial />);
    expect(
      screen.getByText('How can I add my sensor to this database?')
    ).toBeInTheDocument();
    const link = screen.getByText('submission form.');
    expect(link).toHaveAttribute('href', 'https://groov.bio/addSensor');
  });

  test('renders the two-component-system question and a link to contact', () => {
    renderWithProviders(<FAQ_Tutorial />);
    expect(
      screen.getByText(
        'Does this database include riboswitches or two component systems?'
      )
    ).toBeInTheDocument();
    const link = screen.getByText('let us know.');
    expect(link).toHaveAttribute('href', 'https://groov.bio/about/contact');
  });
});
