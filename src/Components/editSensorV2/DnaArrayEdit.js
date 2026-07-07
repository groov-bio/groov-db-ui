import React from 'react';
import { Box, Button, TextField, IconButton, Typography, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import {
  operatorMethods, figureTypes, splitFigure, joinFigure,
} from '../../lib/constants/v2_form/experimentalMethods';

function createEmptyDna() {
  return { sequence: '', ref_figure: null, doi: null, method: '', kd: null };
}

function DnaEntryEdit({ item, onChange, onRemove }) {
  const f = (key, val) => onChange({ ...item, [key]: val });
  const currentMethod = item.method ?? '';
  const methodOptions = currentMethod && !operatorMethods.includes(currentMethod)
    ? [currentMethod, ...operatorMethods]
    : operatorMethods;
  const { figType, num } = splitFigure(item.ref_figure);
  return (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 1.5, mb: 1.5 }}>
      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1.5}>
        <TextField
          label="Sequence" size="small" fullWidth multiline rows={2}
          inputProps={{ style: { fontFamily: 'monospace', fontSize: '0.8rem' } }}
          value={item.sequence ?? ''}
          onChange={(e) => f('sequence', e.target.value || null)}
          sx={{ gridColumn: 'span 2' }}
        />
        <TextField
          select label="Method" size="small" fullWidth
          value={currentMethod}
          onChange={(e) => f('method', e.target.value || null)}
        >
          <MenuItem value=""><em>None</em></MenuItem>
          {methodOptions.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
        </TextField>
        <TextField
          label="Kd" size="small" type="number"
          value={item.kd ?? ''}
          onChange={(e) => f('kd', e.target.value !== '' ? Number(e.target.value) : null)}
        />
        <TextField
          select label="Figure type" size="small" fullWidth
          value={figType}
          onChange={(e) => f('ref_figure', joinFigure(e.target.value, num))}
        >
          {figureTypes.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </TextField>
        <TextField
          label="Figure number" size="small" fullWidth
          value={num}
          onChange={(e) => f('ref_figure', joinFigure(figType, e.target.value))}
        />
        <TextField
          label="DOI" size="small" fullWidth
          value={item.doi ?? ''}
          onChange={(e) => f('doi', e.target.value || null)}
          sx={{ gridColumn: 'span 2' }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gridColumn: 'span 2' }}>
          <IconButton size="small" onClick={onRemove} color="error">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

export default function DnaArrayEdit({ items, onChange }) {
  return (
    <Box>
      {items.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          No DNA binding entries.
        </Typography>
      )}
      {items.map((item, i) => (
        <DnaEntryEdit
          key={i} item={item}
          onChange={(updated) => onChange(items.map((x, idx) => idx === i ? updated : x))}
          onRemove={() => onChange(items.filter((_, idx) => idx !== i))}
        />
      ))}
      <Button variant="outlined" startIcon={<AddIcon />}
        onClick={() => onChange([...items, createEmptyDna()])}>
        Add DNA entry
      </Button>
    </Box>
  );
}
