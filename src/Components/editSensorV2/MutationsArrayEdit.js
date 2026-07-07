import React from 'react';
import { Box, Button, TextField, IconButton, Typography, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

// Matches the add-sensor form (MutationsTab). A mutation set is a list of point
// mutations from a reference protein, tagged with where that reference lives.
const REF_TYPES = ['UniProt', 'groovDB'];

function createEmptyMutation() {
  return { mutations: [], ref_type: 'UniProt', ref_id: null };
}

function MutationEntryEdit({ item, index, onChange, onRemove }) {
  // Stored as a string array; edited as a comma-separated string (like add form).
  const mutationsStr = Array.isArray(item.mutations) ? item.mutations.join(', ') : '';

  return (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 1.5, mb: 1.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="caption" color="text.secondary">Mutation set {index + 1}</Typography>
        <IconButton size="small" color="error" onClick={onRemove}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
      <TextField
        label="Mutations (comma-separated)" size="small" fullWidth
        placeholder="e.g. L42A, K77R"
        value={mutationsStr}
        onChange={(e) => onChange({
          ...item,
          mutations: e.target.value
            ? e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
            : [],
        })}
        sx={{ mb: 1.5 }}
      />
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 2fr' }} gap={1.5}>
        <TextField
          select label="Reference type" size="small" fullWidth
          value={item.ref_type ?? 'UniProt'}
          onChange={(e) => onChange({ ...item, ref_type: e.target.value })}
        >
          {REF_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </TextField>
        <TextField
          label="Reference protein ID" size="small" fullWidth
          placeholder="UniProt ID or groovDB entry ID"
          value={item.ref_id ?? ''}
          onChange={(e) => onChange({ ...item, ref_id: e.target.value || null })}
        />
      </Box>
    </Box>
  );
}

export default function MutationsArrayEdit({ items, onChange }) {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Point mutations from a reference protein, e.g. &quot;L42A&quot;. Separate multiple
        mutations in a set with commas (e.g. &quot;L42A, K77R&quot;). Incomplete sets
        (missing a reference protein ID) are dropped on submit.
      </Typography>
      {items.map((item, i) => (
        <MutationEntryEdit
          key={i} item={item} index={i}
          onChange={(updated) => onChange(items.map((x, idx) => (idx === i ? updated : x)))}
          onRemove={() => onChange(items.filter((_, idx) => idx !== i))}
        />
      ))}
      <Button
        variant="outlined" startIcon={<AddIcon />}
        onClick={() => onChange([...items, createEmptyMutation()])}
      >
        Add mutation set
      </Button>
    </Box>
  );
}
