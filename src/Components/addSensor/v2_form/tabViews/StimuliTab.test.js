import { Formik, Form } from 'formik';
import { renderWithProviders, screen, within } from '../../../../test-utils';
import StimuliTab from './StimuliTab';

const ligand = (overrides = {}) => ({
  name: '',
  SMILES: '',
  doi: '',
  ref_figure: '',
  fig_type: '',
  method: '',
  regulatory_effect: '',
  kd: '',
  kd_unit: 'nM',
  ...overrides,
});

function Harness({
  ligands = [],
  light_stimuli = [],
  temperature_stimuli = [],
  toggles = { ligands: true, operators: true, light: false, temperature: false },
}) {
  return (
    <Formik
      initialValues={{
        proteins: [{ ligands, light_stimuli, temperature_stimuli, toggles }],
      }}
      onSubmit={() => {}}
    >
      <Form>
        <StimuliTab fieldPrefix="proteins[0]" />
      </Form>
    </Formik>
  );
}

function getStimulusTypeSelect() {
  const label = screen.getByText('Stimulus type', { selector: 'label' });
  const control = label.closest('.MuiFormControl-root');
  return within(control).getByRole('combobox');
}

describe('StimuliTab', () => {
  test('defaults to the "Ligand" stimulus type and shows a LigandCard when there is no existing stimulus data', () => {
    renderWithProviders(<Harness ligands={[ligand({ name: 'IPTG' })]} />);
    expect(screen.getByText('Stimulus')).toBeInTheDocument();
    expect(getStimulusTypeSelect()).toHaveTextContent('Ligand');
    expect(
      screen.getByRole('checkbox', { name: 'This protein has a ligand' })
    ).toBeChecked();
    expect(screen.getByText('Ligand #1')).toBeInTheDocument();
    expect(screen.getByLabelText('Ligand Name')).toHaveValue('IPTG');
  });

  test('defaults to "Light" when light_stimuli already has entries', () => {
    renderWithProviders(
      <Harness
        ligands={[]}
        light_stimuli={[{ wavelength: 450 }]}
        toggles={{ ligands: false, light: true }}
      />
    );
    expect(getStimulusTypeSelect()).toHaveTextContent('Light');
  });

  test('defaults to "Temperature" when only temperature_stimuli has entries', () => {
    renderWithProviders(
      <Harness
        ligands={[]}
        temperature_stimuli={[{ temperature: 37 }]}
        toggles={{ ligands: false, temperature: true }}
      />
    );
    expect(getStimulusTypeSelect()).toHaveTextContent('Temperature');
  });

  test('switching the stimulus type to Light shows the light toggle/label, off by default per toggles.light', async () => {
    const { user } = renderWithProviders(<Harness ligands={[ligand()]} />);
    await user.click(getStimulusTypeSelect());
    await user.click(await screen.findByRole('option', { name: 'Light' }));

    expect(
      screen.getByRole('checkbox', { name: 'This protein has a light stimulus' })
    ).not.toBeChecked();
    expect(screen.queryByText(/^Light #/)).not.toBeInTheDocument();
  });

  test('toggling the Light switch on adds one empty light stimulus card', async () => {
    const { user } = renderWithProviders(<Harness ligands={[ligand()]} />);
    await user.click(getStimulusTypeSelect());
    await user.click(await screen.findByRole('option', { name: 'Light' }));

    const toggle = screen.getByRole('checkbox', {
      name: 'This protein has a light stimulus',
    });
    await user.click(toggle);

    expect(await screen.findByText('Light #1')).toBeInTheDocument();
    expect(screen.getByLabelText('Wavelength (nm)')).toBeInTheDocument();
  });

  test('the stimulus-type dropdown shows a count when an array has more than one entry', async () => {
    const { user } = renderWithProviders(
      <Harness ligands={[ligand({ name: 'A' }), ligand({ name: 'B' })]} />
    );
    await user.click(getStimulusTypeSelect());
    expect(await screen.findByRole('option', { name: 'Ligand (2)' })).toBeInTheDocument();
  });

  test('"+ Add another ligand" appends a second LigandCard', async () => {
    const { user } = renderWithProviders(<Harness ligands={[ligand({ name: 'A' })]} />);
    await user.click(screen.getByRole('button', { name: '+ Add another ligand' }));
    expect(await screen.findByText('Ligand #2')).toBeInTheDocument();
  });
});
