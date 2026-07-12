import { renderWithProviders, screen } from '../../../test-utils';
import StimulusTab from './StimulusTab';

// StimulusTab is not wired into AddSensor.js's tab flow (it isn't imported by
// AddSensor.js or ProteinForm.js — grep confirms no callers outside this file
// and its own module). It appears to be an unused placeholder for a future
// "stimulus conditions" step. It needs no Formik context since it renders no
// form fields yet, only static copy.
describe('StimulusTab (unused placeholder component)', () => {
  test('renders its static placeholder heading and description', () => {
    renderWithProviders(<StimulusTab />);
    expect(screen.getByText('Stimulus Conditions')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Placeholder for stimulus-related fields (temperature, pH, concentration, etc.)'
      )
    ).toBeInTheDocument();
  });

  test('renders the same placeholder content regardless of fieldPrefix (no fields depend on it yet)', () => {
    renderWithProviders(<StimulusTab fieldPrefix="proteins[0]" />);
    expect(screen.getByText('Stimulus Conditions')).toBeInTheDocument();
  });
});
