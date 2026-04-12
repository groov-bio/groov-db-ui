import { Box, Typography } from '@mui/material';
import LigandCard from './cards/LigandCard';

import { useFormikContext } from 'formik';
import _ from 'lodash';

export default function LigandSensorTab({ fieldPrefix = '' }) {
  const { values } = useFormikContext();

  const ligands = fieldPrefix
    ? _.get(values, `${fieldPrefix}.ligands`, [])
    : values.ligands;

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
          Ligand-binding information:
        </Typography>
      </Box>
      {ligands.map((item, index) => (
        <LigandCard index={index} key={index} fieldPrefix={fieldPrefix} />
      ))}
    </Box>
  );
}
