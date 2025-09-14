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
import { FieldArray } from 'formik';
import { FormikTextInput } from '../../../form-inputs/FormikTextInput';
import { FormikSelectInput } from '../../../form-inputs/FormikSelectInput';

export default function LigandCard({ index }) {
  const [open, setOpen] = useState(true);

  const figureTypes = [
    'Figure',
    'Supplementary Figure',
    'Table',
    'Supplementary Table',
  ];

  const ligandMethods = [
    'EMSA',
    'DNase footprinting',
    'Isothermal titration calorimetry',
    'Surface plasmon resonance',
    'Synthetic regulation',
    'Fluorescence polarization',
  ];

  const collapse = () => {
    setOpen(!open);
  };

  return (
    <FieldArray name="ligands">
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
                >{`Ligand #${index + 1}`}</Typography>
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
                  name={`ligands.${index}.name`}
                  label="Ligand Name"
                  id="new-sensor-ligand-name"
                  fullWidth
                />
              </Box>

              <Box gridColumn={'span 12'} mb={2}>
                <FormikTextInput
                  name={`ligands.${index}.SMILES`}
                  label="Ligand SMILES"
                  id="new-sensor-ligand-smiles"
                  fullWidth
                />
              </Box>

              <Box gridColumn={'span 12'} mb={2}>
                <FormikTextInput
                  name={`ligands.${index}.doi`}
                  label="Ligand DOI"
                  id="new-sensor-ligand-doi"
                  fullWidth
                />
              </Box>

              <Box gridColumn={'span 12'} display="flex" mb={2}>
                <FormControl fullWidth sx={{ mr: 2 }}>
                  <FormikSelectInput
                    name={`ligands.${index}.fig_type`}
                    label="Figure Type"
                    options={figureTypes}
                  />
                </FormControl>

                <FormControl fullWidth sx={{ ml: 2 }}>
                  <FormikTextInput
                    name={`ligands.${index}.ref_figure`}
                    label="Figure Number"
                    id="new-sensor-ligand-fig"
                  />
                </FormControl>
              </Box>

              <Box gridColumn={'span 12'}>
                <FormikSelectInput
                  name={`ligands.${index}.method`}
                  label="Experimental evidence"
                  options={ligandMethods}
                />
              </Box>
            </Collapse>
          </Box>
        </>
      )}
    </FieldArray>
  );
}
