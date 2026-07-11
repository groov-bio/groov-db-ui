import React from 'react';
import {
  Box, Button, TextField, IconButton, Typography,
  Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

function createEmptyOperonDir() {
  return { link: null, start: null, stop: null, description: null, direction: null };
}

function createEmptyContext() {
  return { reg_index: 0, genome: null, operon_dir: [] };
}

function OperonDirEdit({ item, onChange, onRemove }) {
  const f = (key, val) => onChange({ ...item, [key]: val });
  return (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 1.5, mb: 1 }}>
      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1}>
        <TextField
          label="Start" size="small" type="number"
          value={item.start ?? ''}
          onChange={(e) => f('start', e.target.value !== '' ? Number(e.target.value) : null)}
        />
        <TextField
          label="Stop" size="small" type="number"
          value={item.stop ?? ''}
          onChange={(e) => f('stop', e.target.value !== '' ? Number(e.target.value) : null)}
        />
        <TextField
          label="Direction" size="small"
          value={item.direction ?? ''}
          onChange={(e) => f('direction', e.target.value || null)}
        />
        <TextField
          label="Link" size="small"
          value={item.link ?? ''}
          onChange={(e) => f('link', e.target.value || null)}
        />
        <TextField
          label="Description" size="small" fullWidth
          value={item.description ?? ''}
          onChange={(e) => f('description', e.target.value || null)}
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

function ContextEntryEdit({ item, index, onChange, onRemove }) {
  const f = (key, val) => onChange({ ...item, [key]: val });
  const operonDir = item.operon_dir ?? [];

  return (
    <Accordion defaultExpanded={index === 0}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', pr: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Context {index + 1}{item.genome ? ` — ${item.genome}` : ''}
          </Typography>
          <Box sx={{ flex: 1 }} />
          <IconButton size="small" color="error"
            onClick={(e) => { e.stopPropagation(); onRemove(); }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1.5} sx={{ mb: 2 }}>
          <TextField
            label="Reg index" size="small" type="number"
            value={item.reg_index ?? ''}
            onChange={(e) => f('reg_index', e.target.value !== '' ? Number(e.target.value) : 0)}
          />
          <TextField
            label="Genome" size="small"
            value={item.genome ?? ''}
            onChange={(e) => f('genome', e.target.value || null)}
          />
        </Box>

        <Typography variant="subtitle2" sx={{ mb: 1 }}>Operon directions</Typography>
        {operonDir.map((od, i) => (
          <OperonDirEdit
            key={i} item={od}
            onChange={(updated) => f('operon_dir', operonDir.map((x, idx) => idx === i ? updated : x))}
            onRemove={() => f('operon_dir', operonDir.filter((_, idx) => idx !== i))}
          />
        ))}
        <Button size="small" startIcon={<AddIcon />}
          onClick={() => f('operon_dir', [...operonDir, createEmptyOperonDir()])}>
          Add operon direction
        </Button>
      </AccordionDetails>
    </Accordion>
  );
}

export default function ContextArrayEdit({ items, onChange }) {
  return (
    <Box>
      {items.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          No context entries.
        </Typography>
      )}
      {items.map((item, i) => (
        <ContextEntryEdit
          key={i} item={item} index={i}
          onChange={(updated) => onChange(items.map((x, idx) => idx === i ? updated : x))}
          onRemove={() => onChange(items.filter((_, idx) => idx !== i))}
        />
      ))}
      <Button variant="outlined" startIcon={<AddIcon />} sx={{ mt: 1 }}
        onClick={() => onChange([...items, createEmptyContext()])}>
        Add context
      </Button>
    </Box>
  );
}
