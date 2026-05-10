import {
  Box, Button, Typography, IconButton, Collapse, ListItemButton, ListItemText,
  FormControl,
} from '@mui/material';
import { DeleteForever } from '@mui/icons-material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import { FieldArray, useFormikContext } from 'formik';
import _ from 'lodash';
import { FormikTextInput } from '../../../form-inputs/FormikTextInput';
import { FormikSelectInput } from '../../../form-inputs/FormikSelectInput';
import {
  createEmptyLightStimulus,
  createEmptyTemperatureStimulus,
} from '../../../../lib/constants/v2_form/initialValues';

const figureTypes = ['Figure', 'Supplementary Figure', 'Table', 'Supplementary Table'];

function StimulusEvidenceFields({ f }) {
  return (
    <>
      <Box mb={2}><FormikTextInput name={f('regulatory_effect')} label="Regulatory effect (optional)" placeholder="e.g. activates" /></Box>
      <Box mb={2}><FormikTextInput name={f('doi')} label="DOI (optional)" /></Box>
      <Box display="flex" mb={2}>
        <FormControl fullWidth sx={{ mr: 2 }}>
          <FormikSelectInput name={f('fig_type')} label="Figure Type (optional)" options={figureTypes} />
        </FormControl>
        <FormControl fullWidth sx={{ ml: 2 }}>
          <FormikTextInput name={f('ref_figure')} label="Figure Number (optional)" />
        </FormControl>
      </Box>
      <Box mb={2}><FormikTextInput name={f('method')} label="Method (optional)" /></Box>
    </>
  );
}

function StimulusCard({ index, arrayName, label, valueFieldName, valueLabel, onRemove }) {
  const [open, setOpen] = useState(true);
  const f = (field) => `${arrayName}.${index}.${field}`;
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }} gridColumn="span 12">
        <ListItemButton onClick={() => setOpen(!open)}>
          <ListItemText>
            <Typography>{`${label} #${index + 1}`}</Typography>
          </ListItemText>
          <IconButton onClick={(e) => { e.stopPropagation(); onRemove(index); }} style={{ marginRight: '20px' }}>
            <DeleteForever />
          </IconButton>
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </Box>
      <Box gridColumn="span 12">
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box mb={2}>
            <FormikTextInput name={f(valueFieldName)} label={valueLabel} type="number" />
          </Box>
          <StimulusEvidenceFields f={f} />
        </Collapse>
      </Box>
    </>
  );
}

function MutationsList({ fieldPrefix }) {
  const { values } = useFormikContext();
  const mutations = _.get(values, `${fieldPrefix}.mutations`, []);
  return (
    <FieldArray name={`${fieldPrefix}.mutations`}>
      {({ push, remove }) => (
        <>
          <Box gridColumn="span 12">
            <Typography sx={{ fontSize: { xs: 18, md: 20 }, mt: 2 }}>Mutations (optional)</Typography>
            <Typography variant="caption" color="text.secondary">
              List point mutations from the wild type, e.g. "L42A".
            </Typography>
          </Box>
          {mutations.map((_m, i) => (
            <Box key={i} gridColumn="span 12" display="flex" alignItems="center" gap={1}>
              <FormikTextInput name={`${fieldPrefix}.mutations.${i}`} label={`Mutation #${i + 1}`} />
              <IconButton onClick={() => remove(i)}><DeleteForever /></IconButton>
            </Box>
          ))}
          <Box gridColumn="span 12">
            <Button onClick={() => push('')} variant="outlined" size="small">
              + Add mutation
            </Button>
          </Box>
        </>
      )}
    </FieldArray>
  );
}

export default function ExtraStimuliTab({ fieldPrefix }) {
  const { values } = useFormikContext();
  const lights = _.get(values, `${fieldPrefix}.light_stimuli`, []);
  const temps = _.get(values, `${fieldPrefix}.temperature_stimuli`, []);

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      rowGap={1}
      sx={{ height: '100%', mx: 3, mt: 3 }}
    >
      <Box gridColumn="span 12">
        <Typography sx={{ fontSize: { xs: 22, md: 26 }, mb: 1 }}>
          Additional stimuli & mutations
        </Typography>
        <Typography variant="caption" color="text.secondary">
          All optional — fill in only what applies to this protein.
        </Typography>
      </Box>

      <Box gridColumn="span 12">
        <Typography sx={{ fontSize: { xs: 18, md: 20 }, mt: 2 }}>Light stimuli</Typography>
      </Box>
      <FieldArray name={`${fieldPrefix}.light_stimuli`}>
        {({ push, remove }) => (
          <>
            {lights.map((_, i) => (
              <StimulusCard
                key={i}
                index={i}
                arrayName={`${fieldPrefix}.light_stimuli`}
                label="Light"
                valueFieldName="wavelength"
                valueLabel="Wavelength (nm)"
                onRemove={remove}
              />
            ))}
            <Box gridColumn="span 12">
              <Button onClick={() => push(createEmptyLightStimulus())} variant="outlined" size="small">
                + Add light stimulus
              </Button>
            </Box>
          </>
        )}
      </FieldArray>

      <Box gridColumn="span 12">
        <Typography sx={{ fontSize: { xs: 18, md: 20 }, mt: 2 }}>Temperature stimuli</Typography>
      </Box>
      <FieldArray name={`${fieldPrefix}.temperature_stimuli`}>
        {({ push, remove }) => (
          <>
            {temps.map((_, i) => (
              <StimulusCard
                key={i}
                index={i}
                arrayName={`${fieldPrefix}.temperature_stimuli`}
                label="Temperature"
                valueFieldName="temperature"
                valueLabel="Temperature (°C)"
                onRemove={remove}
              />
            ))}
            <Box gridColumn="span 12">
              <Button onClick={() => push(createEmptyTemperatureStimulus())} variant="outlined" size="small">
                + Add temperature stimulus
              </Button>
            </Box>
          </>
        )}
      </FieldArray>

      <MutationsList fieldPrefix={fieldPrefix} />
    </Box>
  );
}
