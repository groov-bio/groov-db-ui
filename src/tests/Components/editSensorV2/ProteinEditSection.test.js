import { renderWithProviders, screen } from '../../../test-utils';
import ProteinEditSection from '../../../Components/editSensorV2/ProteinEditSection';

const protein = {
  uniprot_id: 'Q82H41',
  alias: 'AvaR1',
  refseq_id: 'NC_000001',
  kegg_id: 'K00001',
  regulation_type: 'Apo-repressor',
  sequence: 'MSEQVENCE',
  stimulus: [],
  dna: [],
  references: [],
};

describe('ProteinEditSection', () => {
  test('renders the Identity tab by default with alias, read-only fields, and the UniProt chip', () => {
    renderWithProviders(
      <ProteinEditSection protein={protein} proteinIndex={0} family="TetR" onChange={() => {}} user={{}} />
    );

    expect(screen.getByRole('heading', { name: 'AvaR1' })).toBeInTheDocument();
    expect(screen.getByText('Q82H41')).toBeInTheDocument();
    expect(screen.getByLabelText('Alias')).toHaveValue('AvaR1');
    expect(screen.getByLabelText('RefSeq ID')).toHaveValue('NC_000001');
    expect(screen.getByLabelText('RefSeq ID')).toBeDisabled();
    expect(screen.getByLabelText('Family')).toHaveValue('TetR');
    expect(screen.getByLabelText('KEGG ID')).toHaveValue('K00001');
    expect(screen.getByLabelText('Sequence')).toHaveValue('MSEQVENCE');
    expect(screen.getByLabelText('Sequence')).toBeDisabled();
  });

  test('falls back to "Protein N" heading when the protein has no alias', () => {
    renderWithProviders(
      <ProteinEditSection
        protein={{ ...protein, alias: null }}
        proteinIndex={2}
        family="TetR"
        onChange={() => {}}
        user={{}}
      />
    );
    expect(screen.getByRole('heading', { name: 'Protein 3' })).toBeInTheDocument();
  });

  test('editing the Alias field calls onChange with the updated protein', async () => {
    const onChange = jest.fn();
    const { user } = renderWithProviders(
      <ProteinEditSection protein={protein} proteinIndex={0} family="TetR" onChange={onChange} user={{}} />
    );

    await user.type(screen.getByLabelText('Alias'), 'X');

    expect(onChange).toHaveBeenCalledWith({ ...protein, alias: 'AvaR1X' });
  });

  test('switching to the Stimulus/DNA Binding/References tabs shows their empty-state text', async () => {
    const { user } = renderWithProviders(
      <ProteinEditSection protein={protein} proteinIndex={0} family="TetR" onChange={() => {}} user={{}} />
    );

    await user.click(screen.getByRole('tab', { name: 'Stimulus' }));
    expect(screen.getByText(/no stimulus entries/i)).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'DNA Binding' }));
    expect(screen.getByText(/no dna binding entries/i)).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'References' }));
    expect(screen.getByText(/no references/i)).toBeInTheDocument();
  });
});
