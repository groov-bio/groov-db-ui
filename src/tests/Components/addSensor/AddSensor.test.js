import { renderWithProviders, screen } from '../../../test-utils';
import AddSensor from '../../../Components/addSensor/AddSensor';

// AddSensor now renders the v2 multi-protein form unconditionally: the v1
// stepper form was archived and the feature-flag gating that used to choose
// between them was removed.
describe('AddSensor (v2 multi-protein form)', () => {
  test('renders the sensor-level meta tab and the first protein form', () => {
    renderWithProviders(<AddSensor />);
    expect(screen.getByText('Sensor information')).toBeInTheDocument();
    expect(screen.getByText('Protein information')).toBeInTheDocument();
    // Single protein by default: ProteinTabs offers to add a second one, and
    // the archived v1 stepper's "Basic information:" heading is gone.
    expect(
      screen.getByRole('button', { name: /Add second protein/i })
    ).toBeInTheDocument();
    expect(screen.queryByText('Basic information:')).not.toBeInTheDocument();
  });

  test('clicking "Add second protein" adds a second protein tab', async () => {
    const { user } = renderWithProviders(<AddSensor />);
    await user.click(
      screen.getByRole('button', { name: /Add second protein/i })
    );
    expect(await screen.findByText('Protein 2')).toBeInTheDocument();
  });
});
