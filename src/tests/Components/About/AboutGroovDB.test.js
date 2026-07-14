import { renderWithProviders, screen } from '../../../test-utils';
import AboutGroovDB from '../../../Components/About/AboutGroovDB.js';

describe('AboutGroovDB', () => {
  test('renders the main header', () => {
    const { container } = renderWithProviders(<AboutGroovDB />);
    const header = container.querySelector('#about-header');
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent("A genetic sensor database");
  });

  test('links to Simon d\'Oelsnitz personal site', () => {
    const { container } = renderWithProviders(<AboutGroovDB />);
    const link = container.querySelector('#simon-url');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://simondoelsnitz.com');
    expect(link).toHaveTextContent("Simon d'Oelsnitz");
  });

  test('renders the "Criteria for interaction evidence" section', () => {
    renderWithProviders(<AboutGroovDB />);
    expect(
      screen.getByText('Criteria for interaction evidence')
    ).toBeInTheDocument();
  });

  test('renders a link to the accepted experimental evidence references, e.g. EMSA', () => {
    renderWithProviders(<AboutGroovDB />);
    const emsaLink = screen.getByText('Electrophoretic Mobility Shift Assay (EMSA)');
    expect(emsaLink).toHaveAttribute('href', 'https://doi.org/10.1093/nar/9.13.3047');
  });
});
