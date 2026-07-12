import { Formik, Form } from 'formik';
import { renderWithProviders, screen } from '../../../../../../test-utils';
import StimulusCard from '../../../../../../Components/addSensor/v2_form/tabViews/cards/StimulusCard';

// StimulusCard is NOT wrapped in a FieldArray itself — the parent owns the
// array and passes an `onRemove(index)` callback plus an `arrayName` string
// that FormikTextInput/FormikSelectInput use to build their field names.
// Unlike the other cards, the delete IconButton here has no `index !== 0`
// guard, so it is rendered (and wired to onRemove) even for the first entry.
function Harness({ index = 0, onRemove, value = {} }) {
  return (
    <Formik
      initialValues={{
        stimuli: [
          {
            lightIntensity: '',
            regulatory_effect: '',
            doi: '',
            fig_type: '',
            ref_figure: '',
            method: '',
            ...value,
          },
        ],
      }}
      onSubmit={() => {}}
    >
      <Form>
        <StimulusCard
          arrayName="stimuli"
          index={index}
          label="Light"
          valueFieldName="lightIntensity"
          valueLabel="Light Intensity"
          onRemove={onRemove}
        />
      </Form>
    </Formik>
  );
}

describe('StimulusCard (v2_form)', () => {
  test('renders the given label/index heading and the value field with its data', () => {
    renderWithProviders(
      <Harness value={{ lightIntensity: '450', doi: '10.1000/xyz' }} onRemove={() => {}} />
    );
    expect(screen.getByText('Light #1')).toBeInTheDocument();
    expect(screen.getByLabelText('Light Intensity')).toHaveValue(450);
    expect(screen.getByLabelText('DOI')).toHaveValue('10.1000/xyz');
  });

  test('clicking the delete button calls onRemove with the card index, even at index 0', async () => {
    const onRemove = jest.fn();
    const { user } = renderWithProviders(<Harness index={0} onRemove={onRemove} />);

    await user.click(screen.getByTestId('DeleteForeverIcon').closest('button'));

    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onRemove).toHaveBeenCalledWith(0);
  });

  test('clicking the delete button for a later index calls onRemove with that index', async () => {
    const onRemove = jest.fn();
    const { user } = renderWithProviders(<Harness index={2} onRemove={onRemove} />);

    expect(screen.getByText('Light #3')).toBeInTheDocument();
    await user.click(screen.getByTestId('DeleteForeverIcon').closest('button'));

    expect(onRemove).toHaveBeenCalledWith(2);
  });
});
