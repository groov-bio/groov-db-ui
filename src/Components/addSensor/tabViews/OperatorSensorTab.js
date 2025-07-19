import { Box, Typography } from '@mui/material';
import OperatorCard from './cards/OperatorCard';

import { useFormikContext } from 'formik';

export default function OperatorSensorTab() {
  const { values } = useFormikContext();

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      gridTemplateRows="auto"
      gridAutoRows="auto"
      rowGap={1}
      sx={{ height: '100%', mx: 3, mt: 3 }}
    >
      <Box gridColumn={'span 12'} display="flex">
        <Typography
          sx={{ fontSize: { xs: 22, md: 26 }, mb: 1, display: 'flex' }}
        >
          DNA-binding information:
        </Typography>
      </Box>
      {values.operators.map((item, index) => (
        <OperatorCard index={index} key={index} />
      ))}
    </Box>
  );
}
