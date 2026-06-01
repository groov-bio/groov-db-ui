import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';

import {
  deleteSensorV2,
  fetchPublishedSensorsV2,
} from '../../../../lib/api/v2Admin';

export default function AdminPublishedSensorsV2({ user }) {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null); // row | null
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const loadSensors = useCallback(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchPublishedSensorsV2()
      .then(({ sensors: s }) => {
        if (cancelled) return;
        setSensors(s ?? []);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || 'Failed to load published sensors');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const cleanup = loadSensors();
    return cleanup;
  }, [loadSensors]);

  // index.json appends new sensors at the end; sort by GRV ID so rows slot in
  // by prefix/number (zero-padded IDs sort correctly as strings: A < D < G).
  const rows = sensors
    .map((s) => ({
      id: s.id,
      grv_id: s.id,
      alias: s.alias,
      uniprot_id: s.uniprot_id,
      organism_name: s.organism_name,
      category: s.category,
      ligands: (s.ligands || []).join(', ') || 'None',
    }))
    .sort((a, b) => a.grv_id.localeCompare(b.grv_id));

  const openDelete = (row) => {
    setDeleteTarget(row);
    setConfirmText('');
  };

  const closeDelete = () => {
    setDeleteTarget(null);
    setConfirmText('');
  };

  const doDelete = async () => {
    if (!deleteTarget) return;
    const row = deleteTarget;
    setDeleting(true);
    try {
      const { status, body } = await deleteSensorV2(user, row.category, row.grv_id);
      switch (status) {
        case 200:
          enqueueSnackbar(`Deleted ${row.grv_id}`, {
            variant: 'success',
            preventDuplicate: true,
          });
          setSensors((prev) => prev.filter((s) => s.id !== row.id));
          closeDelete();
          break;
        case 404:
          enqueueSnackbar(`Not found (already deleted?): ${row.grv_id}`, {
            variant: 'warning',
            preventDuplicate: true,
          });
          setSensors((prev) => prev.filter((s) => s.id !== row.id));
          closeDelete();
          break;
        case 400:
          enqueueSnackbar(`Invalid: ${body.message || 'bad input'}`, {
            variant: 'error',
            preventDuplicate: true,
          });
          break;
        default:
          enqueueSnackbar(
            `Error deleting ${row.grv_id}: ${body.message || 'HTTP ' + status}`,
            { variant: 'error', preventDuplicate: true }
          );
      }
    } catch (err) {
      enqueueSnackbar(`Network error: ${err.message}`, {
        variant: 'error',
        preventDuplicate: true,
      });
    } finally {
      setDeleting(false);
      setConfirmText('');
    }
  };

  const columns = [
    { field: 'grv_id', headerName: 'GRV ID', width: 140 },
    { field: 'alias', headerName: 'Alias', flex: 1, minWidth: 160 },
    { field: 'uniprot_id', headerName: 'UniProt ID', width: 120 },
    { field: 'organism_name', headerName: 'Organism', flex: 1, minWidth: 160 },
    { field: 'category', headerName: 'Category', width: 120 },
    { field: 'ligands', headerName: 'Ligands', flex: 1, minWidth: 160 },
    {
      field: 'delete',
      headerName: 'Delete',
      width: 110,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => openDelete(params.row)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
          mb: 3,
          background:
            'linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.05) 100%)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Box>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 1 }}>
              Published Sensors (Production)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              These sensors are live. Deletion is{' '}
              <strong>permanent and irreversible</strong> — it removes the
              production DynamoDB row, R2 sensor JSON, family + main indexes,
              and triggers a fingerprint rebuild.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            onClick={loadSensors}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
      </Paper>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <Box sx={{ height: 360, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            autoPageSize
            rowsPerPageOptions={[5, 10, 25]}
            density="compact"
            getRowId={(r) => r.id}
          />
        </Box>
      )}

      {/* Delete confirmation dialog */}
      <Dialog
        open={Boolean(deleteTarget)}
        onClose={closeDelete}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete sensor permanently?</DialogTitle>
        <DialogContent dividers>
          {deleteTarget && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography variant="body2">
                <strong>GRV ID:</strong> {deleteTarget.grv_id}
              </Typography>
              <Typography variant="body2">
                <strong>Alias:</strong> {deleteTarget.alias}
              </Typography>
              <Typography variant="body2">
                <strong>Category:</strong> {deleteTarget.category}
              </Typography>
              <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>
                This action <strong>cannot be undone</strong>. It will
                permanently remove:
              </Typography>
              <Box
                component="ul"
                sx={{ m: 0, pl: 2.5 }}
              >
                <Typography component="li" variant="body2">
                  Production DynamoDB row
                </Typography>
                <Typography component="li" variant="body2">
                  R2 sensor JSON
                </Typography>
                <Typography component="li" variant="body2">
                  Family index + main index entries
                </Typography>
                <Typography component="li" variant="body2">
                  Molecular fingerprints (rebuilt on next publish)
                </Typography>
              </Box>
              <TextField
                label={`Type ${deleteTarget.grv_id} to confirm`}
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                size="small"
                fullWidth
                sx={{ mt: 1 }}
                autoComplete="off"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDelete} disabled={deleting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={
              deleting ||
              confirmText.trim() !== (deleteTarget?.grv_id ?? '')
            }
            onClick={doDelete}
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
