import { Box, Typography } from '@mui/material';
import OperatorCard from './cards/OperatorCard';

import { useFormikContext } from 'formik';
import _ from 'lodash';

export default function OperatorSensorTab({ fieldPrefix = '' }) {
  const { values } = useFormikContext();

  const operators = fieldPrefix
    ? _.get(values, `${fieldPrefix}.operators`, [])
    : values.operators;

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
      {operators.map((item, index) => (
        <OperatorCard index={index} key={index} fieldPrefix={fieldPrefix} />
      ))}
    </Box>
  );
}
