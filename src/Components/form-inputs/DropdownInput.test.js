import { renderWithProviders, screen } from '../../test-utils';
import DropdownInput from './DropdownInput';
import { useAddSensorStore } from '../../zustand/addSensor.store';

// NOTE (suspected bug): the source builds `labelId={`${label}=label`}` (an
// equals sign) while the InputLabel's own id is `${label}-label` (a hyphen),
// so the Select's aria-labelledby never resolves to the visible label and the
// combobox ends up with no accessible name. We work around that here by
// querying the single combobox on the page rather than by accessible name,
// and document the bug in the test-run report.
describe('DropdownInput', () => {
  afterEach(() => {
    useAddSensorStore.getState().reset();
  });

  test('renders the label and options, and selecting one updates the store', async () => {
    const { user } = renderWithProviders(
      <DropdownInput label="Family" field="about" accessKey="family" arr="familyOptions" />
    );
    expect(screen.getByText('Family', { selector: 'label' })).toBeInTheDocument();

    const combobox = screen.getByRole('combobox');
    await user.click(combobox);
    const option = await screen.findByRole('option', { name: 'LacI' });
    await user.click(option);

    expect(useAddSensorStore.getState().about.family).toBe('LacI');
    expect(screen.getByRole('combobox')).toHaveTextContent('LacI');
  });

  test('shows a required helper text when the store has a matching error', () => {
    useAddSensorStore.getState().addError('about', 'aboutfamily', 'isEmpty');
    renderWithProviders(
      <DropdownInput label="Family" field="about" accessKey="family" arr="familyOptions" />
    );
    expect(screen.getByText('Family is required')).toBeInTheDocument();
  });
});
