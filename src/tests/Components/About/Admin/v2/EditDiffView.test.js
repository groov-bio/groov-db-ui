import { renderWithProviders, screen } from '../../../../../test-utils';
import EditDiffView from '../../../../../Components/About/Admin/v2/EditDiffView';

describe('EditDiffView', () => {
  test('shows the "no pre-edit snapshot" message when there is no previous data', () => {
    renderWithProviders(<EditDiffView previous={null} proposed={{ about: { alias: 'X' } }} />);
    expect(
      screen.getByText(/no pre-edit snapshot is available for this submission/i)
    ).toBeInTheDocument();
  });

  test('shows "no differences detected" and no Changes section when previous === proposed', () => {
    const data = { about: { alias: 'AvaR1' } };
    renderWithProviders(<EditDiffView previous={data} proposed={data} />);

    expect(
      screen.getByText(/no differences detected between the current sensor and this edit/i)
    ).toBeInTheDocument();
    expect(screen.queryByText(/^changes \(/i)).not.toBeInTheDocument();
  });

  test('lists a changed section chip and a FROM -> TO row for a changed field', () => {
    const previous = { about: { alias: 'OldAlias' } };
    const proposed = { about: { alias: 'NewAlias' } };
    renderWithProviders(<EditDiffView previous={previous} proposed={proposed} />);

    expect(screen.getByText('Sections changed')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Changes (1)')).toBeInTheDocument();
    expect(screen.getByText('about.alias')).toBeInTheDocument();
    expect(screen.getByText('OldAlias')).toBeInTheDocument();
    expect(screen.getByText('NewAlias')).toBeInTheDocument();
  });

  test('maps a protein-level stimulus path to the "Stimulus" section label', () => {
    const previous = { proteins: [{ stimulus: [{ regulatory_effect: 'activates' }] }] };
    const proposed = { proteins: [{ stimulus: [{ regulatory_effect: 'represses' }] }] };
    renderWithProviders(<EditDiffView previous={previous} proposed={proposed} />);

    expect(screen.getByText('Stimulus')).toBeInTheDocument();
  });
});
