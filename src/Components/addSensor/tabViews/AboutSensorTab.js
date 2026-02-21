import { Box, Typography } from '@mui/material';
import { FormikTextInput } from '../../form-inputs/FormikTextInput';
import { FormikSelectInput } from '../../form-inputs/FormikSelectInput';

export default function AboutSensorTab({ fieldPrefix = '' }) {
  const familyOptions = [
    'TetR',
    'LysR',
    'AraC',
    'MarR',
    'LacI',
    'GntR',
    'LuxR',
    'IclR',
    'Other',
  ];

  const mechanisms = [
    'Apo-repressor',
    'Co-repressor',
    'Apo-activator',
    'Co-activator',
  ];

  const getFieldName = (field) => {
    return fieldPrefix ? `${fieldPrefix}.${field}` : field;
  };

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      gridTemplateRows="auto"
      gridAutoRows="auto"
      rowGap={2}
      sx={{ height: '100%', mx: 3, mt: 3 }}
    >
      <Box gridColumn={'span 12'}>
        <Typography sx={{ fontSize: { xs: 22, md: 26 }, mb: 0 }} id="new-sensor-basic-info">
          Basic information:
        </Typography>
      </Box>

      <Box gridColumn={'span 12'}>
        <FormikTextInput name={getFieldName('about.alias')} label="Alias" id="new-sensor-about-alias"/>
      </Box>

      <Box gridColumn={'span 12'}>
        <FormikTextInput name={getFieldName('about.accession')} label="RefSeq" id="new-sensor-about-accession"/>
      </Box>

      <Box gridColumn={'span 12'}>
        <FormikTextInput name={getFieldName('about.uniProtID')} label="UniProt ID" id="new-sensor-about-uniprot"/>
      </Box>

      <Box gridColumn={'span 12'}>
        <FormikSelectInput
          name={getFieldName('about.family')}
          label="Structural Family"
          options={familyOptions}
        />
      </Box>

      <Box gridColumn={'span 12'}>
        <FormikSelectInput
          name={getFieldName('about.mechanism')}
          label="Mechanism"
          options={mechanisms}
        />
      </Box>

      <Box gridColumn={'span 12'}>
        <FormikTextInput name={getFieldName('about.about')} label="About" multiline rows={6} id="new-sensor-about-about"/>
      </Box>
    </Box>
  );
}
