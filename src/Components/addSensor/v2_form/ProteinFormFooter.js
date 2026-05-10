import { Box, Button } from '@mui/material';
import { useFormikContext } from 'formik';

const LAST_STEP = 3;

export default function ProteinFormFooter({ stepValue, setStepValue }) {
  const { submitForm, isSubmitting } = useFormikContext();
  return (
    <Box display="flex" sx={{ justifyContent: 'space-between', mx: { xs: 1, sm: 10 }, mt: 2 }}>
      <Button
        onClick={() => stepValue !== 0 && setStepValue(stepValue - 1)}
        disabled={stepValue === 0}
      >
        Previous
      </Button>

      {stepValue !== LAST_STEP ? (
        <Button onClick={() => setStepValue(stepValue + 1)}>Next</Button>
      ) : (
        <Button onClick={submitForm} id="add-new-sensor-submit" disabled={isSubmitting}>
          Submit
        </Button>
      )}
    </Box>
  );
}
