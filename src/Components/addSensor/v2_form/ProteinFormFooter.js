import { Box, Button, CircularProgress } from '@mui/material';
import { useFormikContext } from 'formik';

const LAST_STEP = 3;

export default function ProteinFormFooter({ stepValue, setStepValue }) {
  const { submitForm, isSubmitting } = useFormikContext();
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mx: { xs: 1, sm: 10 },
        mt: 2,
        py: 1,
        // Pin to the bottom of the viewport on mobile so Submit/Next stay reachable
        // while the user scrolls a long card list.
        position: { xs: 'sticky', sm: 'static' },
        bottom: { xs: 0, sm: 'auto' },
        background: { xs: 'rgba(255,255,255,0.95)', sm: 'transparent' },
        borderTop: { xs: '1px solid', sm: 'none' },
        borderColor: 'divider',
        zIndex: 3,
      }}
    >
      <Button
        onClick={() => stepValue !== 0 && setStepValue(stepValue - 1)}
        disabled={stepValue === 0 || isSubmitting}
      >
        Previous
      </Button>

      {stepValue !== LAST_STEP ? (
        <Button variant="outlined" onClick={() => setStepValue(stepValue + 1)}>
          Next
        </Button>
      ) : (
        <Button
          variant="contained"
          onClick={submitForm}
          id="add-new-sensor-submit"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {isSubmitting ? 'Submitting…' : 'Submit'}
        </Button>
      )}
    </Box>
  );
}
