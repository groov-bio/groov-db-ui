import { Box, Typography, Paper } from '@mui/material';

export default function StimulusTab({ fieldPrefix = '' }) {
  const getFieldName = (field) => {
    return fieldPrefix ? `${fieldPrefix}.stimulus.${field}` : `stimulus.${field}`;
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Paper elevation={1} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Stimulus Conditions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Placeholder for stimulus-related fields (temperature, pH, concentration, etc.)
        </Typography>
        {/* Add future fields here such as temperature, ph, etc. */}
      </Paper>
    </Box>
  );
}
