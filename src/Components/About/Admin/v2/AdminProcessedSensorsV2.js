import React, { useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';

import SensorPageV2View from '../../../Sensor_Components/SensorPageV2View';

export default function AdminProcessedSensorsV2({ processed }) {
  const [viewing, setViewing] = useState(null);

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
        data: p.data,
      };
    });
  }, [processed]);

  const columns = [
    { field: 'category', headerName: 'Category', width: 110 },
    { field: 'type', headerName: 'Type', width: 140 },
    { field: 'aliases', headerName: 'Aliases', flex: 1, minWidth: 200 },
    { field: 'proteinCount', headerName: 'Proteins', width: 100 },
    { field: 'proposed_grv_id', headerName: 'Proposed GRV ID', width: 160 },
    {
      field: 'submissionUUID',
      headerName: 'UUID',
      width: 110,
      renderCell: (params) => (
        <Box
          sx={{
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            color: 'text.secondary',
          }}
        >
          {params.value.slice(0, 8)}
        </Box>
      ),
    },
    {
      field: 'view',
      headerName: 'View',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => setViewing(params.row)}
        >
          View
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
          background:
            'linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.05) 100%)',
        }}
      >
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 1 }}>
          V2 Processed (Pending Promotion)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          Review enrichment output before promoting to production.
        </Typography>
      </Paper>

      <Alert severity="info" sx={{ mb: 2 }}>
        Production promotion is not yet enabled for V2. These rows are
        read-only previews of <code>groov-temp-v2-processed</code>.
      </Alert>

      <Box sx={{ height: 320, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          autoPageSize
          rowsPerPageOptions={[5, 10, 25]}
          density="compact"
          getRowId={(r) => r.submissionUUID}
        />
      </Box>

      <Dialog
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle sx={{ pr: 6 }}>
          {viewing?.aliases}
          <IconButton
            onClick={() => setViewing(null)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {viewing && (
            <SensorPageV2View sensor={viewing.data} hideEditButton />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
