import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { produce } from 'immer';
import {
  Box, Container, Typography, Button, Alert, CircularProgress,
  Paper, Stack, Chip, TextField, MenuItem, Select, FormControl, InputLabel,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import useUserStore from '../zustand/user.store';
import useSensorStore from '../zustand/sensor.store';
import { editSensorV2 } from '../lib/api/v2Admin';
import ProteinEditSection from './editSensorV2/ProteinEditSection';

const TYPE_OPTIONS = ['One Component', 'Two Component', 'Riboswitch'];

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

    fetch(`https://groov-api.com/v2/sensors/${categorySegment}/${id}.json`, {
      headers: { Accept: 'application/json' },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(load)
      .catch((err) => {
        setFetchError(err.message);
        setLoading(false);
      });
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
        Changes require admin approval before going live. Sensor ID, category, and protein UniProt IDs are read-only.
      </Alert>

      {/* Sensor-level fields */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Sensor Information</Typography>
        <Stack spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Type</InputLabel>
            <Select
              value={formData.type ?? ''}
              label="Type"
              onChange={(e) =>
                setFormData((prev) => produce(prev, (d) => { d.type = e.target.value; }))
              }
            >
              {TYPE_OPTIONS.map((opt) => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </Select>
          </FormControl>
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
