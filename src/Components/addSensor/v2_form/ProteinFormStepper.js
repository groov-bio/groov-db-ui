import { Step, Stepper, StepLabel, Typography } from '@mui/material';

const STEPS = ['About', 'Stimuli', 'Operators', 'Mutations'];

export default function ProteinFormStepper({ stepValue, setStepValue, proteinErrors }) {
  const errorAt = (step) => {
    if (step === 'About') {
      return ['alias', 'accession', 'uniProtID', 'mechanism'].some(
        (k) => proteinErrors?.[k]
      );
    }
    if (step === 'Stimuli') {
      return (
        proteinErrors?.ligands ||
        proteinErrors?.light_stimuli ||
        proteinErrors?.temperature_stimuli
      );
    }
    if (step === 'Operators') return proteinErrors?.operators;
    if (step === 'Mutations') return proteinErrors?.mutations;
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
