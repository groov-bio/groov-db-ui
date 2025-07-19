import { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Collapse,
  ListItemButton,
  ListItemText,
  FormControl,
} from '@mui/material';
import { DeleteForever } from '@mui/icons-material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { FieldArray, useFormikContext } from 'formik';
import { FormikTextInput } from '../../../form-inputs/FormikTextInput';
import { FormikSelectInput } from '../../../form-inputs/FormikSelectInput';

export default function OperatorCard({ index }) {
  const [open, setOpen] = useState(true);

  const figureTypes = [
    'Figure',
    'Supplementary Figure',
    'Table',
    'Supplementary Table',
  ];

  const operatorMethods = [
    'EMSA',
    'DNase footprinting',
    'Surface plasmon resonance',
    'Crystal structure',
    'Isothermal titration calorimetry',
    'Fluorescence polarization',
    'Synthetic regulation',
  ];

  const collapse = () => {
    setOpen(!open);
  };

  return (
    <FieldArray name="operators">
      {({ remove }) => (
        <>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between' }}
            gridColumn={'span 12'}
          >
            <ListItemButton onClick={collapse}>
              <ListItemText>
                <Typography
                  gridColumn={'span 12'}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >{`Operator #${index + 1}`}</Typography>
              </ListItemText>
              {index !== 0 && (
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent collapse trigger
                    remove(index);
                  }}
                  style={{ marginRight: '20px' }}
                >
                  <DeleteForever />
                </IconButton>
              )}
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </Box>

          <Box gridColumn={'span 12'}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box gridColumn={'span 12'} mb={2}>
                <FormikTextInput
                  name={`operators.${index}.sequence`}
                  label="Operator Sequence"
                  fullWidth
                />
              </Box>

              <Box gridColumn={'span 12'} mb={2}>
                <FormikTextInput
                  name={`operators.${index}.doi`}
                  label="Operator DOI"
                  fullWidth
                />
              </Box>

              <Box gridColumn={'span 12'} display="flex" mb={2}>
                <FormControl fullWidth sx={{ mr: 2 }}>
                  <FormikSelectInput
                    name={`operators.${index}.fig_type`}
                    label="Figure Type"
                    options={figureTypes}
                  />
                </FormControl>

                <FormControl fullWidth sx={{ ml: 2 }}>
                  <FormikTextInput
                    name={`operators.${index}.ref_figure`}
                    label="Figure Number"
                  />
                </FormControl>
              </Box>

              <Box gridColumn={'span 12'}>
                <FormikSelectInput
                  name={`operators.${index}.method`}
                  label="Experimental evidence"
                  options={operatorMethods}
                />
              </Box>
            </Collapse>
          </Box>
        </>
      )}
    </FieldArray>
  );
}
