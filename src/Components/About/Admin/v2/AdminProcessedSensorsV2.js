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
  IconButton,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from 'notistack';

import SensorPageV2View from '../../../Sensor_Components/SensorPageV2View';
import { approveProcessedSensorV2, rejectProcessedSensorV2 } from '../../../../lib/api/v2Admin';

export default function AdminProcessedSensorsV2({
  user,
  processed,
  onApproved,
  onRejected,
}) {
  const [viewing, setViewing] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const rows = useMemo(() => {
    if (!processed) return [];
    return processed.map((p, idx) => {
      const proteins = p.data?.proteins ?? [];
      const aliases = proteins.map((x) => x.alias).filter(Boolean).join(', ');
      return {
        id: idx,
        submissionUUID: p.submissionUUID,
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

  const approveRow = async (row) => {
    try {
      const { status, body } = await approveProcessedSensorV2(user, row.submissionUUID);
      if (status === 200) {
        enqueueSnackbar(
          `Approved edit for ${row.editTargetGrvId ?? row.submissionUUID.slice(0, 8)}`,
          { variant: 'success', preventDuplicate: true }
        );
        onApproved?.(row.submissionUUID);
      } else {
        enqueueSnackbar(
          `Error approving: ${body.message || `HTTP ${status}`}`,
          { variant: 'error', preventDuplicate: true }
        );
      }
    } catch (err) {
      enqueueSnackbar(`Network error: ${err.message}`, { variant: 'error', preventDuplicate: true });
    }
  };

  const rejectRow = async (row) => {
    try {
      const { status, body } = await rejectProcessedSensorV2(user, row.submissionUUID);
      if (status === 200 || status === 204) {
        enqueueSnackbar(
          `Rejected edit for ${row.editTargetGrvId ?? row.submissionUUID.slice(0, 8)}`,
          { variant: 'success', preventDuplicate: true }
        );
        onRejected?.(row.submissionUUID);
      } else if (status === 404) {
        enqueueSnackbar('Already gone', { variant: 'info', preventDuplicate: true });
        onRejected?.(row.submissionUUID);
      } else {
        enqueueSnackbar(
          `Error rejecting: ${body.message || `HTTP ${status}`}`,
          { variant: 'error', preventDuplicate: true }
        );
      }
    } catch (err) {
      enqueueSnackbar(`Network error: ${err.message}`, { variant: 'error', preventDuplicate: true });
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
      field: 'approve',
      headerName: 'Approve',
      width: 110,
      sortable: false,
      renderCell: (params) =>
        params.row.isEdit ? (
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => approveRow(params.row)}
          >
            Approve
          </Button>
        ) : null,
    },
    {
      field: 'reject',
      headerName: 'Reject',
      width: 90,
      sortable: false,
      renderCell: (params) =>
        params.row.isEdit ? (
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => rejectRow(params.row)}
          >
            Reject
          </Button>
        ) : null,
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

      <Box sx={{ height: 360, width: '100%' }}>
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

      <Dialog open={Boolean(viewing)} onClose={() => setViewing(null)} fullWidth maxWidth="lg">
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
    </Box>
  );
}
