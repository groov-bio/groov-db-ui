import { renderWithProviders } from '../../../test-utils';
import ChangeLog from '../../../Components/About/ChangeLog.js';

describe('ChangeLog', () => {
  test('renders the "Change Log" header', () => {
    const { container } = renderWithProviders(<ChangeLog />);
    const header = container.querySelector('#about-change-log-header');
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent('Change Log');
  });

  test('renders the "improve groovDB" contact prompt', () => {
    const { container } = renderWithProviders(<ChangeLog />);
    const improve = container.querySelector('#improve-groov');
    expect(improve).toBeInTheDocument();
    expect(improve).toHaveTextContent(
      'We are always looking for ways to improve groovDB. If you have any suggestions, please contact us.'
    );
  });

  test('renders the latest version entry (2.3) with its Feature badge', () => {
    const { container } = renderWithProviders(<ChangeLog />);
    const latest = container.querySelector('#v2\\.3');
    expect(latest).toBeInTheDocument();
    expect(latest).toHaveTextContent('08 July, 2026 - V2.3');
    expect(latest).toHaveTextContent('Feature');
  });

  test('renders the first-ever version entry (1.1)', () => {
    const { container } = renderWithProviders(<ChangeLog />);
    const first = container.querySelector('#v1\\.1');
    expect(first).toBeInTheDocument();
    expect(first).toHaveTextContent('Now YOU can groov with us!');
  });
});
