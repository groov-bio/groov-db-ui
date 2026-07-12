import { renderWithProviders, screen, waitFor } from '../../../test-utils';
import AddSensor from '../../../Components/addSensor/AddSensor';
import useFeatureFlagsStore from '../../../zustand/featureFlags.store';
import useUserStore from '../../../zustand/user.store';

// AddSensor.js picks its form (v1 Formik-driven vs. v2 multi-protein) based on
// the `v2_add_sensor_form` feature flag read from this real (non-mocked)
// zustand store. The store's default state (flags: {}) makes every flag
// resolve to its `defaultValue` (false), so with no setup at all the v1 form
// renders — that's what most of these tests exercise. A couple of tests flip
// the flags on to exercise the v2 branch.
const resetStores = () => {
  useFeatureFlagsStore.setState({ flags: {}, loading: false, error: null });
  useUserStore.setState({ user: null });
};

beforeEach(() => {
  resetStores();
});

afterEach(() => {
  resetStores();
});

describe('AddSensor — v1 form (feature flags off, the default)', () => {
  test('renders the About step by default with the stepper and About fields', () => {
    const { container } = renderWithProviders(<AddSensor />);
    expect(screen.getByText('Basic information:')).toBeInTheDocument();
    // Scoped to the MUI step label class: the plain text "About" is ambiguous
    // because the About tab also has a field labeled "About" (the free-text
    // description textarea).
    expect(screen.getByText('About', { selector: '.MuiStepLabel-label' })).toBeInTheDocument();
    expect(screen.getByText('Ligands')).toBeInTheDocument();
    expect(screen.getByText('Operators')).toBeInTheDocument();
    expect(container.querySelector('#new-sensor-about-alias')).toBeInTheDocument();
  });

  test('typing into the Alias field updates its displayed value', async () => {
    const { user, container } = renderWithProviders(<AddSensor />);
    const alias = container.querySelector('#new-sensor-about-alias');
    await user.type(alias, 'TetR1');
    expect(alias).toHaveValue('TetR1');
  });

  test('clicking Next moves About -> Ligands -> Operators, unmounting the prior step', async () => {
    const { user } = renderWithProviders(<AddSensor />);
    expect(screen.getByText('Basic information:')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(await screen.findByText('Ligand-binding information:')).toBeInTheDocument();
    expect(screen.queryByText('Basic information:')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(await screen.findByText('DNA-binding information:')).toBeInTheDocument();
    expect(screen.queryByText('Ligand-binding information:')).not.toBeInTheDocument();

    // Operators is the last step: the footer now shows Submit instead of Next.
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  test('submitting the form empty marks all three steps "Missing data" and shows "Alias is required" on the About step', async () => {
    const { user, container } = renderWithProviders(<AddSensor />);

    // Navigate to the last step to reach the Submit button.
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await user.click(screen.getByRole('button', { name: 'Next' }));
    const submitButton = await screen.findByRole('button', { name: 'Submit' });
    expect(submitButton).toHaveAttribute('id', 'add-new-sensor-submit');

    await user.click(submitButton);

    // The at-least-one-complete-entry error marks Ligands and Operators, and
    // the required About fields mark About — all three steps light up.
    await waitFor(() => {
      expect(screen.getAllByText('Missing data')).toHaveLength(3);
    });
    expect(
      screen.getByText('At least one complete ligand or operator is required')
    ).toBeInTheDocument();

    // Navigate back to the About step (unmounted while on Operators) to see
    // the field-level helper text.
    await user.click(screen.getByText('About'));
    expect(await screen.findByText('Basic information:')).toBeInTheDocument();

    const aliasHelperText = container.querySelector(
      '#new-sensor-about-alias-helper-text'
    );
    expect(aliasHelperText).toHaveTextContent('Alias is required');
  });
});

describe('AddSensor — v2 form (v2_add_sensor_form flag on)', () => {
  const enableV2Form = (v2ApiOn = false) => {
    useFeatureFlagsStore.getState().setFlags({
      v2_add_sensor_form: { local: true, prod: true },
      v2_api: { local: v2ApiOn, prod: v2ApiOn },
    });
  };

  test('renders the sensor-level meta tab and protein tabs instead of the v1 stepper', () => {
    enableV2Form();
    renderWithProviders(<AddSensor />);
    expect(screen.getByText('Sensor information')).toBeInTheDocument();
    // Single protein: ProteinTabs shows the "Add second protein" affordance.
    expect(
      screen.getByRole('button', { name: /Add second protein/i })
    ).toBeInTheDocument();
    // The first protein's own About step is shown by default.
    expect(screen.getByText('Protein information')).toBeInTheDocument();
    expect(screen.queryByText('Basic information:')).not.toBeInTheDocument();
  });

  test('shows a preview-mode warning alert when v2_api is off, and hides it when v2_api is on', () => {
    enableV2Form(false);
    const { rerender } = renderWithProviders(<AddSensor />);
    expect(
      screen.getByText(/Preview mode — the v2 form is enabled/)
    ).toBeInTheDocument();

    enableV2Form(true);
    rerender(<AddSensor />);
    expect(
      screen.queryByText(/Preview mode — the v2 form is enabled/)
    ).not.toBeInTheDocument();
  });

  test('clicking "Add second protein" adds a second protein tab', async () => {
    enableV2Form();
    const { user } = renderWithProviders(<AddSensor />);
    await user.click(screen.getByRole('button', { name: /Add second protein/i }));
    expect(await screen.findByText('Protein 2')).toBeInTheDocument();
  });
});
