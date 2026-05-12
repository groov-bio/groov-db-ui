import { useState } from 'react';
import {
  Box, Typography, IconButton, Collapse, ListItemButton, ListItemText, FormControl,
} from '@mui/material';
import { DeleteForever } from '@mui/icons-material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { FieldArray } from 'formik';
import { FormikTextInput } from '../../../../form-inputs/FormikTextInput';
import { FormikSelectInput } from '../../../../form-inputs/FormikSelectInput';

const figureTypes = ['Figure', 'Supplementary Figure', 'Table', 'Supplementary Table'];

const operatorMethods = [
  'EMSA', 'DNase footprinting', 'Surface plasmon resonance', 'Crystal structure',
  'Isothermal titration calorimetry', 'Fluorescence polarization',
  'Synthetic regulation', 'ChIP-Seq',
];

export default function OperatorCard({ index, fieldPrefix }) {
  const [open, setOpen] = useState(true);
  const arrayName = `${fieldPrefix}.operators`;
  const f = (field) => `${arrayName}.${index}.${field}`;

  return (
    <FieldArray name={arrayName}>
      {({ remove }) => (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }} gridColumn="span 12">
            <ListItemButton onClick={() => setOpen(!open)}>
              <ListItemText>
                <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                  {`Operator #${index + 1}`}
                </Typography>
              </ListItemText>
              {index !== 0 && (
                <IconButton
                  onClick={(e) => { e.stopPropagation(); remove(index); }}
                  style={{ marginRight: '20px' }}
                >
                  <DeleteForever />
                </IconButton>
              )}
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </Box>

          <Box gridColumn="span 12">
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box mb={2}><FormikTextInput name={f('sequence')} label="Operator Sequence" fullWidth /></Box>
              <Box mb={2}><FormikTextInput name={f('doi')} label="Operator DOI" fullWidth /></Box>

              <Box display="flex" mb={2}>
                <FormControl fullWidth sx={{ mr: 2 }}>
                  <FormikSelectInput name={f('fig_type')} label="Figure Type" options={figureTypes} />
                </FormControl>
                <FormControl fullWidth sx={{ ml: 2 }}>
                  <FormikTextInput name={f('ref_figure')} label="Figure Number" />
                </FormControl>
              </Box>

              <Box mb={2}>
                <FormikSelectInput name={f('method')} label="Experimental evidence" options={operatorMethods} />
              </Box>

              <Box display="flex" mb={2}>
                <FormControl fullWidth sx={{ mr: 1 }}>
                  <FormikTextInput
                    name={f('kd')}
                    label="Kd (optional)"
                    type="number"
                  />
                </FormControl>
                <FormControl sx={{ minWidth: 90 }}>
                  <FormikSelectInput
                    name={f('kd_unit')}
                    label="Unit"
                    options={['nM', 'µM', 'mM']}
                  />
                </FormControl>
              </Box>
            </Collapse>
          </Box>
        </>
      )}
    </FieldArray>
  );
}
