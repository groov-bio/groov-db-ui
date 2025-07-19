import {
  Step,
  Stepper,
  StepButton,
  Typography,
  StepLabel,
} from '@mui/material';

const steps = ['About', 'Ligands', 'Operators'];

export default function AddSensorStepper({
  stepValue,
  setStepValue,
  formikErrors,
}) {
  const handleStepChange = (step) => {
    setStepValue(step);
  };

  const determineButtonColor = (step) => {
    if (step === 'About' && formikErrors?.about) {
      return true;
    } else if (
      step === 'Ligands' &&
      (formikErrors?.form || formikErrors?.ligands)
    ) {
      return true;
    } else if (
      step === 'Operators' &&
      (formikErrors?.form || formikErrors?.operators)
    ) {
      return true;
    }
    return false;
  };

  return (
    <Stepper nonLinear activeStep={stepValue} alternativeLabel>
      {steps.map((item, index) => {
        const labelProps = {};
        if (determineButtonColor(item)) {
          labelProps.optional = (
            <Typography
              variant="caption"
              color="error"
              sx={{
                width: '100%',
                textAlign: 'center',
              }}
            >
              Missing data
            </Typography>
          );
          labelProps.error = true;
        }
        return (
          <Step key={item}>
            <StepLabel
              color={'#8B0000'}
              onClick={() => {
                handleStepChange(index);
              }}
              disableRipple
              sx={{
                cursor: 'pointer',
                '& .MuiStepLabel-labelContainer': {
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                },
              }}
              {...labelProps}
            >
              {item}
            </StepLabel>
          </Step>
        );
      })}
    </Stepper>
  );
}
