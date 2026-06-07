import React from 'react';
import { Box, Button, TextField, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

function createEmptyDna() {
  return { sequence: '', ref_figure: null, doi: null, method: '', kd: 0 };
}

function DnaEntryEdit({ item, onChange, onRemove }) {
  const f = (key, val) => onChange({ ...item, [key]: val });
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
          label="Method" size="small" fullWidth
          value={item.method ?? ''}
          onChange={(e) => f('method', e.target.value || null)}
        />
        <TextField
          label="Kd" size="small" type="number"
          value={item.kd ?? ''}
          onChange={(e) => f('kd', e.target.value !== '' ? Number(e.target.value) : 0)}
        />
        <TextField
          label="Ref figure" size="small" fullWidth
          value={item.ref_figure ?? ''}
          onChange={(e) => f('ref_figure', e.target.value || null)}
        />
        <TextField
          label="DOI" size="small" fullWidth
          value={item.doi ?? ''}
          onChange={(e) => f('doi', e.target.value || null)}
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
