import { React, useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Dialog,
  CircularProgress,
  DialogContent,
  Container,
  Paper,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import TempSensor from '../TempSensor';
import useUserStore from '../../../zustand/user.store';
import ListIcon from '@mui/icons-material/List';
import PreviewIcon from '@mui/icons-material/Preview';

export default function AdminTempSensors({
  tempData,
  processedData,
  setApproveIsLoading,
  handleProcessedAdded,
}) {
  const [tempRows, setTempRows] = useState([]);
  const [tempIndex, setTempIndex] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const user = useUserStore((context) => context.user);

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  const TabPanel = ({ children, value, index }) => {
    return (
      <div hidden={value !== index}>
        {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
      </div>
    );
  };

  const tempColumns = [
    { field: 'id', headerName: 'Index', width: 100 },
    {
      field: 'alias',
      headerName: 'Alias',
      width: 300,
      renderCell: (params) => (
        <Button
          onClick={() => {
            // The database entries are 1 indexed, rather than 0 indexed.
            setTempIndex(params.id);
            setActiveTab(1); // Switch to preview tab
          }}
        >
          {params.value}
        </Button>
      ),
    },
    { field: 'user', headerName: 'User', width: 200 },
    { field: 'time_submitted', headerName: 'Time submitted', width: 200 },
    {
      field: 'approve',
      headerName: 'Approve for processing',
      width: 200,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => {
              approveEntry(params.row.callData);
            }}
            disabled={params.row.isDisabled}
          >
            {params.value}
          </Button>
        );
      },
    },
    {
      field: 'reject',
      headerName: 'Reject',
      width: 200,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => {
            rejectEntry(params.row.alias);
          }}
          disabled={params.row.isDisabled}
        >
          {params.value}
        </Button>
      ),
    },
  ];

  const checkMembership = (id) => {
    let matchFound = false;

    for (let i = 0; i < processedData?.length; i++) {
      let current = processedData[i];

      if (current.uniprotID === id) {
        matchFound = true;
        break;
      }
    }

    return matchFound;
  };

  const constructRows = (data) => {
    const rowsToReturn = [];

    for (let i = 0; i < data.length; i++) {
      let current = data[i];

      rowsToReturn.push({
        id: i,
        alias: current.SK,
        user: current.user,
        time_submitted: new Date(current.timeSubmit).toLocaleString(),
        approve: 'Approve',
        reject: 'Reject',
        callData: current,
        isDisabled: checkMembership(current.SK),
      });
    }

    return rowsToReturn;
  };

  const makeSnackbar = (message, type) => {
    enqueueSnackbar(message, {
      variant: type,
      preventDuplicate: true,
    });
  };

  useEffect(() => {
    if (tempData) {
      let result = constructRows(tempData);
      setTempRows(result);
    }
  }, [tempData]);

  const approveEntry = (callBody) => {
    const { PK, SK, ...rest } = callBody;
    const dataToSend = {
      family: callBody.family,
      uniProtID: SK,
      ...rest,
    };

    setApproveIsLoading(true);
    fetch('https://api.groov.bio/addNewSensor', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: user.cognitoUser
          .getSignInUserSession()
          .getIdToken()
          .getJwtToken(),
      },
      body: JSON.stringify(dataToSend),
    }).then((res) => {
      setApproveIsLoading(false);

      switch (res.status) {
        case 400:
          makeSnackbar(`Error - ${callBody.uniProtID} is invalid.`, 'error');
          break;
        case 409:
          makeSnackbar(
            `Error - ${callBody.uniProtID} already exists.`,
            'error'
          );
          break;
        case 500:
          res
            .json()
            .then((body) =>
              makeSnackbar(
                `Error - ${callBody.uniProtID} error on xref pipeline. Provided error: ${body}`,
                'error'
              )
            );
        case 202:
          handleProcessedAdded(
            callBody.uniProtID,
            callBody.family,
            callBody.about.alias
          );
          makeSnackbar(`Successfully created ${callBody.uniProtID}`, 'success');
      }
    });
  };

  const rejectEntry = (sensorId) => {
    fetch(`https://api.groov.bio/deleteTemp?sensorId=${sensorId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: user.cognitoUser
          .getSignInUserSession()
          .getIdToken()
          .getJwtToken(),
      },
    })
      .then((res) => {
        if (res.ok) {
          let copy = tempRows.filter(function (obj) {
            return obj.alias !== sensorId;
          });
          setTempRows(copy);
          enqueueSnackbar(
            `Successfully rejected sensor ${sensorId}, please let the end user know.`,
            { variant: 'success', preventDuplicate: true }
          );
        } else {
          enqueueSnackbar('Error on rejecting sensor from API, check logs.', {
            variant: 'error',
            preventDuplicate: true,
          });
        }
      })
      .catch((err) => {
        enqueueSnackbar('Error on rejecting sensor from API, check logs.', {
          variant: 'error',
          preventDuplicate: true,
        });
      });
  };

  return (
    <Box sx={{ mt: 4 }}>
      {/* Header Section */}
      <Paper sx={{ p: 3, borderRadius: 2, mb: 3, background: 'linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.05) 100%)' }}>
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 600,
            mb: 1,
          }}
        >
          Submitted Data Pending Review
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ lineHeight: 1.6 }}
        >
          Review and approve submitted sensor data for processing
        </Typography>
      </Paper>

      {/* Tabs Section */}
      <Paper sx={{ borderRadius: 2 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant={isMobile ? 'scrollable' : 'fullWidth'}
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<ListIcon />} label="Sensor List" />
          <Tab icon={<PreviewIcon />} label="Sensor Preview" disabled={tempIndex === null} />
        </Tabs>
        
        {/* Tab 0: Sensor List */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ p: 3 }}>
            <Box
              sx={{
                height: 400,
                width: '100%',
              }}
            >
              <DataGrid
                rows={tempRows}
                columns={tempColumns}
                autoPageSize
                rowsPerPageOptions={[5, 10, 25]}
                density="compact"
                sx={{ 
                  '& .MuiDataGrid-root': {
                    border: 'none',
                  }
                }}
              />
            </Box>
          </Box>
        </TabPanel>
        
        {/* Tab 1: Sensor Preview */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ p: 3 }}>
            {tempIndex !== null ? (
              <TempSensor data={tempData[tempIndex]} />
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  Select a sensor from the list to preview
                </Typography>
              </Box>
            )}
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
}
