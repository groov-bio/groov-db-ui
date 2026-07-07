import React from 'react';
import {
  Box, Button, TextField, IconButton, Typography,
  Accordion, AccordionSummary, AccordionDetails,
  CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from 'notistack';
import { lookupDoiV2 } from '../../lib/api/v2Admin';

function createEmptyAuthor() {
  return { last_name: null, first_name: null };
}

function createEmptyReference() {
  return {
    title: null, authors: [], year: null, journal: null,
    doi: null, url: null, interaction: [],
  };
}

function AuthorEdit({ author, onChange, onRemove }) {
  return (
    <Box display="grid" gridTemplateColumns="1fr 1fr auto" gap={1.5} alignItems="center" sx={{ mb: 1.5 }}>
      <TextField
        label="Last name" size="small"
        value={author.last_name ?? ''}
        onChange={(e) => onChange({ ...author, last_name: e.target.value || null })}
      />
      <TextField
        label="First name" size="small"
        value={author.first_name ?? ''}
        onChange={(e) => onChange({ ...author, first_name: e.target.value || null })}
      />
      <IconButton size="small" onClick={onRemove} color="error">
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}

function ReferenceEntryEdit({ item, index, onChange, onRemove, user }) {
  const f = (key, val) => onChange({ ...item, [key]: val });
  const authors = item.authors ?? [];
  const [looking, setLooking] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleLookupDoi = async () => {
    setLooking(true);
    try {
      const { status, body } = await lookupDoiV2(user, item.doi);
      if (status === 200 && body.reference) {
        const r = body.reference;
        onChange({
          ...item,
          title: r.title ?? item.title,
          authors: (r.authors && r.authors.length) ? r.authors : item.authors,
          year: r.year ?? item.year,
          journal: r.journal ?? item.journal,
          url: r.url ?? item.url,
        });
        enqueueSnackbar('Reference details filled from DOI', { variant: 'success' });
      } else {
        enqueueSnackbar(body.message || `DOI lookup failed (${status})`, { variant: 'error' });
      }
    } catch (err) {
      enqueueSnackbar(`DOI lookup error: ${err.message}`, { variant: 'error' });
    } finally {
      setLooking(false);
    }
  };
  const title = (() => {
    if (item.title) return item.title.slice(0, 60) + (item.title.length > 60 ? '…' : '');
    if (item.doi) return `DOI: ${item.doi}`;
    return `Reference ${index + 1}`;
  })();

  return (
    <Accordion defaultExpanded={index === 0}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', pr: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, flex: 1 }}>{title}</Typography>
          <IconButton size="small" color="error"
            onClick={(e) => { e.stopPropagation(); onRemove(); }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1.5}>
          <TextField
            label="Title" size="small" fullWidth multiline rows={2}
            value={item.title ?? ''}
            onChange={(e) => f('title', e.target.value || null)}
            sx={{ gridColumn: 'span 2' }}
          />
          <TextField
            label="Year" size="small" type="number"
            value={item.year ?? ''}
            onChange={(e) => f('year', e.target.value || null)}
          />
          <TextField
            label="Journal" size="small" fullWidth
            value={item.journal ?? ''}
            onChange={(e) => f('journal', e.target.value || null)}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              label="DOI" size="small" fullWidth
              value={item.doi ?? ''}
              onChange={(e) => f('doi', e.target.value || null)}
            />
            <Button
              size="small"
              variant="outlined"
              onClick={handleLookupDoi}
              disabled={looking || !item.doi}
              startIcon={looking ? <CircularProgress size={16} /> : null}
              sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}
            >
              Look up
            </Button>
          </Box>
          <TextField
            label="URL" size="small" fullWidth
            value={item.url ?? ''}
            onChange={(e) => f('url', e.target.value || null)}
          />
        </Box>

        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Authors</Typography>
        {authors.map((author, i) => (
          <AuthorEdit
            key={i} author={author}
            onChange={(updated) => f('authors', authors.map((a, idx) => idx === i ? updated : a))}
            onRemove={() => f('authors', authors.filter((_, idx) => idx !== i))}
          />
        ))}
        <Button size="small" startIcon={<AddIcon />}
          onClick={() => f('authors', [...authors, createEmptyAuthor()])} sx={{ mt: 0.5 }}>
          Add author
        </Button>
      </AccordionDetails>
    </Accordion>
  );
}

export default function ReferencesArrayEdit({ items, onChange, user }) {
  return (
    <Box>
      {items.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          No references.
        </Typography>
      )}
      {items.map((item, i) => (
        <ReferenceEntryEdit
          key={i} item={item} index={i} user={user}
          onChange={(updated) => onChange(items.map((x, idx) => idx === i ? updated : x))}
          onRemove={() => onChange(items.filter((_, idx) => idx !== i))}
        />
      ))}
      <Button variant="outlined" startIcon={<AddIcon />} sx={{ mt: 1 }}
        onClick={() => onChange([...items, createEmptyReference()])}>
        Add reference
      </Button>
    </Box>
  );
}
