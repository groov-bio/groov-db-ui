// NOTE: StructuresArrayEdit is not imported anywhere else in the app (grep
// confirms no other module references it) -- ProteinEditSection.js explicitly
// omits a Structures tab ("Structures and Context are intentionally omitted
// from the edit form"). This appears to be dead code, but it is in-scope for
// this test pass so it is tested standalone.
import { renderWithProviders, screen } from '../../../test-utils';
import StructuresArrayEdit from '../../../Components/editSensorV2/StructuresArrayEdit';

describe('StructuresArrayEdit', () => {
  test('shows "No structures." when there are no items', () => {
    renderWithProviders(<StructuresArrayEdit items={[]} onChange={() => {}} />);
    expect(screen.getByText('No structures.')).toBeInTheDocument();
  });

  test('renders a structure entry with its ID and file location', () => {
    const items = [{ ID: '6XYZ', file_location: '/structures/6xyz.pdb' }];
    renderWithProviders(<StructuresArrayEdit items={items} onChange={() => {}} />);

    expect(screen.getByLabelText('Structure ID')).toHaveValue('6XYZ');
    expect(screen.getByLabelText('File location')).toHaveValue('/structures/6xyz.pdb');
  });

  test('clicking "Add structure" calls onChange with an additional empty structure', async () => {
    const onChange = jest.fn();
    const { user } = renderWithProviders(<StructuresArrayEdit items={[]} onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: /add structure/i }));

    expect(onChange).toHaveBeenCalledWith([{ ID: '', file_location: null }]);
  });

  test('clicking the delete icon removes that structure', async () => {
    const onChange = jest.fn();
    const items = [
      { ID: 'AAA1', file_location: null },
      { ID: 'BBB2', file_location: null },
    ];
    const { user } = renderWithProviders(<StructuresArrayEdit items={items} onChange={onChange} />);

    const deleteButtons = screen.getAllByTestId('DeleteIcon');
    await user.click(deleteButtons[0].closest('button'));

    expect(onChange).toHaveBeenCalledWith([items[1]]);
  });
});
