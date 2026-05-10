import { Box, Typography } from '@mui/material';
import { FormikTextInput } from '../../../form-inputs/FormikTextInput';
import { FormikSelectInput } from '../../../form-inputs/FormikSelectInput';

const mechanisms = [
  'Apo-repressor',
  'Co-repressor',
  'Apo-activator',
  'Co-activator',
];

export default function AboutProteinTab({ fieldPrefix }) {
  const f = (name) => `${fieldPrefix}.${name}`;
  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      rowGap={2}
      sx={{ height: '100%', mx: 3, mt: 3 }}
    >
      <Box gridColumn="span 12">
        <Typography sx={{ fontSize: { xs: 22, md: 26 } }}>
          Protein information
        </Typography>
      </Box>
      <Box gridColumn="span 12">
        <FormikTextInput name={f('alias')} label="Alias" />
      </Box>
      <Box gridColumn="span 12">
        <FormikTextInput name={f('accession')} label="RefSeq" />
      </Box>
      <Box gridColumn="span 12">
        <FormikTextInput name={f('uniProtID')} label="UniProt ID" />
      </Box>
      <Box gridColumn="span 12">
        <FormikSelectInput
          name={f('mechanism')}
          label="Mechanism (optional)"
          options={mechanisms}
        />
      </Box>
    </Box>
  );
}
