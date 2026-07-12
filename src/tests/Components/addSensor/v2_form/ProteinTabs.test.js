import { Formik, Form } from 'formik';
import { renderWithProviders, screen } from '../../../../test-utils';
import ProteinTabs from '../../../../Components/addSensor/v2_form/ProteinTabs';

function Harness({
  proteins,
  currentProteinIndex = 0,
  onProteinChange = () => {},
  onAddProtein = () => {},
  onRemoveProtein = () => {},
  errors = [],
}) {
  return (
    <Formik initialValues={{}} onSubmit={() => {}}>
      <Form>
        <ProteinTabs
          proteins={proteins}
          currentProteinIndex={currentProteinIndex}
          onProteinChange={onProteinChange}
          onAddProtein={onAddProtein}
          onRemoveProtein={onRemoveProtein}
          errors={errors}
        />
        <button type="submit">TriggerSubmit</button>
      </Form>
    </Formik>
  );
}

describe('ProteinTabs', () => {
  test('labels each tab with the protein alias, or "Protein N" when alias is blank', () => {
    renderWithProviders(
      <Harness
        proteins={[
          { id: '1', alias: 'TetR' },
          { id: '2', alias: '' },
        ]}
      />
    );
    expect(screen.getByText('TetR')).toBeInTheDocument();
    expect(screen.getByText('Protein 2')).toBeInTheDocument();
  });

  test('shows "Add second protein" with a single protein, and "Add protein" with 2+', () => {
    const { rerender } = renderWithProviders(
      <Harness proteins={[{ id: '1', alias: '' }]} />
    );
    expect(
      screen.getByRole('button', { name: /Add second protein/i })
    ).toBeInTheDocument();

    rerender(
      <Harness
        proteins={[
          { id: '1', alias: '' },
          { id: '2', alias: '' },
        ]}
      />
    );
    expect(screen.getByRole('button', { name: /Add protein/i })).toBeInTheDocument();
  });

  test('clicking Add protein calls onAddProtein', async () => {
    const onAddProtein = jest.fn();
    const { user } = renderWithProviders(
      <Harness proteins={[{ id: '1', alias: '' }]} onAddProtein={onAddProtein} />
    );
    await user.click(screen.getByRole('button', { name: /Add second protein/i }));
    expect(onAddProtein).toHaveBeenCalledTimes(1);
  });

  test('clicking a protein tab calls onProteinChange with its index', async () => {
    const onProteinChange = jest.fn();
    const { user } = renderWithProviders(
      <Harness
        proteins={[
          { id: '1', alias: 'First' },
          { id: '2', alias: 'Second' },
        ]}
        onProteinChange={onProteinChange}
      />
    );
    await user.click(screen.getByText('Second'));
    expect(onProteinChange).toHaveBeenCalledWith(1);
  });

  test('the close icon only appears when there is more than one protein, and clicking it calls onRemoveProtein', async () => {
    const onRemoveProtein = jest.fn();
    renderWithProviders(<Harness proteins={[{ id: '1', alias: 'Solo' }]} />);
    expect(screen.queryByTestId('CloseIcon')).not.toBeInTheDocument();

    const { user } = renderWithProviders(
      <Harness
        proteins={[
          { id: '1', alias: 'First' },
          { id: '2', alias: 'Second' },
        ]}
        onRemoveProtein={onRemoveProtein}
      />
    );
    const closeIcons = screen.getAllByTestId('CloseIcon');
    expect(closeIcons.length).toBe(2);
    await user.click(closeIcons[0].closest('button'));
    expect(onRemoveProtein).toHaveBeenCalledWith(0);
  });

  test('shows a warning icon on a protein tab that has errors, only after a submit attempt', async () => {
    const { user } = renderWithProviders(
      <Harness
        proteins={[{ id: '1', alias: 'Broken' }]}
        errors={[{ alias: 'Alias is required' }]}
      />
    );
    expect(screen.queryByTestId('WarningAmberIcon')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'TriggerSubmit' }));
    expect(await screen.findByTestId('WarningAmberIcon')).toBeInTheDocument();
  });
});
