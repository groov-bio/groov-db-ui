import { Box, Typography } from '@mui/material';
import { FormikTextInput } from '../../form-inputs/FormikTextInput';
import { FormikSelectInput } from '../../form-inputs/FormikSelectInput';

const categoryOptions = [
  'TetR', 'LysR', 'AraC', 'MarR', 'LacI', 'GntR', 'LuxR', 'IclR', 'Other',
];

export default function SensorMetaTab() {
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
          name="sensor.category"
          label="Category"
          options={categoryOptions}
        />
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
