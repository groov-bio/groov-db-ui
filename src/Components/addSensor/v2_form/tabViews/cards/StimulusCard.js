import { useState } from 'react';
import {
  Box, Typography, IconButton, Collapse, ListItemButton, ListItemText, FormControl,
} from '@mui/material';
import { DeleteForever } from '@mui/icons-material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { FormikTextInput } from '../../../../form-inputs/FormikTextInput';
import { FormikSelectInput } from '../../../../form-inputs/FormikSelectInput';

const figureTypes = ['Figure', 'Supplementary Figure', 'Table', 'Supplementary Table'];

// Shared card for light/temperature stimuli — same shape, different scalar field.
export default function StimulusCard({
  arrayName,
  index,
  label,
  valueFieldName,
  valueLabel,
  onRemove,
}) {
  const [open, setOpen] = useState(true);
  const f = (field) => `${arrayName}.${index}.${field}`;
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }} gridColumn="span 12">
        <ListItemButton onClick={() => setOpen(!open)}>
          <ListItemText>
            <Typography>{`${label} #${index + 1}`}</Typography>
          </ListItemText>
          <IconButton
            onClick={(e) => { e.stopPropagation(); onRemove(index); }}
            style={{ marginRight: '20px' }}
          >
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
          <Box mb={2}>
            <FormikSelectInput name={f('regulatory_effect')} label="Regulatory effect (optional)" options={['activates', 'represses']} />
          </Box>
          <Box mb={2}><FormikTextInput name={f('doi')} label="DOI" /></Box>
          <Box display="flex" mb={2}>
            <FormControl fullWidth sx={{ mr: 2 }}>
              <FormikSelectInput name={f('fig_type')} label="Figure Type" options={figureTypes} />
            </FormControl>
            <FormControl fullWidth sx={{ ml: 2 }}>
              <FormikTextInput name={f('ref_figure')} label="Figure Number" />
            </FormControl>
          </Box>
          <Box mb={2}><FormikTextInput name={f('method')} label="Method" /></Box>
        </Collapse>
      </Box>
    </>
  );
}
