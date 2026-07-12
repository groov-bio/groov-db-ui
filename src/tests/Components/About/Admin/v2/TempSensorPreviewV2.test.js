import { renderWithProviders, screen } from '../../../../../test-utils';
import TempSensorPreviewV2 from '../../../../../Components/About/Admin/v2/TempSensorPreviewV2';

describe('TempSensorPreviewV2', () => {
  test('renders nothing when there is no submission', () => {
    const { container } = renderWithProviders(<TempSensorPreviewV2 submission={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  test('renders mechanism, user, submissionUUID and the single protein details', () => {
    const submission = {
      submissionUUID: 'uuid-123',
      user: 'alice',
      timeSubmit: 1700000000000,
      sensor: {
        mechanism: 'Apo-repressor',
        about: 'A description of the sensor.',
        proteins: [
          {
            alias: 'AvaR1',
            uniProtID: 'Q82H41',
            accession: 'NC_000001',
            family: 'TetR',
            ligands: [{ name: 'IPTG', SMILES: 'CCO', regulatory_effect: 'represses' }],
          },
        ],
      },
    };

    renderWithProviders(<TempSensorPreviewV2 submission={submission} />);

    expect(screen.getByText('Apo-repressor')).toBeInTheDocument();
    expect(screen.getByText('User: alice')).toBeInTheDocument();
    expect(screen.getByText('uuid-123')).toBeInTheDocument();
    expect(screen.getByText('A description of the sensor.')).toBeInTheDocument();
    expect(screen.getByText('AvaR1')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Q82H41' })).toHaveAttribute(
      'href',
      'https://www.uniprot.org/uniprot/Q82H41'
    );
    // Ligand row rendered in the Ligands table.
    expect(screen.getByText('IPTG')).toBeInTheDocument();
    // No tabs shown for a single-protein submission.
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  });

  test('renders a protein tab per protein for multi-protein submissions', async () => {
    const submission = {
      submissionUUID: 'uuid-456',
      sensor: {
        proteins: [
          { alias: 'ProteinA', ligands: [] },
          { alias: 'ProteinB', ligands: [] },
        ],
      },
    };
    const { user } = renderWithProviders(<TempSensorPreviewV2 submission={submission} />);

    expect(screen.getByRole('tab', { name: 'ProteinA' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'ProteinB' })).toBeInTheDocument();
    // First protein's section shown by default.
    expect(screen.getByRole('heading', { name: 'ProteinA' })).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'ProteinB' }));
    expect(screen.getByRole('heading', { name: 'ProteinB' })).toBeInTheDocument();
  });

  test('shows "None submitted" for a protein with no ligands/operators/stimuli', () => {
    const submission = {
      submissionUUID: 'uuid-789',
      sensor: { proteins: [{ alias: 'BareProtein' }] },
    };
    renderWithProviders(<TempSensorPreviewV2 submission={submission} />);

    expect(screen.getAllByText('None submitted').length).toBeGreaterThan(0);
  });
});
