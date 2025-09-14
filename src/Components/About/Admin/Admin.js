import { React, useEffect, useState } from 'react';

import {
  Typography,
  Dialog,
  CircularProgress,
  DialogContent,
  Container,
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
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{ 
            fontSize: { xs: 30, sm: 36, md: 48 },
            fontWeight: 300,
            textAlign: 'center',
            mb: 6,
            mt: 4
          }}
          id="admin-page-header"
        >
          Administrator page
        </Typography>
        
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
      </Container>
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
            isAdmin={true}
            user={user}
            family={viewSensorPage.data.family}
            uniprotID={viewSensorPage.data.uniProtID}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
