import { Box, Button, Typography } from '@mui/material';
import { FieldArray, useFormikContext } from 'formik';
import _ from 'lodash';
import LigandCard from './cards/LigandCard';
import { createEmptyLigand } from '../../../../lib/constants/v2_form/initialValues';

export default function LigandTab({ fieldPrefix }) {
  const { values } = useFormikContext();
  const ligands = _.get(values, `${fieldPrefix}.ligands`, []);

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      rowGap={1}
      sx={{ height: '100%', mx: 3, mt: 3 }}
    >
      <Box gridColumn="span 12" display="flex">
        <Typography sx={{ fontSize: { xs: 22, md: 26 }, mb: 1 }}>
          Ligand-binding information
        </Typography>
      </Box>
      <FieldArray name={`${fieldPrefix}.ligands`}>
        {({ push }) => (
          <>
            {ligands.map((_item, index) => (
              <LigandCard index={index} key={index} fieldPrefix={fieldPrefix} />
            ))}
            <Box gridColumn="span 12" mt={1}>
              <Button onClick={() => push(createEmptyLigand())} variant="outlined">
                + Add another ligand
              </Button>
            </Box>
          </>
        )}
      </FieldArray>
    </Box>
  );
}
