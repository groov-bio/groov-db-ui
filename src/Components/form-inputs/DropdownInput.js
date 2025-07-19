import React, { useEffect } from 'react';

import { Controller } from 'react-hook-form';

import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { useAddSensorStore } from '../../zustand/addSensor.store';

const arrOptions = {
  familyOptions: [
    'TetR',
    'LysR',
    'AraC',
    'MarR',
    'LacI',
    'GntR',
    'LuxR',
    'IclR',
    'Other',
  ],
  mechanisms: [
    'Apo-repressor',
    'Co-repressor',
    'Apo-activator',
    'Co-activator',
  ],
  figures: ['Figure', 'Supplementary Figure', 'Table', 'Supplementary Table'],
  ligandMethods: [
    'EMSA',
    'DNase footprinting',
    'Isothermal titration calorimetry',
    'Surface plasmon resonance',
    'Fluorescence polarization',
    'Synthetic regulation',
  ],
  operatorMethods: [
    'EMSA',
    'DNase footprinting',
    'Surface plasmon resonance',
    'Crystal structure',
    'Isothermal titration calorimetry',
    'Fluorescence polarization',
    'Synthetic regulation',
  ],
};

export default function ({ label, field, accessKey, arr, index }) {
  const fieldData = useAddSensorStore((state) => state[field]);
  const currentFieldErrors = useAddSensorStore((state) => state.errors[field]);
  const updateField = useAddSensorStore((state) => state.updateField);
  const updateArrayField = useAddSensorStore((state) => state.updateArrayField);
  const popError = useAddSensorStore((state) => state.popError);
  const errorString =
    index === undefined
      ? `${field}${accessKey}`
      : `${field}${index + 1}${accessKey}`;

  const helper = {
    message: {
      required: `${label} is required`,
    },
  };

  return (
    <FormControl
      fullWidth
      error={currentFieldErrors[errorString] ? true : false}
    >
      <InputLabel id={`${label}-label`}>{label}</InputLabel>
      <Select
        fullWidth
        label={label}
        value={
          index === undefined
            ? fieldData[accessKey]
            : fieldData[index][accessKey]
        }
        onChange={(e) => {
          index === undefined
            ? updateField(field, accessKey, e.target.value)
            : updateArrayField(field, index, accessKey, e.target.value);
          if (currentFieldErrors[errorString]) {
            popError(field, errorString);
          }
        }}
        labelId={`${label}=label`}
      >
        {arrOptions[arr].map((entry, index) => (
          <MenuItem key={index} value={entry}>
            {entry}
          </MenuItem>
        ))}
      </Select>
      {currentFieldErrors[errorString] && (
        <FormHelperText error={true}>{helper.message.required}</FormHelperText>
      )}
    </FormControl>
  );
}
