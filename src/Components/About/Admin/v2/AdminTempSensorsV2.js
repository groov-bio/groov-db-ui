import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import ListIcon from '@mui/icons-material/List';
import PreviewIcon from '@mui/icons-material/Preview';

import TempSensorPreviewV2 from './TempSensorPreviewV2';
import { addNewSensorV2, deleteTempV2 } from '../../../../lib/api/v2Admin';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export default function AdminTempSensorsV2({
  user,
  submissions,
  processedUUIDs,
  onApproved,
  onRejected,
  setApproveIsLoading,
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [previewIndex, setPreviewIndex] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // If the previewed row gets removed from underneath us, drop the preview.
  useEffect(() => {
    if (previewIndex !== null && previewIndex >= (submissions?.length ?? 0)) {
      setPreviewIndex(null);
      if (activeTab === 1) setActiveTab(0);
    }
  }, [submissions, previewIndex, activeTab]);

  const rows = useMemo(() => {
    if (!submissions) return [];
    return submissions.map((s, idx) => {
      const proteins = s.sensor?.proteins ?? [];
      const aliases = proteins.map((p) => p.alias).filter(Boolean).join(', ');
      return {
        id: idx,
        submissionUUID: s.submissionUUID,
        aliases: aliases || '(no alias)',
        proteinCount: proteins.length,
        user: s.user ?? '—',
        timeSubmit: s.timeSubmit
          ? new Date(s.timeSubmit).toLocaleString()
          : '—',
        alreadyProcessed: processedUUIDs.has(s.submissionUUID),
      };
    });
  }, [submissions, processedUUIDs]);

  const approveRow = async (row) => {
    setApproveIsLoading(true);
    try {
      const { status, body } = await addNewSensorV2(user, row.submissionUUID);
      switch (status) {
        case 202:
          enqueueSnackbar(
            `Processed ${row.aliases} (${row.submissionUUID.slice(0, 8)})`,
            { variant: 'success', preventDuplicate: true }
          );
          onApproved?.(row.submissionUUID);
          break;
        case 409:
          enqueueSnackbar(
            `Already processed: ${row.submissionUUID.slice(0, 8)}`,
            { variant: 'warning', preventDuplicate: true }
          );
          onApproved?.(row.submissionUUID);
          break;
        case 404:
          enqueueSnackbar(
            `Submission not found: ${row.submissionUUID.slice(0, 8)}`,
            { variant: 'error', preventDuplicate: true }
          );
          break;
        case 400:
          enqueueSnackbar(
            `Validation error: ${body.message || 'invalid submission'}`,
            { variant: 'error', preventDuplicate: true }
          );
          break;
        case 503:
          // API Gateway timed out, but the Lambda is still running. The
          // processed row will appear once enrichment finishes — refresh in
          // a few minutes.
          enqueueSnackbar(
            `${row.submissionUUID.slice(0, 8)} is still processing in the background — check back in a few minutes and refresh.`,
            { variant: 'info', preventDuplicate: true, autoHideDuration: 8000 }
          );
          break;
        default:
          enqueueSnackbar(
            `Error processing ${row.submissionUUID.slice(0, 8)}: ${
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
      setApproveIsLoading(false);
    }
  };

  const rejectRow = async (row) => {
    try {
      const { status, body } = await deleteTempV2(user, row.submissionUUID);
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
    }
  };

  const columns = [
    {
      field: 'aliases',
      headerName: 'Aliases',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Button
          onClick={() => {
            setPreviewIndex(params.row.id);
            setActiveTab(1);
          }}
        >
          {params.value}
        </Button>
      ),
    },
    { field: 'proteinCount', headerName: 'Proteins', width: 100 },
    { field: 'user', headerName: 'User', width: 180 },
    { field: 'timeSubmit', headerName: 'Submitted', width: 200 },
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
      field: 'approve',
      headerName: 'Approve',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="success"
          size="small"
          disabled={params.row.alreadyProcessed}
          onClick={() => approveRow(params.row)}
        >
          {params.row.alreadyProcessed ? 'Processed' : 'Approve'}
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
          onClick={() => rejectRow(params.row)}
        >
          Reject
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ mt: 4 }}>
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
          V2 Submissions Pending Review
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          Approve to run UniProt/PDB/KEGG/operon enrichment. Approved
          submissions land in <code>groov-temp-v2-processed</code>.
        </Typography>
      </Paper>

      <Paper sx={{ borderRadius: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          variant={isMobile ? 'scrollable' : 'fullWidth'}
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<ListIcon />} label="Submission List" />
          <Tab
            icon={<PreviewIcon />}
            label="Preview"
            disabled={previewIndex === null}
          />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                autoPageSize
                rowsPerPageOptions={[5, 10, 25]}
                density="compact"
                getRowId={(r) => r.submissionUUID}
              />
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Box sx={{ p: 3 }}>
            {previewIndex !== null && submissions?.[previewIndex] ? (
              <TempSensorPreviewV2 submission={submissions[previewIndex]} />
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  Select a submission to preview
                </Typography>
              </Box>
            )}
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
}
