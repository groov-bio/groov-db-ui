import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { FormikTextInput } from '../../form-inputs/FormikTextInput';
import { FormikSelectInput } from '../../form-inputs/FormikSelectInput';

// Single-component transcription factors pick one of the apo/co mechanisms.
const SINGLE_COMPONENT_MECHANISMS = [
  'Apo-repressor',
  'Co-repressor',
  'Apo-activator',
  'Co-activator',
];

// A two-/multi-component system (2+ proteins) always works via signal
// transduction — the apo/co-repressor distinction doesn't apply.
const MULTI_COMPONENT_MECHANISM = 'Signal transduction';

// Structural families that only apply to proteins within a two-component system.
const TWO_COMPONENT_FAMILIES = ['OmpR', 'HisKA'];

export default function SensorMetaTab() {
  const { values, setFieldValue } = useFormikContext();
  const isMultiComponent = (values.proteins?.length ?? 1) >= 2;
  const mechanism = values.sensor?.mechanism;

  // Keep the mechanism consistent with the protein count: lock multi-component
  // sensors to "Signal transduction", and clear it when dropping back to a
  // single protein so the user re-picks a valid single-component mechanism.
  useEffect(() => {
    if (isMultiComponent && mechanism !== MULTI_COMPONENT_MECHANISM) {
      setFieldValue('sensor.mechanism', MULTI_COMPONENT_MECHANISM);
    } else if (!isMultiComponent && mechanism === MULTI_COMPONENT_MECHANISM) {
      setFieldValue('sensor.mechanism', '');
    }
  }, [isMultiComponent, mechanism, setFieldValue]);

  // OmpR/HisKA are only offered for two-component systems. If the user drops back
  // to a single protein, clear any protein still set to one of those families so
  // the now-invalid value doesn't linger (the dropdown hides it at that point).
  useEffect(() => {
    if (isMultiComponent) return;
    (values.proteins ?? []).forEach((protein, i) => {
      if (TWO_COMPONENT_FAMILIES.includes(protein?.family)) {
        setFieldValue(`proteins.${i}.family`, '');
      }
    });
  }, [isMultiComponent, values.proteins, setFieldValue]);

  const mechanismOptions = isMultiComponent
    ? [MULTI_COMPONENT_MECHANISM]
    : SINGLE_COMPONENT_MECHANISMS;

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      rowGap={2}
      sx={{ mx: 3, mt: 3, mb: 3 }}
    >
      <Box gridColumn="span 12">
        <Typography sx={{ fontSize: { xs: 20, md: 24 }, mb: 0 }}>
          Sensor information
        </Typography>
        <Typography variant="caption" color="text.secondary">
          These fields apply to the entire sensor (all proteins below).
        </Typography>
      </Box>
      <Box gridColumn="span 12">
        <FormikSelectInput
          name="sensor.mechanism"
          label="Mechanism"
          options={mechanismOptions}
          disabled={isMultiComponent}
        />
        {isMultiComponent && (
          <Typography variant="caption" color="text.secondary">
            Multi-component sensor (2+ proteins) — mechanism is set to
            “Signal transduction” automatically.
          </Typography>
        )}
      </Box>
      <Box gridColumn="span 12">
        <FormikTextInput
          name="sensor.about"
          label="About this sensor"
          multiline
          rows={4}
          id="v2-sensor-about"
        />
      </Box>
    </Box>
  );
}
