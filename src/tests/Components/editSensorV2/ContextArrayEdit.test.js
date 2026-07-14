// NOTE: ContextArrayEdit is not imported anywhere else in the app (grep
// confirms no other module references it) -- ProteinEditSection.js explicitly
// omits a Context tab ("Structures and Context are intentionally omitted from
// the edit form: context is determined by genome biology"). This appears to be
// dead code, but it is in-scope for this test pass so it is tested standalone.
import { renderWithProviders, screen } from '../../../test-utils';
import ContextArrayEdit from '../../../Components/editSensorV2/ContextArrayEdit';

describe('ContextArrayEdit', () => {
  test('shows "No context entries." when there are no items', () => {
    renderWithProviders(<ContextArrayEdit items={[]} onChange={() => {}} />);
    expect(screen.getByText('No context entries.')).toBeInTheDocument();
  });

  test('renders a context entry (expanded by default) with its genome, reg index, and operon direction fields', () => {
    const items = [
      {
        reg_index: 1,
        genome: 'E. coli K-12',
        operon_dir: [{ start: 100, stop: 200, direction: '+', link: 'gene1', description: 'desc' }],
      },
    ];
    renderWithProviders(<ContextArrayEdit items={items} onChange={() => {}} />);

    expect(screen.getByText('Context 1 — E. coli K-12')).toBeInTheDocument();
    expect(screen.getByLabelText('Genome')).toHaveValue('E. coli K-12');
    expect(screen.getByLabelText('Reg index')).toHaveValue(1);
    expect(screen.getByLabelText('Start')).toHaveValue(100);
    expect(screen.getByLabelText('Stop')).toHaveValue(200);
    expect(screen.getByLabelText('Direction')).toHaveValue('+');
    expect(screen.getByLabelText('Link')).toHaveValue('gene1');
    expect(screen.getByLabelText('Description')).toHaveValue('desc');
  });

  test('clicking "Add context" calls onChange with an additional empty context entry', async () => {
    const onChange = jest.fn();
    const { user } = renderWithProviders(<ContextArrayEdit items={[]} onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: /add context/i }));

    expect(onChange).toHaveBeenCalledWith([{ reg_index: 0, genome: null, operon_dir: [] }]);
  });
});
