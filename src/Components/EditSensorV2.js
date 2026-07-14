import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { produce } from 'immer';
import {
  Box, Container, Typography, Button, Alert, CircularProgress,
  Paper, Stack, Chip, TextField,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import useUserStore from '../zustand/user.store';
import useSensorStore from '../zustand/sensor.store';
import { editSensorV2 } from '../lib/api/v2Admin';
import ProteinEditSection from './editSensorV2/ProteinEditSection';
import { STATIC_BASE } from '../lib/config';

// Same mapping as SensorPageV2.js — keep in sync.
const ID_PREFIX_TO_CATEGORY = {
  T: 'tetr', X: 'luxr', Y: 'lysr', A: 'arac',
  M: 'marr', L: 'laci', G: 'gntr', I: 'iclr', Z: 'other', D: 'dual',
};

function getCategorySegment(id) {
  const match = id?.match(/^GRV-([A-Z]+)/);
  if (!match) return null;
  return ID_PREFIX_TO_CATEGORY[match[1]] ?? null;
}

/**
 * Normalize stimulus entries to always use stimulusType internally.
 * Adds _stimKey metadata to each entry so we know which key to restore on submit.
 */
function normalizeStimulusKeys(data) {
  return produce(data, (draft) => {
    (draft.proteins ?? []).forEach((protein) => {
      (protein.stimulus ?? []).forEach((stim) => {
        if ('stimulus_type' in stim && !('stimulusType' in stim)) {
          stim._stimKey = 'stimulus_type';
          stim.stimulusType = stim.stimulus_type;
          delete stim.stimulus_type;
        } else {
          stim._stimKey = 'stimulusType';
        }
      });
    });
  });
}

/**
 * Before submission: restore original stimulus key and strip _stimKey metadata.
 */
function denormalizeStimulusKeys(data) {
  return produce(data, (draft) => {
    (draft.proteins ?? []).forEach((protein) => {
      (protein.stimulus ?? []).forEach((stim) => {
        const originalKey = stim._stimKey ?? 'stimulusType';
        delete stim._stimKey;
        if (originalKey === 'stimulus_type' && 'stimulusType' in stim) {
          stim.stimulus_type = stim.stimulusType;
          delete stim.stimulusType;
        }
      });
    });
  });
}

export default function EditSensorV2() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const user = useUserStore((s) => s.user);
  const cachedData = useSensorStore((s) => s.v2SensorData[id]);

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;

    const load = (data) => {
      // `references[].interaction[]` is deprecated dead data (no longer rendered
      // or editable). Load it untouched so the rich legacy objects round-trip
      // byte-for-byte through the form model and outgoing payload — never
      // rewriting it means it can't surface as a spurious change in the edit diff.
      setFormData(normalizeStimulusKeys(data));
      setLoading(false);
    };

    if (cachedData) {
      load(cachedData);
      return;
    }

    const categorySegment = getCategorySegment(id);
    if (!categorySegment) {
      setFetchError(`Cannot determine category for sensor ID: ${id}`);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const url = `${STATIC_BASE}/v2/sensors/${categorySegment}/${id}.json`;
    const MAX_ATTEMPTS = 3;
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const fetchWithRetry = async () => {
      let lastError;
      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
        try {
          const res = await fetch(url, { headers: { Accept: 'application/json' } });
          // Don't retry client errors (e.g. 404) — the sensor genuinely isn't there.
          if (res.status >= 400 && res.status < 500) {
            throw new Error(`HTTP ${res.status}`);
          }
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        } catch (err) {
          lastError = err;
          const isClientError = /^HTTP 4\d\d$/.test(err.message);
          if (isClientError || attempt === MAX_ATTEMPTS) throw err;
          await delay(500 * attempt); // linear backoff: 500ms, 1000ms
        }
      }
      throw lastError;
    };

    fetchWithRetry()
      .then((data) => {
        if (!cancelled) load(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setFetchError(err.message);
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [id, cachedData]);

  const handleProteinChange = (pi, updatedProtein) => {
    setFormData((prev) => produce(prev, (draft) => {
      draft.proteins[pi] = updatedProtein;
    }));
  };

  const handleSubmit = async () => {
    if (!user || !formData) return;
    setSubmitting(true);

    const dataToSubmit = denormalizeStimulusKeys(formData);

    try {
      const { status, body } = await editSensorV2(user, {
        category: formData.category,
        grv_id: formData.id,
        data: dataToSubmit,
      });

      if (status === 202) {
        setSubmitSuccess(true);
      } else if (status === 400) {
        const msg = Array.isArray(body.errors)
          ? body.errors.join(', ')
          : body.message || 'Validation error';
        enqueueSnackbar(`Validation error: ${msg}`, { variant: 'error' });
      } else if (status === 404) {
        enqueueSnackbar(body.message || 'Sensor not found', { variant: 'error' });
      } else if (status === 401) {
        enqueueSnackbar('Authentication required. Please sign in again.', { variant: 'error' });
      } else {
        enqueueSnackbar(body.message || `Unexpected error (HTTP ${status})`, { variant: 'error' });
      }
    } catch (err) {
      enqueueSnackbar(`Network error: ${err.message}`, { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 6, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading sensor data…</Typography>
      </Container>
    );
  }

  if (fetchError) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">{fetchError}</Alert>
        <Button sx={{ mt: 2 }} onClick={() => navigate(-1)}>Go back</Button>
      </Container>
    );
  }

  if (submitSuccess) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>Edit submitted for admin review</Typography>
          <Typography variant="body2">
            Your changes to {formData.id} are pending approval. They will appear on the public site once an admin reviews them.
          </Typography>
        </Alert>
        <Button variant="outlined" onClick={() => navigate(`/sensor/${id}`)}>
          Return to sensor page
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 400, mb: 1 }}>
        Edit Sensor
      </Typography>

      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
        <Chip label={`ID: ${formData.id}`} variant="outlined" size="small" sx={{ fontFamily: 'monospace' }} />
        <Chip label={`Category: ${formData.category}`} variant="outlined" size="small" />
      </Stack>

      <Alert severity="info" sx={{ mb: 3 }}>
        Changes require admin approval before going live. You can edit About, Alias, Regulation type, Stimulus, DNA binding, and References. Sensor identity fields are read-only: ID, category, Type, and each protein's UniProt ID, RefSeq ID, Family, KEGG ID, sequence, origin, and mutations — changing those means creating a new sensor.
      </Alert>

      {/* Sensor-level fields */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Sensor Information</Typography>
        <Stack spacing={2}>
          <TextField
            label="Type"
            value={formData.type ?? ''}
            InputProps={{ readOnly: true }}
            disabled
            size="small"
            fullWidth
          />
          <TextField
            label="About"
            multiline
            rows={4}
            fullWidth
            size="small"
            value={formData.about ?? ''}
            onChange={(e) =>
              setFormData((prev) => produce(prev, (d) => { d.about = e.target.value || null; }))
            }
          />
        </Stack>
      </Paper>

      {/* Per-protein sections */}
      {(formData.proteins ?? []).map((protein, pi) => (
        <ProteinEditSection
          key={protein.uniprot_id ?? pi}
          protein={protein}
          proteinIndex={pi}
          family={formData.category}
          user={user}
          onChange={(updated) => handleProteinChange(pi, updated)}
        />
      ))}

      <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={() => navigate(`/sensor/${id}`)}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {submitting ? 'Submitting…' : 'Submit for Review'}
        </Button>
      </Box>
    </Container>
  );
}
