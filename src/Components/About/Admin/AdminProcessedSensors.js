import { React, useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Dialog,
  CircularProgress,
  DialogContent,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';

export default function AdminProcessedSensors({
  processedData,
  setViewSensorPage,
  user,
  handleSensorPromoted,
}) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [processedRows, setProcessedRows] = useState([]);

  const rejectSensor = (family, id) => {
    fetch('https://api.groov.bio/rejectProcessedSensor', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: user.cognitoUser
          .getSignInUserSession()
          .getIdToken()
          .getJwtToken(),
      },
      body: JSON.stringify({
        family: family,
        uniProtID: id,
      }),
    }).then((res) => {
      if (res.ok) {
        let removedArr = processedRows.filter((item) => item.uniProtID !== id);
        setProcessedRows(removedArr);
      }
    });
  };

  const promoteSensor = (family, id) => {
    fetch('https://api.groov.bio/approveProcessedSensor', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: user.cognitoUser
          .getSignInUserSession()
          .getIdToken()
          .getJwtToken(),
      },
      body: JSON.stringify({
        family: family,
        uniProtID: id,
      }),
    }).then((res) => {
      //Successfully pushed to prod & deleted from temp
      if (res.status === 200) {
        handleSensorPromoted(id);
        enqueueSnackbar(`Successfully pushed ${id} to production!`, {
          variant: 'success',
          preventDuplicate: true,
        });
      } else if (res.status === 202) {
        //Sensor promoted but not deleted from temp
        enqueueSnackbar(
          `Successfully pushed ${id} to production but something went wrong deleting temporary sensors. Check the database.`,
          { variant: 'warning', preventDuplicate: true }
        );
      } else {
        //Error
        enqueueSnackbar(
          `Error pushing ${id} to production. Please check logs.`,
          { variant: 'error', preventDuplicate: true }
        );
      }
    });
  };

  const processedColumns = [
    {
      field: 'id',
      headerName: 'Index',
      width: 100,
    },
    {
      field: 'family',
      headerName: 'Family',
      width: 200,
    },
    {
      field: 'alias',
      headerName: 'Alias',
      width: 200,
    },
    {
      field: 'uniProtID',
      headerName: 'Uni Prot ID',
      width: 200,
    },
    {
      field: 'view',
      headerName: 'View Sensor',
      width: 100,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            setViewSensorPage({
              open: true,
              data: {
                family: params.row.family,
                uniProtID: params.row.uniProtID,
              },
            });
          }}
        >
          {params.value}
        </Button>
      ),
    },
    {
      field: 'approve',
      headerName: 'Approve',
      width: 100,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="success"
          size="small"
          onClick={() => promoteSensor(params.row.family, params.row.uniProtID)}
        >
          {params.value}
        </Button>
      ),
    },
    {
      field: 'reject',
      headerName: 'Reject',
      width: 100,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => {
            rejectSensor(params.row.family, params.row.uniProtID);
          }}
        >
          {params.value}
        </Button>
      ),
    },
  ];

  useEffect(() => {
    const rowsToAdd = [];

    if (processedData) {
      for (let i = 0; i < processedData.length; i++) {
        rowsToAdd.push({
          id: i + 1,
          alias: processedData[i].alias,
          family: processedData[i].family,
          uniProtID: processedData[i].uniprotID,
          view: 'View',
          approve: 'Approve',
          reject: 'Reject',
        });
      }
    }

    setProcessedRows(rowsToAdd);
  }, [processedData]);

  return (
    <>
      <Grid item xs={8} mt={6}>
        <Typography variant="h5">Processed sensors pending review</Typography>
      </Grid>
      <Box
        sx={{
          height: 220,
          width: '70%',
          mt: 2,
        }}
      >
        <DataGrid
          rows={processedRows}
          columns={processedColumns}
          autoPageSize
          rowsPerPageOptions={[5]}
          density="compact"
        />
      </Box>
    </>
  );
}
