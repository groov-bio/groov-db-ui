import { renderWithProviders, screen } from '../../../test-utils';
import Contribute from '../../../Components/About/Contribute.js';

describe('Contribute', () => {
  test('renders the "Contributing to groovDB" header', () => {
    renderWithProviders(<Contribute />);
    expect(screen.getByText(/Contributing to groov/)).toBeInTheDocument();
  });

  test('links to the biosensor submission form', () => {
    const { container } = renderWithProviders(<Contribute />);
    const link = container.querySelector('#about-add-sensor');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://www.groov.bio/addSensor/');
    expect(link).toHaveTextContent('biosensor submission form');
  });

  test('renders the "Batch submissions" section with a contact link', () => {
    renderWithProviders(<Contribute />);
    expect(screen.getByText('Batch submissions')).toBeInTheDocument();
    const contactLinks = screen.getAllByText('contact us');
    expect(contactLinks.length).toBeGreaterThan(0);
    expect(contactLinks[contactLinks.length - 1]).toHaveAttribute(
      'href',
      'https://groov.bio/about/contact'
    );
  });
});
