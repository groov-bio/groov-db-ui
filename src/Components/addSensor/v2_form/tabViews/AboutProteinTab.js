import { Box, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { FormikTextInput } from '../../../form-inputs/FormikTextInput';
import { FormikSelectInput } from '../../../form-inputs/FormikSelectInput';

const FAMILY_OPTIONS = ['TetR', 'LysR', 'AraC', 'MarR', 'LacI', 'GntR', 'LuxR', 'IclR', 'Other'];
// OmpR/HisKA describe individual proteins within a two-component system, so they
// only appear once the submission has a second protein.
const TWO_COMPONENT_FAMILY_OPTIONS = ['OmpR', 'HisKA'];

export default function AboutProteinTab({ fieldPrefix }) {
  const { values } = useFormikContext();
  const isMultiProtein = (values?.proteins?.length ?? 1) >= 2;
  const familyOptions = isMultiProtein
    ? [...FAMILY_OPTIONS, ...TWO_COMPONENT_FAMILY_OPTIONS]
    : FAMILY_OPTIONS;
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
          label="RefSeq (optional)"
          helperText='NCBI accession, e.g. "WP_000123456.1". Optional — leave blank for engineered/mutant proteins without one (no operon will be resolved).'
        />
      </Box>
      <Box gridColumn="span 12">
        <FormikTextInput
          name={f('uniProtID')}
          label="UniProt ID (optional)"
          helperText='e.g. "P0ACT4". Optional — leave blank if the protein has no UniProt entry (no sequence or structure will be fetched).'
        />
      </Box>
      <Box gridColumn="span 12">
        <FormikSelectInput
          name={f('family')}
          label="Family"
          options={familyOptions}
          helperText="Transcription factor family this protein belongs to."
        />
      </Box>
    </Box>
  );
}
