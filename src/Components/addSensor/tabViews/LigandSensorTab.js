import { Box, Typography } from '@mui/material';
import LigandCard from './cards/LigandCard';

import { useFormikContext } from 'formik';

export default function LigandSensorTab() {
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
          Ligand-binding information:
        </Typography>
      </Box>
      {values.ligands.map((item, index) => (
        <LigandCard index={index} key={index} />
      ))}
    </Box>
  );
}
