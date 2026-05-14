import { Box, Typography } from '@mui/material';
import { FormikTextInput } from '../../../form-inputs/FormikTextInput';
import { FormikSelectInput } from '../../../form-inputs/FormikSelectInput';

const FAMILY_OPTIONS = ['TetR', 'LysR', 'AraC', 'MarR', 'LacI', 'GntR', 'LuxR', 'IclR', 'Other'];

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
        <FormikTextInput
          name={f('alias')}
          label="Alias"
          helperText="Short identifier shown in the database (letters/digits, max 16)."
        />
      </Box>
      <Box gridColumn="span 12">
        <FormikTextInput
          name={f('accession')}
          label="RefSeq"
          helperText='NCBI accession, e.g. "WP_000123456.1".'
        />
      </Box>
      <Box gridColumn="span 12">
        <FormikTextInput
          name={f('uniProtID')}
          label="UniProt ID"
          helperText='e.g. "P0ACT4".'
        />
      </Box>
      <Box gridColumn="span 12">
        <FormikSelectInput
          name={f('family')}
          label="Family"
          options={FAMILY_OPTIONS}
          helperText="Transcription factor family this protein belongs to."
        />
      </Box>
    </Box>
  );
}
