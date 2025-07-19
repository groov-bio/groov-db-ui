import { React, useEffect, useState } from 'react';

import {
  Box,
  Grid,
  Typography,
  Dialog,
  CircularProgress,
  DialogContent,
} from '@mui/material';

import '@aws-amplify/ui-react/styles.css';
import AdminTempSensors from './AdminTempSensors';
import AdminProcessedSensors from './AdminProcessedSensors';
import SensorPage from '../../Sensor_Components/SensorPage';
import useUserStore from './../../../zustand/user.store';

export default function Admin() {
  const [tempData, setTempData] = useState();
  const [processedData, setProcessedData] = useState();
  const [viewSensorPage, setViewSensorPage] = useState({
    open: false,
    data: {
      family: null,
      uniProtID: null,
    },
  });

  const [approveIsLoading, setApproveIsLoading] = useState(false);

  const user = useUserStore((context) => context.user);

  useEffect(() => {
    //Fetch data
    fetch('https://api.groov.bio/getAllTempSensors', {
      headers: {
        Accept: 'application/json',
        Authorization: user.cognitoUser
          .getSignInUserSession()
          .getIdToken()
          .getJwtToken(),
      },
    })
      .then((res) => res.json())
      .then((sensorData) => {
        setTempData(sensorData);
      });

    //Processed sensors
    fetch('https://api.groov.bio/getAllProcessedTemp', {
      headers: {
        Accept: 'application/json',
        Authorization: user.cognitoUser
          .getSignInUserSession()
          .getIdToken()
          .getJwtToken(),
      },
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then((processedData) => {
        if (processedData) {
          setProcessedData(processedData);
        }
      });
  }, []);

  const handleSensorClose = () => {
    setViewSensorPage({
      open: false,
      data: {
        family: null,
        uniProtID: null,
      },
    });
  };

  const handleSensorPromoted = (id) => {
    //Remove from tempCopy
    let tempCopy = tempData.filter((item) => item.SK !== id);
    setTempData(tempCopy);

    //Remove from processed
    let processedCopy = tempData.filter((item) => item.SK !== id);
    setProcessedData(processedCopy);
  };

  const handleProcessedAdded = (id, family, alias) => {
    let objToAdd = {
      PK: family,
      SK: `${id}#ABOUT`,
      alias: alias,
      family: family,
      uniprotID: id,
    };

    if (processedData) {
      let processedCopy = [...processedData];
      processedCopy.push(objToAdd);
      setProcessedData(processedCopy);
    } else {
      setProcessedData([objToAdd]);
    }
  };

  return (
    <>
      <Box>
        <Grid container spacing={4} columns={12} mb={8} justifyContent="center">
          <Grid item xs={10} mb={2} mt={10}>
            <Typography
              sx={{ fontSize: { xs: 30, sm: 36, md: 48 } }}
              fontWeight="300"
              textAlign="center"
            >
              {' '}
              Administrator page
            </Typography>
          </Grid>
          <AdminProcessedSensors
            processedData={processedData}
            setViewSensorPage={setViewSensorPage}
            user={user}
            handleSensorPromoted={handleSensorPromoted}
          />
          <AdminTempSensors
            tempData={tempData}
            processedData={processedData}
            setApproveIsLoading={setApproveIsLoading}
            handleProcessedAdded={handleProcessedAdded}
          />
        </Grid>
      </Box>
      <Dialog open={approveIsLoading}>
        <DialogContent>
          <CircularProgress />
          <Typography>Awaiting response from API...</Typography>
        </DialogContent>
      </Dialog>
      <Dialog
        open={viewSensorPage?.open}
        onClose={handleSensorClose}
        fullWidth
        maxWidth="lg"
      >
        <DialogContent>
          <SensorPage
            family={viewSensorPage.data.family}
            sensorID={viewSensorPage.data.uniProtID}
            isAdmin={true}
            user={user}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
