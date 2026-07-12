import { renderWithProviders, screen } from '../../../test-utils';
import DnaArrayEdit from '../../../Components/editSensorV2/DnaArrayEdit';

describe('DnaArrayEdit', () => {
  test('shows the empty-state message when there are no items', () => {
    renderWithProviders(<DnaArrayEdit items={[]} onChange={() => {}} />);
    expect(screen.getByText(/no dna binding entries/i)).toBeInTheDocument();
  });

  test('renders a DNA entry with its sequence, method, Kd, figure and DOI', () => {
    const items = [
      { sequence: 'ATCGATCG', ref_figure: 'Figure 4', doi: '10.1000/dna', method: 'EMSA', kd: 250 },
    ];
    renderWithProviders(<DnaArrayEdit items={items} onChange={() => {}} />);

    expect(screen.getByLabelText('Sequence')).toHaveValue('ATCGATCG');
    expect(screen.getByRole('combobox', { name: 'Method' })).toHaveTextContent('EMSA');
    expect(screen.getByLabelText('Kd')).toHaveValue(250);
    expect(screen.getByLabelText('Figure number')).toHaveValue('4');
    expect(screen.getByLabelText('DOI')).toHaveValue('10.1000/dna');
  });

  test('clicking "Add DNA entry" calls onChange with an additional empty entry', async () => {
    const onChange = jest.fn();
    const { user } = renderWithProviders(<DnaArrayEdit items={[]} onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: /add dna entry/i }));

    expect(onChange).toHaveBeenCalledWith([
      { sequence: '', ref_figure: null, doi: null, method: '', kd: null },
    ]);
  });

  test('clicking the delete icon removes that entry', async () => {
    const onChange = jest.fn();
    const items = [
      { sequence: 'AAA', ref_figure: null, doi: null, method: '', kd: null },
      { sequence: 'BBB', ref_figure: null, doi: null, method: '', kd: null },
    ];
    const { user } = renderWithProviders(<DnaArrayEdit items={items} onChange={onChange} />);

    const deleteButtons = screen.getAllByTestId('DeleteIcon');
    await user.click(deleteButtons[0].closest('button'));

    expect(onChange).toHaveBeenCalledWith([items[1]]);
  });
});
