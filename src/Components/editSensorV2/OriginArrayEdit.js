import React from 'react';
import { Box, Button, TextField, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

function createEmptyOrigin() {
  return { type: '', organism_id: null, organism_name: '', parent_id: null };
}

function OriginEntryEdit({ item, onChange, onRemove }) {
  const f = (key, val) => onChange({ ...item, [key]: val });

  return (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 1.5, mb: 1.5 }}>
      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1.5}>
        <TextField
          label="Type" size="small" fullWidth
          value={item.type ?? ''}
          onChange={(e) => f('type', e.target.value || null)}
        />
        <TextField
          label="Organism name" size="small" fullWidth
          value={item.organism_name ?? ''}
          onChange={(e) => f('organism_name', e.target.value || null)}
        />
        <TextField
          label="Organism ID" size="small" type="number"
          value={item.organism_id ?? ''}
          onChange={(e) => f('organism_id', e.target.value !== '' ? Number(e.target.value) : null)}
        />
        <TextField
          label="Parent ID" size="small" fullWidth
          value={item.parent_id ?? ''}
          onChange={(e) => f('parent_id', e.target.value || null)}
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

export default function OriginArrayEdit({ items, onChange }) {
  return (
    <Box>
      {items.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          No origin entries.
        </Typography>
      )}
      {items.map((item, i) => (
        <OriginEntryEdit
          key={i} item={item}
          onChange={(updated) => onChange(items.map((x, idx) => idx === i ? updated : x))}
          onRemove={() => onChange(items.filter((_, idx) => idx !== i))}
        />
      ))}
      <Button variant="outlined" startIcon={<AddIcon />}
        onClick={() => onChange([...items, createEmptyOrigin()])}>
        Add origin
      </Button>
    </Box>
  );
}
