import { renderWithProviders } from '../../../test-utils';
import Cite from '../../../Components/About/Cite.js';

// NOTE: suspected bug — src/Components/About/Cite.js defines
// `export default function Contact()` (a leftover name, likely copy-pasted
// from Contact.js). It doesn't affect behavior since it's still the default
// export, so tests exercise it via the `Cite` import as usual.

describe('Cite', () => {
  test('renders the "Citing groovDB" header', () => {
    const { container } = renderWithProviders(<Cite />);
    const header = container.querySelector('#about-cite-header');
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent('Citing groovDB');
  });

  test('renders the "Citing other tools" header', () => {
    const { container } = renderWithProviders(<Cite />);
    const header = container.querySelector('#about-cite-other');
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent('Citing other tools');
  });

  test('links to the primary groovDB citation DOI', () => {
    const { container } = renderWithProviders(<Cite />);
    const link = container.querySelector('a[href="https://doi.org/10.1093/nar/gkaf1074"]');
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent('10.1093/nar/gkaf1074');
  });

  test('links to the Snowprint and Ligify citation DOIs', () => {
    const { container } = renderWithProviders(<Cite />);
    expect(
      container.querySelector('a[href="https://doi.org/10.1038/s42003-024-05849-8"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('a[href="https://doi.org/10.1021/acssynbio.4c00372"]')
    ).toBeInTheDocument();
  });
});
