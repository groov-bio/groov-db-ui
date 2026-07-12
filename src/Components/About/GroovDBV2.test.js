import { renderWithProviders } from '../../test-utils';
import GroovDBV2 from './GroovDBV2.js';

describe('GroovDBV2', () => {
  test('renders the main header', () => {
    const { container } = renderWithProviders(<GroovDBV2 />);
    const header = container.querySelector('#about-groovdb-v2-header');
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent("What's new in groovDB");
  });

  test('renders the "V2" chip', () => {
    const { getByText } = renderWithProviders(<GroovDBV2 />);
    expect(getByText('V2')).toBeInTheDocument();
  });

  test('renders each of the "what changed" sections', () => {
    const { container } = renderWithProviders(<GroovDBV2 />);
    expect(container.querySelector('#v2-sensor-model')).toHaveTextContent(
      'We now accept Two Component Systems'
    );
    expect(container.querySelector('#v2-edit')).toHaveTextContent(
      'You can suggest edits for any sensor'
    );
    expect(container.querySelector('#v2-richer-data')).toHaveTextContent(
      'More precise data'
    );
    expect(container.querySelector('#v2-pages')).toHaveTextContent(
      'Redesigned sensor pages and tables'
    );
    expect(container.querySelector('#v2-contribute')).toHaveTextContent(
      'A rebuilt submission experience'
    );
  });

  test('links to the change log and contact page at the bottom', () => {
    const { container } = renderWithProviders(<GroovDBV2 />);
    expect(container.querySelector('a[href="change-log"]')).toHaveTextContent(
      'change log'
    );
    expect(container.querySelector('a[href="contact"]')).toHaveTextContent(
      'Contact us'
    );
  });
});
