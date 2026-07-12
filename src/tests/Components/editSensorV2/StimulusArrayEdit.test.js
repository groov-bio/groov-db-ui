import { renderWithProviders, screen } from '../../../test-utils';
import StimulusArrayEdit from '../../../Components/editSensorV2/StimulusArrayEdit';

describe('StimulusArrayEdit', () => {
  test('shows the empty-state message when there are no items', () => {
    renderWithProviders(<StimulusArrayEdit items={[]} onChange={() => {}} />);
    expect(screen.getByText(/no stimulus entries/i)).toBeInTheDocument();
  });

  test('renders a small-molecule stimulus card (expanded by default) with its name, SMILES and evidence', () => {
    const items = [
      {
        stimulusType: [
          {
            small_molecule: [{ name: 'IPTG', smiles: 'CC(=O)O', regulatory_effect: 'represses' }],
            light: null,
            temperature: null,
          },
        ],
        stimulus_evidence: [{ method: ['EMSA'], ref_figure: 'Figure 3', doi: '10.1000/xyz', kd: 500 }],
      },
    ];

    renderWithProviders(<StimulusArrayEdit items={items} onChange={() => {}} />);

    expect(screen.getByText('Stimulus 1')).toBeInTheDocument();
    expect(screen.getByText('IPTG')).toBeInTheDocument(); // card summary chip
    expect(screen.getByLabelText('Name')).toHaveValue('IPTG');
    expect(screen.getByLabelText('SMILES')).toHaveValue('CC(=O)O');
    // MUI's `select` TextField renders a combobox div (not a native <select>),
    // so its chosen value is asserted via text content rather than toHaveValue.
    expect(screen.getByRole('combobox', { name: 'Regulatory effect' })).toHaveTextContent(
      'represses'
    );
    expect(screen.getByLabelText('DOI')).toHaveValue('10.1000/xyz');
    expect(screen.getByLabelText('Kd')).toHaveValue(500);
    expect(screen.getByLabelText('Figure number')).toHaveValue('3');
  });

  test('renders a light stimulus card with its wavelength field', () => {
    const items = [
      {
        stimulusType: [{ small_molecule: null, light: [{ wavelength: 470, regulatory_effect: 'activates' }], temperature: null }],
        stimulus_evidence: [{ method: [], ref_figure: null, doi: null, kd: null }],
      },
    ];
    renderWithProviders(<StimulusArrayEdit items={items} onChange={() => {}} />);

    expect(screen.getByLabelText(/wavelength/i)).toHaveValue(470);
    expect(screen.getByRole('combobox', { name: 'Regulatory effect' })).toHaveTextContent(
      'activates'
    );
  });

  test('clicking "Add stimulus" calls onChange with an additional empty small-molecule card', async () => {
    const onChange = jest.fn();
    const { user } = renderWithProviders(<StimulusArrayEdit items={[]} onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: /add stimulus/i }));

    expect(onChange).toHaveBeenCalledTimes(1);
    const newStimulusArray = onChange.mock.calls[0][0];
    expect(newStimulusArray).toHaveLength(1);
    expect(newStimulusArray[0].stimulusType[0].small_molecule).toEqual([
      { name: null, smiles: null, regulatory_effect: null },
    ]);
  });
});
