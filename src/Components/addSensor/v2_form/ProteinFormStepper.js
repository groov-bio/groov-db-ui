import { Step, Stepper, StepLabel, Typography } from '@mui/material';

const STEPS = ['About', 'Ligands', 'Operators', 'Extras'];

export default function ProteinFormStepper({ stepValue, setStepValue, proteinErrors }) {
  const errorAt = (step) => {
    if (step === 'About') {
      return ['alias', 'accession', 'uniProtID', 'mechanism'].some(
        (k) => proteinErrors?.[k]
      );
    }
    if (step === 'Ligands') return proteinErrors?.form || proteinErrors?.ligands;
    if (step === 'Operators') return proteinErrors?.form || proteinErrors?.operators;
    if (step === 'Extras') {
      return (
        proteinErrors?.light_stimuli ||
        proteinErrors?.temperature_stimuli ||
        proteinErrors?.mutations
      );
    }
    return false;
  };

  return (
    <Stepper nonLinear activeStep={stepValue} alternativeLabel>
      {STEPS.map((item, index) => {
        const labelProps = {};
        if (errorAt(item)) {
          labelProps.optional = (
            <Typography variant="caption" color="error" sx={{ width: '100%', textAlign: 'center' }}>
              Missing data
            </Typography>
          );
          labelProps.error = true;
        }
        return (
          <Step key={item}>
            <StepLabel
              onClick={() => setStepValue(index)}
              disableRipple
              sx={{
                cursor: 'pointer',
                '& .MuiStepLabel-labelContainer': {
                  width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center',
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
