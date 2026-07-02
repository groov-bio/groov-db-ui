import React, { useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  IconButton,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from 'notistack';

import SensorPageV2View from '../../../Sensor_Components/SensorPageV2View';
import {
  approveProcessedSensorV2,
  rejectProcessedSensorV2,
} from '../../../../lib/api/v2Admin';

export default function AdminProcessedSensorsV2({
  processed,
  user,
  onPromoted,
  onRejected,
}) {
  const [viewing, setViewing] = useState(null);
  const [actingUUID, setActingUUID] = useState(null);
  const [confirm, setConfirm] = useState(null); // { action: 'promote'|'reject', row }
  const { enqueueSnackbar } = useSnackbar();

  const rows = useMemo(() => {
    if (!processed) return [];
    return processed.map((p, idx) => {
      const proteins = p.data?.proteins ?? [];
      const aliases = proteins.map((x) => x.alias).filter(Boolean).join(', ');
      return {
        id: idx,
        submissionUUID: p.submissionUUID,
        category: p.category,
        type: p.data?.type ?? '—',
        aliases: aliases || '(no alias)',
        proteinCount: proteins.length,
        proposed_grv_id: p.proposed_grv_id ?? '—',
        isEdit: p.isEdit === true,
        editTargetGrvId: p.editTarget?.grv_id ?? null,
        data: p.data,
      };
    });
  }, [processed]);

  const doPromote = async (row) => {
    setActingUUID(row.submissionUUID);
    try {
      const { status, body } = await approveProcessedSensorV2(
        user,
        row.submissionUUID
      );
      switch (status) {
        case 200:
          enqueueSnackbar(
            `Promoted ${row.aliases} → ${body.grv_id}`,
            { variant: 'success', preventDuplicate: true }
          );
          onPromoted?.(row.submissionUUID);
          break;
        case 409:
          enqueueSnackbar(
            `Already promoted: ${row.aliases}`,
            { variant: 'warning', preventDuplicate: true }
          );
          onPromoted?.(row.submissionUUID);
          break;
        case 404:
          enqueueSnackbar(
            `Not found: ${row.submissionUUID.slice(0, 8)}`,
            { variant: 'error', preventDuplicate: true }
          );
          break;
        case 400:
          enqueueSnackbar(
            `Invalid: ${body.message || 'bad input'}`,
            { variant: 'error', preventDuplicate: true }
          );
          break;
        default:
          enqueueSnackbar(
            `Error promoting: ${body.message || 'HTTP ' + status}`,
            { variant: 'error', preventDuplicate: true }
          );
      }
    } catch (err) {
      enqueueSnackbar(`Network error: ${err.message}`, {
        variant: 'error',
        preventDuplicate: true,
      });
    } finally {
      setActingUUID(null);
      setConfirm(null);
    }
  };

  const doReject = async (row) => {
    setActingUUID(row.submissionUUID);
    try {
      const { status, body } = await rejectProcessedSensorV2(
        user,
        row.submissionUUID
      );
      if (status === 204) {
        enqueueSnackbar(
          `Rejected ${row.aliases} (${row.submissionUUID.slice(0, 8)})`,
          { variant: 'success', preventDuplicate: true }
        );
        onRejected?.(row.submissionUUID);
      } else if (status === 404) {
        enqueueSnackbar(
          `Already gone: ${row.submissionUUID.slice(0, 8)}`,
          { variant: 'info', preventDuplicate: true }
        );
        onRejected?.(row.submissionUUID);
      } else {
        enqueueSnackbar(
          `Error rejecting ${row.submissionUUID.slice(0, 8)}: ${
            body.message || `HTTP ${status}`
          }`,
          { variant: 'error', preventDuplicate: true }
        );
      }
    } catch (err) {
      enqueueSnackbar(`Network error: ${err.message}`, {
        variant: 'error',
        preventDuplicate: true,
      });
    } finally {
      setActingUUID(null);
      setConfirm(null);
    }
  };

  const columns = [
    {
      field: 'isEdit',
      headerName: 'Kind',
      width: 80,
      renderCell: (params) =>
        params.value ? (
          <Chip label="EDIT" color="warning" size="small" />
        ) : (
          <Chip label="NEW" color="info" size="small" variant="outlined" />
        ),
    },
    { field: 'type', headerName: 'Type', width: 140 },
    {
      field: 'aliases',
      headerName: 'Aliases / Target',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2">{params.value}</Typography>
          {params.row.editTargetGrvId && (
            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
              {params.row.editTargetGrvId}
            </Typography>
          )}
        </Box>
      ),
    },
    { field: 'proteinCount', headerName: 'Proteins', width: 100 },
    { field: 'proposed_grv_id', headerName: 'Proposed GRV ID', width: 160 },
    {
      field: 'submissionUUID',
      headerName: 'UUID',
      width: 110,
      renderCell: (params) => (
        <Box sx={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'text.secondary' }}>
          {params.value.slice(0, 8)}
        </Box>
      ),
    },
    {
      field: 'view',
      headerName: 'View',
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <Button variant="contained" size="small" onClick={() => setViewing(params.row)}>
          View
        </Button>
      ),
    },
    {
      field: 'promote',
      headerName: 'Promote',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="success"
          size="small"
          disabled={actingUUID === params.row.submissionUUID}
          onClick={() => setConfirm({ action: 'promote', row: params.row })}
        >
          Promote
        </Button>
      ),
    },
    {
      field: 'reject',
      headerName: 'Reject',
      width: 110,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          size="small"
          disabled={actingUUID === params.row.submissionUUID}
          onClick={() => setConfirm({ action: 'reject', row: params.row })}
        >
          Reject
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
          mb: 3,
          background: 'linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.05) 100%)',
        }}
      >
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 1 }}>
          V2 Processed Queue
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          <strong>EDIT</strong> rows are sensor edits submitted by users — approve to overwrite prod or reject to discard.
          <br />
          <strong>NEW</strong> rows are enriched new-sensor submissions — production promotion coming soon.
        </Typography>
      </Paper>

      <Box sx={{ height: 320, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          autoPageSize
          rowsPerPageOptions={[5, 10, 25]}
          density="compact"
          getRowId={(r) => r.submissionUUID}
          rowHeight={52}
        />
      </Box>

      {/* View dialog */}
      <Dialog
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle sx={{ pr: 6 }}>
          {viewing?.isEdit
            ? `Edit preview — ${viewing.editTargetGrvId}`
            : viewing?.aliases}
          <IconButton onClick={() => setViewing(null)} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {viewing && <SensorPageV2View sensor={viewing.data} hideEditButton />}
        </DialogContent>
      </Dialog>

      {/* Confirmation dialog */}
      <Dialog
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {confirm?.action === 'promote'
            ? 'Promote to production?'
            : 'Reject submission?'}
        </DialogTitle>
        <DialogContent dividers>
          {confirm && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2">
                <strong>Aliases:</strong> {confirm.row.aliases}
              </Typography>
              <Typography variant="body2">
                <strong>Type:</strong> {confirm.row.type}
              </Typography>
              <Typography variant="body2">
                <strong>Proposed GRV ID:</strong> {confirm.row.proposed_grv_id}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                {confirm.action === 'promote'
                  ? 'This will write the sensor to the live database and regenerate the public index and fingerprints.'
                  : 'This discards the processed row. The original raw submission is unaffected.'}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm(null)}>Cancel</Button>
          <Button
            variant="contained"
            color={confirm?.action === 'promote' ? 'success' : 'error'}
            disabled={actingUUID === confirm?.row?.submissionUUID}
            onClick={() => {
              if (confirm?.action === 'promote') {
                doPromote(confirm.row);
              } else {
                doReject(confirm.row);
              }
            }}
          >
            {confirm?.action === 'promote' ? 'Promote' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
