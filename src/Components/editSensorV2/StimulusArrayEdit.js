import React, { useState } from 'react';
import {
  Box, Button, Typography, Accordion, AccordionSummary, AccordionDetails,
  TextField, Stack, IconButton, Chip, Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

function createEmptyStimulus() {
  return {
    _stimKey: 'stimulusType',
    stimulusType: [],
    stimulus_evidence: [],
  };
}

function createEmptySmallMolecule() {
  return { name: '', smiles: '', regulatory_effect: '' };
}

function createEmptyLight() {
  return { wavelength: '', regulatory_effect: '' };
}

function createEmptyTemperature() {
  return { temperature: '', regulatory_effect: '' };
}

function createEmptyTypeEntry() {
  return { small_molecule: null, light: null, temperature: null };
}

function createEmptyEvidence() {
  return { method: [], ref_figure: null, doi: null, kd: 0 };
}

function SmallMoleculeEdit({ item, onChange, onRemove }) {
  const f = (key, val) => onChange({ ...item, [key]: val || null });
  return (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 1.5, mb: 1 }}>
      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1}>
        <TextField
          label="Name" size="small" fullWidth value={item.name ?? ''}
          onChange={(e) => f('name', e.target.value)}
        />
        <TextField
          label="SMILES" size="small" fullWidth value={item.smiles ?? item.SMILES ?? ''}
          onChange={(e) => {
            // Preserve original key (SMILES vs smiles)
            const key = 'SMILES' in item ? 'SMILES' : 'smiles';
            onChange({ ...item, [key]: e.target.value || null });
          }}
        />
        <TextField
          label="Regulatory effect" size="small" fullWidth
          value={item.regulatory_effect ?? ''}
          onChange={(e) => f('regulatory_effect', e.target.value)}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <IconButton size="small" onClick={onRemove} color="error"><DeleteIcon fontSize="small" /></IconButton>
        </Box>
      </Box>
    </Box>
  );
}

function LightEdit({ item, onChange, onRemove }) {
  return (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 1.5, mb: 1 }}>
      <Box display="grid" gridTemplateColumns="1fr 1fr auto" gap={1} alignItems="center">
        <TextField
          label="Wavelength (nm)" size="small" type="number"
          value={item.wavelength ?? ''}
          onChange={(e) => onChange({ ...item, wavelength: e.target.value !== '' ? Number(e.target.value) : null })}
        />
        <TextField
          label="Regulatory effect" size="small"
          value={item.regulatory_effect ?? ''}
          onChange={(e) => onChange({ ...item, regulatory_effect: e.target.value || null })}
        />
        <IconButton size="small" onClick={onRemove} color="error"><DeleteIcon fontSize="small" /></IconButton>
      </Box>
    </Box>
  );
}

function TemperatureEdit({ item, onChange, onRemove }) {
  return (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 1.5, mb: 1 }}>
      <Box display="grid" gridTemplateColumns="1fr 1fr auto" gap={1} alignItems="center">
        <TextField
          label="Temperature (°C)" size="small" type="number"
          value={item.temperature ?? ''}
          onChange={(e) => onChange({ ...item, temperature: e.target.value !== '' ? Number(e.target.value) : null })}
        />
        <TextField
          label="Regulatory effect" size="small"
          value={item.regulatory_effect ?? ''}
          onChange={(e) => onChange({ ...item, regulatory_effect: e.target.value || null })}
        />
        <IconButton size="small" onClick={onRemove} color="error"><DeleteIcon fontSize="small" /></IconButton>
      </Box>
    </Box>
  );
}

function EvidenceEdit({ item, onChange, onRemove }) {
  const methodStr = Array.isArray(item.method) ? item.method.join(', ') : (item.method ?? '');
  return (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 1.5, mb: 1 }}>
      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1}>
        <TextField
          label="Method(s)" size="small" fullWidth
          helperText="Comma-separated"
          value={methodStr}
          onChange={(e) => onChange({ ...item, method: e.target.value ? e.target.value.split(',').map((s) => s.trim()) : [] })}
        />
        <TextField
          label="Ref figure" size="small" fullWidth
          value={item.ref_figure ?? ''}
          onChange={(e) => onChange({ ...item, ref_figure: e.target.value || null })}
        />
        <TextField
          label="DOI" size="small" fullWidth
          value={item.doi ?? ''}
          onChange={(e) => onChange({ ...item, doi: e.target.value || null })}
        />
        <TextField
          label="Kd" size="small" type="number"
          value={item.kd ?? ''}
          onChange={(e) => onChange({ ...item, kd: e.target.value !== '' ? Number(e.target.value) : 0 })}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gridColumn: 'span 2' }}>
          <IconButton size="small" onClick={onRemove} color="error"><DeleteIcon fontSize="small" /></IconButton>
        </Box>
      </Box>
    </Box>
  );
}

function TypeEntryEdit({ entry, onChange }) {
  const sm = entry.small_molecule ?? [];
  const lights = entry.light ?? [];
  const temps = entry.temperature ?? [];

  const updateSm = (newArr) => onChange({ ...entry, small_molecule: newArr.length ? newArr : null });
  const updateLight = (newArr) => onChange({ ...entry, light: newArr.length ? newArr : null });
  const updateTemp = (newArr) => onChange({ ...entry, temperature: newArr.length ? newArr : null });

  return (
    <Box>
      <Box sx={{ mb: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Small Molecules
          </Typography>
          <Button size="small" startIcon={<AddIcon />}
            onClick={() => updateSm([...sm, createEmptySmallMolecule()])}>
            Add
          </Button>
        </Box>
        {sm.map((mol, i) => (
          <SmallMoleculeEdit
            key={i} item={mol}
            onChange={(updated) => updateSm(sm.map((m, idx) => idx === i ? updated : m))}
            onRemove={() => updateSm(sm.filter((_, idx) => idx !== i))}
          />
        ))}
      </Box>

      <Box sx={{ mb: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Light
          </Typography>
          <Button size="small" startIcon={<AddIcon />}
            onClick={() => updateLight([...lights, createEmptyLight()])}>
            Add
          </Button>
        </Box>
        {lights.map((l, i) => (
          <LightEdit
            key={i} item={l}
            onChange={(updated) => updateLight(lights.map((x, idx) => idx === i ? updated : x))}
            onRemove={() => updateLight(lights.filter((_, idx) => idx !== i))}
          />
        ))}
      </Box>

      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Temperature
          </Typography>
          <Button size="small" startIcon={<AddIcon />}
            onClick={() => updateTemp([...temps, createEmptyTemperature()])}>
            Add
          </Button>
        </Box>
        {temps.map((t, i) => (
          <TemperatureEdit
            key={i} item={t}
            onChange={(updated) => updateTemp(temps.map((x, idx) => idx === i ? updated : x))}
            onRemove={() => updateTemp(temps.filter((_, idx) => idx !== i))}
          />
        ))}
      </Box>
    </Box>
  );
}

function StimulusEntryEdit({ entry, index, onChange, onRemove }) {
  const typeEntries = entry.stimulusType ?? [];
  const evidenceEntries = entry.stimulus_evidence ?? [];

  const updateTypeEntries = (newArr) => onChange({ ...entry, stimulusType: newArr });
  const updateEvidence = (newArr) => onChange({ ...entry, stimulus_evidence: newArr });

  return (
    <Accordion defaultExpanded={index === 0}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', pr: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>Stimulus entry {index + 1}</Typography>
          <Box sx={{ flex: 1 }} />
          <IconButton size="small" color="error"
            onClick={(e) => { e.stopPropagation(); onRemove(); }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Stimulus type(s)</Typography>
        {typeEntries.map((typeEntry, i) => (
          <Box key={i} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2, mb: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" color="text.secondary">Type entry {i + 1}</Typography>
              <IconButton size="small" color="error"
                onClick={() => updateTypeEntries(typeEntries.filter((_, idx) => idx !== i))}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
            <TypeEntryEdit
              entry={typeEntry}
              onChange={(updated) => updateTypeEntries(typeEntries.map((te, idx) => idx === i ? updated : te))}
            />
          </Box>
        ))}
        <Button size="small" variant="outlined" startIcon={<AddIcon />}
          onClick={() => updateTypeEntries([...typeEntries, createEmptyTypeEntry()])}
          sx={{ mb: 2 }}>
          Add type entry
        </Button>

        <Divider sx={{ mb: 1.5 }} />
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Evidence</Typography>
        {evidenceEntries.map((ev, i) => (
          <EvidenceEdit
            key={i} item={ev}
            onChange={(updated) => updateEvidence(evidenceEntries.map((e, idx) => idx === i ? updated : e))}
            onRemove={() => updateEvidence(evidenceEntries.filter((_, idx) => idx !== i))}
          />
        ))}
        <Button size="small" variant="outlined" startIcon={<AddIcon />}
          onClick={() => updateEvidence([...evidenceEntries, createEmptyEvidence()])}>
          Add evidence
        </Button>
      </AccordionDetails>
    </Accordion>
  );
}

export default function StimulusArrayEdit({ items, onChange }) {
  return (
    <Box>
      {items.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          No stimulus entries.
        </Typography>
      )}
      {items.map((entry, i) => (
        <StimulusEntryEdit
          key={i}
          entry={entry}
          index={i}
          onChange={(updated) => onChange(items.map((item, idx) => idx === i ? updated : item))}
          onRemove={() => onChange(items.filter((_, idx) => idx !== i))}
        />
      ))}
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => onChange([...items, createEmptyStimulus()])}
        sx={{ mt: 1 }}
      >
        Add stimulus entry
      </Button>
    </Box>
  );
}
