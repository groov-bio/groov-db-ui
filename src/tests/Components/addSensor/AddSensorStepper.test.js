import { renderWithProviders, screen } from '../../../test-utils';
import AddSensorStepper from '../../../Components/addSensor/AddSensorStepper';

describe('AddSensorStepper', () => {
  test('renders the three step labels', () => {
    renderWithProviders(
      <AddSensorStepper stepValue={0} setStepValue={() => {}} formikErrors={{}} />
    );
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Ligands')).toBeInTheDocument();
    expect(screen.getByText('Operators')).toBeInTheDocument();
    expect(screen.queryByText('Missing data')).not.toBeInTheDocument();
  });

  test('clicking a step label calls setStepValue with that step index', async () => {
    const setStepValue = jest.fn();
    const { user } = renderWithProviders(
      <AddSensorStepper stepValue={0} setStepValue={setStepValue} formikErrors={{}} />
    );
    await user.click(screen.getByText('Ligands'));
    expect(setStepValue).toHaveBeenCalledWith(1);

    await user.click(screen.getByText('Operators'));
    expect(setStepValue).toHaveBeenCalledWith(2);
  });

  test('shows "Missing data" under About when formikErrors.about is set', () => {
    renderWithProviders(
      <AddSensorStepper
        stepValue={0}
        setStepValue={() => {}}
        formikErrors={{ about: { alias: 'Alias is required' } }}
      />
    );
    expect(screen.getByText('Missing data')).toBeInTheDocument();
  });

  test('shows "Missing data" under Ligands and Operators when formikErrors.form is set (the at-least-one-complete-entry error)', () => {
    renderWithProviders(
      <AddSensorStepper
        stepValue={0}
        setStepValue={() => {}}
        formikErrors={{
          form: 'At least one complete ligand or operator is required',
        }}
      />
    );
    // Both Ligands and Operators steps key off formikErrors.form
    expect(screen.getAllByText('Missing data')).toHaveLength(2);
  });

  test('does not mark Ligands/Operators when only formikErrors.about is present', () => {
    renderWithProviders(
      <AddSensorStepper
        stepValue={0}
        setStepValue={() => {}}
        formikErrors={{ about: { alias: 'Alias is required' } }}
      />
    );
    expect(screen.getAllByText('Missing data')).toHaveLength(1);
  });
});
