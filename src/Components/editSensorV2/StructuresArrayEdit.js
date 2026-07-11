import React from 'react';
import { Box, Button, TextField, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

function createEmptyStructure() {
  return { ID: '', file_location: null };
}

export default function StructuresArrayEdit({ items, onChange }) {
  return (
    <Box>
      {items.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          No structures.
        </Typography>
      )}
      {items.map((item, i) => (
        <Box key={i} display="grid" gridTemplateColumns="1fr 1fr auto" gap={1} alignItems="center" sx={{ mb: 1 }}>
          <TextField
            label="Structure ID" size="small"
            value={item.ID ?? ''}
            onChange={(e) => onChange(items.map((x, idx) => idx === i ? { ...x, ID: e.target.value } : x))}
          />
          <TextField
            label="File location" size="small"
            value={item.file_location ?? ''}
            onChange={(e) => onChange(items.map((x, idx) => idx === i ? { ...x, file_location: e.target.value || null } : x))}
          />
          <IconButton size="small" onClick={() => onChange(items.filter((_, idx) => idx !== i))} color="error">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
      <Button variant="outlined" startIcon={<AddIcon />}
        onClick={() => onChange([...items, createEmptyStructure()])}>
        Add structure
      </Button>
    </Box>
  );
}
