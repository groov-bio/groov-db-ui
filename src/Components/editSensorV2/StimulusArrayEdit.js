import React from 'react';
import {
  Box, Button, Typography, Accordion, AccordionSummary, AccordionDetails,
  TextField, Stack, IconButton, Chip, Divider,
  FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, OutlinedInput,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import {
  ligandMethods, figureTypes, regulatoryEffects, splitFigure, joinFigure,
} from '../../lib/constants/v2_form/experimentalMethods';
import {
  stimulusToCards, cardsToStimulus, createEmptyCard, createEmptyItem,
  STIMULUS_KINDS, STIMULUS_KIND_LABELS,
} from '../../lib/constants/v2_form/stimulusShape';

// Regulatory effect is a controlled dropdown (activates/represses), matching the
// add-sensor form. Any legacy free-text value is preserved as an extra option.
function RegulatoryEffectSelect({ value, onChange }) {
  const current = value ?? '';
  const options = current && !regulatoryEffects.includes(current)
    ? [current, ...regulatoryEffects]
    : regulatoryEffects;
  return (
    <TextField
      select label="Regulatory effect" size="small" fullWidth
      value={current}
      onChange={(e) => onChange(e.target.value || null)}
    >
      <MenuItem value=""><em>None</em></MenuItem>
      {options.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
    </TextField>
  );
}

// Edits a canonical ref_figure string via a figure-type dropdown + number field.
function FigureRefEdit({ value, onChange }) {
  const { figType, num } = splitFigure(value);
  return (
    <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1}>
      <TextField
        select label="Figure type" size="small" fullWidth
        value={figType}
        onChange={(e) => onChange(joinFigure(e.target.value, num))}
      >
        {figureTypes.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
      </TextField>
      <TextField
        label="Figure number" size="small" fullWidth
        value={num}
        onChange={(e) => onChange(joinFigure(figType, e.target.value))}
      />
    </Box>
  );
}

// The stimulus itself: small molecule (name + SMILES), light (wavelength), or
// temperature — each with a regulatory effect.
function StimulusItemFields({ kind, item, onChange }) {
  const effect = (
    <RegulatoryEffectSelect
      value={item.regulatory_effect}
      onChange={(v) => onChange({ ...item, regulatory_effect: v })}
    />
  );

  if (kind === 'light') {
    return (
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={1.5}>
        <TextField
          label="Wavelength (nm)" size="small" type="number" fullWidth
          value={item.wavelength ?? ''}
          onChange={(e) => onChange({ ...item, wavelength: e.target.value !== '' ? Number(e.target.value) : null })}
        />
        {effect}
      </Box>
    );
  }

  if (kind === 'temperature') {
    return (
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={1.5}>
        <TextField
          label="Temperature (°C)" size="small" type="number" fullWidth
          value={item.temperature ?? ''}
          onChange={(e) => onChange({ ...item, temperature: e.target.value !== '' ? Number(e.target.value) : null })}
        />
        {effect}
      </Box>
    );
  }

  // small molecule — preserve the original SMILES key casing.
  const smilesKey = 'SMILES' in item ? 'SMILES' : 'smiles';
  return (
    <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={1.5}>
      <TextField
        label="Name" size="small" fullWidth
        value={item.name ?? ''}
        onChange={(e) => onChange({ ...item, name: e.target.value || null })}
      />
      <TextField
        label="SMILES" size="small" fullWidth
        value={item.smiles ?? item.SMILES ?? ''}
        onChange={(e) => onChange({ ...item, [smilesKey]: e.target.value || null })}
      />
      {effect}
    </Box>
  );
}

// Literature evidence for the stimulus — one block per stimulus.
function EvidenceFields({ evidence, onChange }) {
  const selectedMethods = Array.isArray(evidence.method)
    ? evidence.method
    : (evidence.method ? [evidence.method] : []);
  const methodOptions = [
    ...ligandMethods,
    ...selectedMethods.filter((m) => !ligandMethods.includes(m)),
  ];

  return (
    <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1.5}>
      <FormControl size="small" fullWidth sx={{ gridColumn: 'span 2' }}>
        <InputLabel>Method(s)</InputLabel>
        <Select
          multiple
          label="Method(s)"
          value={selectedMethods}
          onChange={(e) => {
            const val = typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value;
            onChange({ ...evidence, method: val });
          }}
          input={<OutlinedInput label="Method(s)" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((v) => <Chip key={v} label={v} size="small" />)}
            </Box>
          )}
        >
          {methodOptions.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox checked={selectedMethods.includes(option)} size="small" />
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ gridColumn: 'span 2' }}>
        <FigureRefEdit
          value={evidence.ref_figure}
          onChange={(val) => onChange({ ...evidence, ref_figure: val })}
        />
      </Box>
      <TextField
        label="DOI" size="small" fullWidth
        value={evidence.doi ?? ''}
        onChange={(e) => onChange({ ...evidence, doi: e.target.value || null })}
      />
      <TextField
        label="Kd" size="small" type="number" fullWidth
        value={evidence.kd ?? ''}
        onChange={(e) => onChange({ ...evidence, kd: e.target.value !== '' ? Number(e.target.value) : null })}
      />
    </Box>
  );
}

function summarize(kind, item) {
  if (kind === 'small_molecule') return item?.name || 'Small molecule';
  if (kind === 'light') return item?.wavelength != null ? `Light — ${item.wavelength} nm` : 'Light';
  if (kind === 'temperature') return item?.temperature != null ? `Temperature — ${item.temperature} °C` : 'Temperature';
  return 'Stimulus';
}

function StimulusCardEdit({ card, index, onChange, onRemove }) {
  const { kind, item, evidence } = card;

  const setKind = (newKind) => {
    if (newKind === kind) return;
    // Carry over the regulatory effect; the rest of the fields differ by kind.
    onChange({
      ...card,
      kind: newKind,
      item: { ...createEmptyItem(newKind), regulatory_effect: item?.regulatory_effect ?? null },
    });
  };

  return (
    <Accordion defaultExpanded={index === 0}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', pr: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>Stimulus {index + 1}</Typography>
          <Chip label={summarize(kind, item)} size="small" variant="outlined" />
          <Box sx={{ flex: 1 }} />
          <IconButton size="small" color="error"
            onClick={(e) => { e.stopPropagation(); onRemove(); }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2}>
          <TextField
            select label="Stimulus type" size="small"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            sx={{ maxWidth: 260 }}
          >
            {STIMULUS_KINDS.map((k) => (
              <MenuItem key={k} value={k}>{STIMULUS_KIND_LABELS[k]}</MenuItem>
            ))}
          </TextField>

          <StimulusItemFields
            kind={kind}
            item={item}
            onChange={(newItem) => onChange({ ...card, item: newItem })}
          />

          <Divider textAlign="left">
            <Typography variant="caption" color="text.secondary">Evidence</Typography>
          </Divider>

          <EvidenceFields
            evidence={evidence}
            onChange={(newEv) => onChange({ ...card, evidence: newEv })}
          />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

export default function StimulusArrayEdit({ items, onChange }) {
  // The stored shape nests molecules and evidence; the editor presents one flat
  // card per stimulus and re-wraps to the stored shape on every change.
  const cards = stimulusToCards(items);
  const commit = (newCards) => onChange(cardsToStimulus(newCards));

  return (
    <Box>
      {cards.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          No stimulus entries.
        </Typography>
      )}
      {cards.map((card, i) => (
        <StimulusCardEdit
          key={i}
          card={card}
          index={i}
          onChange={(updated) => commit(cards.map((c, idx) => (idx === i ? updated : c)))}
          onRemove={() => commit(cards.filter((_, idx) => idx !== i))}
        />
      ))}
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => commit([...cards, createEmptyCard()])}
        sx={{ mt: 1 }}
      >
        Add stimulus
      </Button>
    </Box>
  );
}
