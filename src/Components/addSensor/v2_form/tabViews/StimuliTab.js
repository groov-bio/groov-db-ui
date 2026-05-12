import { useMemo, useState } from 'react';
import {
  Box, Button, Typography, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import { FieldArray, useFormikContext } from 'formik';
import _ from 'lodash';
import LigandCard from './cards/LigandCard';
import StimulusCard from './cards/StimulusCard';
import {
  createEmptyLigand,
  createEmptyLightStimulus,
  createEmptyTemperatureStimulus,
} from '../../../../lib/constants/v2_form/initialValues';

const STIMULUS_TYPES = [
  { value: 'ligand', label: 'Ligand', arrayField: 'ligands' },
  { value: 'light', label: 'Light', arrayField: 'light_stimuli' },
  { value: 'temperature', label: 'Temperature', arrayField: 'temperature_stimuli' },
];

// Picks an initial stimulus type based on which array already has entries,
// so switching proteins doesn't reset the user's view to "Ligand" by default.
function initialStimulusType(values, fieldPrefix) {
  const lights = _.get(values, `${fieldPrefix}.light_stimuli`, []);
  if (lights.length > 0) return 'light';
  const temps = _.get(values, `${fieldPrefix}.temperature_stimuli`, []);
  if (temps.length > 0) return 'temperature';
  return 'ligand';
}

export default function StimuliTab({ fieldPrefix }) {
  const { values } = useFormikContext();
  const [stimulusType, setStimulusType] = useState(() =>
    initialStimulusType(values, fieldPrefix)
  );

  const ligands = _.get(values, `${fieldPrefix}.ligands`, []);
  const lights = _.get(values, `${fieldPrefix}.light_stimuli`, []);
  const temps = _.get(values, `${fieldPrefix}.temperature_stimuli`, []);

  const counts = useMemo(
    () => ({ ligand: ligands.length, light: lights.length, temperature: temps.length }),
    [ligands.length, lights.length, temps.length]
  );

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      rowGap={1}
      sx={{ height: '100%', mx: 3, mt: 3 }}
    >
      <Box gridColumn="span 12" display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography sx={{ fontSize: { xs: 22, md: 26 } }}>
          Stimulus
        </Typography>
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Stimulus type</InputLabel>
          <Select
            value={stimulusType}
            label="Stimulus type"
            onChange={(e) => setStimulusType(e.target.value)}
          >
            {STIMULUS_TYPES.map((t) => (
              <MenuItem key={t.value} value={t.value}>
                {t.label}{counts[t.value] > 0 ? ` (${counts[t.value]})` : ''}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {stimulusType === 'ligand' && (
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
      )}

      {stimulusType === 'light' && (
        <FieldArray name={`${fieldPrefix}.light_stimuli`}>
          {({ push, remove }) => (
            <>
              {lights.map((_item, i) => (
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
              <Box gridColumn="span 12" mt={1}>
                <Button onClick={() => push(createEmptyLightStimulus())} variant="outlined">
                  + Add light stimulus
                </Button>
              </Box>
            </>
          )}
        </FieldArray>
      )}

      {stimulusType === 'temperature' && (
        <FieldArray name={`${fieldPrefix}.temperature_stimuli`}>
          {({ push, remove }) => (
            <>
              {temps.map((_item, i) => (
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
              <Box gridColumn="span 12" mt={1}>
                <Button onClick={() => push(createEmptyTemperatureStimulus())} variant="outlined">
                  + Add temperature stimulus
                </Button>
              </Box>
            </>
          )}
        </FieldArray>
      )}
    </Box>
  );
}
