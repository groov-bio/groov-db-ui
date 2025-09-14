import { Grid, Typography } from '@mui/material';
import useSearchStore from '../zustand/search.store.js';

export default function Stats() {
  // Fetch stats from zustand store
  const { regulators, ligands } = useSearchStore((state) => ({
    regulators: state.stats.regulators,
    ligands: state.stats.ligands,
  }));

  return (
    <Grid
      sx={{
        borderRadius: 1,
        padding: 1.5,
        position: 'absolute',
        left: '20px',
        bottom: '20px',
      }}
    >
      <Typography sx={{ fontSize: { xs: 14, sm: 22 } }} id="regulators-count">
        Regulators: {regulators}
      </Typography>
      <Typography sx={{ fontSize: { xs: 14, sm: 22 } }} id="ligands-count">
        Unique ligands: {ligands}
      </Typography>
    </Grid>
  );
}
