import React, { useState } from 'react';
import {
  Box, Paper, Typography, Tabs, Tab, TextField, Stack, Chip,
} from '@mui/material';
import StimulusArrayEdit from './StimulusArrayEdit';
import DnaArrayEdit from './DnaArrayEdit';
import ReferencesArrayEdit from './ReferencesArrayEdit';
import StructuresArrayEdit from './StructuresArrayEdit';
import OriginArrayEdit from './OriginArrayEdit';
import ContextArrayEdit from './ContextArrayEdit';

const TABS = ['Identity', 'Stimulus', 'DNA Binding', 'References', 'Structures', 'Origin', 'Context'];

function IdentityFields({ protein, onChange }) {
  const f = (key) => ({
    size: 'small',
    fullWidth: true,
    value: protein[key] ?? '',
    onChange: (e) => onChange({ ...protein, [key]: e.target.value || null }),
  });

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
          value={protein.family ?? ''}
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
          label="Regulation type" size="small"
          value={protein.regulation_type ?? ''}
          onChange={(e) => onChange({ ...protein, regulation_type: e.target.value || null })}
          sx={{ gridColumn: { sm: 'span 2' } }}
          fullWidth
        />
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

export default function ProteinEditSection({ protein, proteinIndex, onChange, user }) {
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
          <IdentityFields protein={protein} onChange={onChange} />
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
        {tab === 4 && (
          <StructuresArrayEdit
            items={protein.structures ?? []}
            onChange={(newArr) => onChange({ ...protein, structures: newArr })}
          />
        )}
        {tab === 5 && (
          <OriginArrayEdit
            items={protein.origin ?? []}
            onChange={(newArr) => onChange({ ...protein, origin: newArr })}
          />
        )}
        {tab === 6 && (
          <ContextArrayEdit
            items={protein.context ?? []}
            onChange={(newArr) => onChange({ ...protein, context: newArr })}
          />
        )}
      </Box>
    </Paper>
  );
}
