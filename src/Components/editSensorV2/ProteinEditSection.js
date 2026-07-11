import React, { useState } from 'react';
import {
  Box, Paper, Typography, Tabs, Tab, TextField, Stack, Chip, MenuItem,
} from '@mui/material';
import StimulusArrayEdit from './StimulusArrayEdit';
import DnaArrayEdit from './DnaArrayEdit';
import ReferencesArrayEdit from './ReferencesArrayEdit';

// Structures and Context are intentionally omitted from the edit form: context is
// determined by genome biology, and structures aren't user-editable until a
// structure-file upload feature exists. Origin and Mutations are also read-only:
// both are tied to the identity of the sensor, so changing them means creating a
// new sensor rather than editing this one.
const TABS = ['Identity', 'Stimulus', 'DNA Binding', 'References'];

// Canonical regulation mechanisms — keep in sync with the add-sensor form
// (SensorMetaTab.js). Signal transduction covers two-/multi-component systems.
const REGULATION_TYPES = [
  'Apo-repressor',
  'Co-repressor',
  'Apo-activator',
  'Co-activator',
  'Signal transduction',
];

function IdentityFields({ protein, family, onChange }) {
  const f = (key) => ({
    size: 'small',
    fullWidth: true,
    value: protein[key] ?? '',
    onChange: (e) => onChange({ ...protein, [key]: e.target.value || null }),
  });

  // Preserve any existing value so the dropdown shows it instead of rendering
  // blank. Match canonical options case-insensitively so a value that only
  // differs in case (e.g. a stored "Co-Activator" vs the canonical
  // "Co-activator") selects the canonical option instead of appearing twice.
  const rawRegType = protein.regulation_type ?? '';
  const canonicalRegType = REGULATION_TYPES.find(
    (t) => t.toLowerCase() === rawRegType.toLowerCase(),
  );
  const currentRegType = canonicalRegType ?? rawRegType;
  const regTypeOptions = currentRegType && !REGULATION_TYPES.includes(currentRegType)
    ? [currentRegType, ...REGULATION_TYPES]
    : REGULATION_TYPES;

  return (
    <Stack spacing={2}>
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
        <TextField label="Alias" {...f('alias')} />
        <TextField
          label="RefSeq ID" size="small" fullWidth
          value={protein.refseq_id ?? ''}
          InputProps={{ readOnly: true }}
          disabled
        />
        <TextField
          label="Family" size="small" fullWidth
          value={family ?? ''}
          InputProps={{ readOnly: true }}
          disabled
        />
        <TextField
          label="KEGG ID" size="small" fullWidth
          value={protein.kegg_id ?? ''}
          InputProps={{ readOnly: true }}
          disabled
        />
        <TextField
          select
          label="Regulation type" size="small"
          value={currentRegType}
          onChange={(e) => onChange({ ...protein, regulation_type: e.target.value || null })}
          sx={{ gridColumn: { sm: 'span 2' } }}
          fullWidth
        >
          {regTypeOptions.map((opt) => (
            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
          ))}
        </TextField>
      </Box>
      <TextField
        label="Sequence" size="small" fullWidth multiline rows={4}
        inputProps={{ style: { fontFamily: 'monospace', fontSize: '0.8rem' } }}
        InputProps={{ readOnly: true }}
        disabled
        value={protein.sequence ?? ''}
      />
    </Stack>
  );
}

export default function ProteinEditSection({ protein, proteinIndex, family, onChange, user }) {
  const [tab, setTab] = useState(0);

  return (
    <Paper sx={{ borderRadius: 2, mb: 3, overflow: 'hidden' }}>
      <Box sx={{
        p: 2,
        display: 'flex', alignItems: 'center', gap: 1,
        borderBottom: 1, borderColor: 'divider',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.05) 100%)',
      }}>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          {protein.alias ?? `Protein ${proteinIndex + 1}`}
        </Typography>
        <Chip
          label={protein.uniprot_id}
          size="small"
          variant="outlined"
          sx={{ fontFamily: 'monospace' }}
        />
        <Typography variant="caption" color="text.secondary">(UniProt ID is read-only)</Typography>
      </Box>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        {TABS.map((label) => <Tab key={label} label={label} />)}
      </Tabs>

      <Box sx={{ p: 3 }}>
        {tab === 0 && (
          <IdentityFields protein={protein} family={family} onChange={onChange} />
        )}
        {tab === 1 && (
          <StimulusArrayEdit
            items={protein.stimulus ?? []}
            onChange={(newArr) => onChange({ ...protein, stimulus: newArr })}
          />
        )}
        {tab === 2 && (
          <DnaArrayEdit
            items={protein.dna ?? []}
            onChange={(newArr) => onChange({ ...protein, dna: newArr })}
          />
        )}
        {tab === 3 && (
          <ReferencesArrayEdit
            items={protein.references ?? []}
            user={user}
            onChange={(newArr) => onChange({ ...protein, references: newArr })}
          />
        )}
      </Box>
    </Paper>
  );
}
