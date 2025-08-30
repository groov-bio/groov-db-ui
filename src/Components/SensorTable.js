import React, { useEffect, useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';

import SensorPage from './Sensor_Components/SensorPage.js';
import { useAllSensors } from '../queries/sensors.js';

import {
  Box,
  Grid,
  Typography,
  Skeleton,
  Button,
  Link as MuiLink
} from '@mui/material';
import {
  DataGrid,
} from '@mui/x-data-grid';

import useSensorStore from '../zustand/sensor.store.js';

import { getFirstTwoWords } from '../lib/utils.js';

export default function SensorTable(props) {
  const [rows, setRows] = useState([]);
  const [sensorRouteList, setSensorRouteList] = useState(null);
  const [loading, setLoading] = useState(false);

  const isAllSensors = props.family === 'all';

  // Use React Query for all sensors data
  const { data: allSensorsData = [], isLoading: allSensorsLoading } = useAllSensors();

  // access data from zustand store
  const setSensorTable = useSensorStore((context) => context.setSensorTable);
  const sensorTable = useSensorStore(
    (context) => isAllSensors ? [] : context.sensorTable[props.family.toLowerCase()]
  );


  // const scrollRef = useRef(null);

  useEffect(() => {
    if (!isAllSensors) {
      // Only fetch if the data isn't already loaded in the zustand store
      if (sensorTable.length === 0) {
        setLoading(true);
        fetch(
          'https://groov-api.com/indexes/' + props.family.toLowerCase() + '.json',
          {
            headers: {
              Accept: 'application/json',
            },
          }
        )
          .then((res) => res.json())
          .then((sensorData) => {
            setSensorTable(props.family.toLowerCase(), sensorData['data']);
          })
          .catch(() => {
            console.error('Error fetching sensor data');
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, [props.family, isAllSensors]);

  /* scroll function */
  // const executeScroll = () => {
  //   if (!scrollRef) return;
  //   // Get element coords from Ref
  //   const element =
  //     scrollRef.current.getBoundingClientRect().top + window.scrollY;

  //   window.scroll({
  //     top: element,
  //     behavior: 'smooth',
  //   });
  // };

  const getColumns = () => {
    const baseColumns = [
      { field: 'id', headerName: 'Index', width: 100 },
      {
        field: 'uniprot',
        headerName: 'Uniprot',
        width: 110,
        renderCell: (params) => (
          <MuiLink 
            component={Link}
            to={`/entry/${isAllSensors ? params.row.family : props.family}/${params.value}`} 
          >
            {params.value}
          </MuiLink>
        ),
      },
      { field: 'alias', headerName: 'Alias', width: 110 },
    ];

    if (isAllSensors) {
      baseColumns.push({ field: 'family', headerName: 'Family', width: 100 });
    }

    baseColumns.push(
      { field: 'ligand', headerName: 'Ligand', width: 200 },
      { field: 'accession', headerName: 'Accession', width: 150 },
      { field: 'organism', headerName: 'Organism', width: 200 }
    );

    return baseColumns;
  };

  const selectionPrompt = () => {
    return (
      <Box>
        <Grid container spacing={4} columns={12} mt={3} justifyContent="center">
          <Grid size={10} mb={6}>
            <Typography
              sx={{ fontSize: { xs: 22, md: 24 }, textAlign: 'center' }}
            >
              Please select a sensor
            </Typography>
          </Grid>
        </Grid>
      </Box>
    );
  };

  useEffect(() => {
    const rowsToAdd = [];
    const sensorRouteList = [];

    if (isAllSensors && allSensorsData.length > 0) {
      allSensorsData.forEach((sensor, index) => {
        const entry = {
          id: index,
          alias: sensor.alias,
          accession: sensor.accession,
          uniprot: sensor.uniprotID,
          organism: getFirstTwoWords(sensor.organism),
          ligand: sensor.ligands && sensor.ligands.length > 0
            ? sensor.ligands[0].name
            : 'None submitted',
          family: sensor.family,
        };
        rowsToAdd.push(entry);

        sensorRouteList.push(
          <Route
            key={index}
            path={`/entry/${sensor.family}/${sensor.uniprotID}`}
            element={
              <SensorPage
                sensorID={sensor.uniprotID}
                family={sensor.family}
                dimensions={props.dimensions}
                temp={false}
              />
            }
          />
        );
      });
    } else if (!isAllSensors && typeof sensorTable !== 'undefined') {
      let counter = 0;
      for (var reg in sensorTable) {
        var entry = {
          id: counter,
          alias: sensorTable[reg].alias,
          accession: sensorTable[reg].accession,
          uniprot: sensorTable[reg].uniprotID,
          organism: getFirstTwoWords(sensorTable[reg].organism),
          ligand: sensorTable[reg].ligands
            ? sensorTable[reg].ligands[0]
            : 'None submitted',
        };
        rowsToAdd.push(entry);

        sensorRouteList.push(
          <Route
            key={counter}
            path={`/entry/${props.family}/${sensorTable[reg].uniprotID}`}
            element={
              <SensorPage
                sensorID={sensorTable[reg].uniprotID}
                family={props.family}
                dimensions={props.dimensions}
                temp={false}
              />
            }
          />
        );

        counter += 1;
      }
    }
    
    setRows(rowsToAdd);
    setSensorRouteList(sensorRouteList);
  }, [sensorTable, allSensorsData, isAllSensors]);










  return (
    // Container
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      sx={{ minHeight: '100vh', mt: 4 }}
    >
      {/* Back to All Sensors Button - only show for family-specific views */}
      {/* {!isAllSensors && (
        <Box sx={{ mb: 3 }}>
          <Button 
            component={Link} 
            to="/database" 
            variant="outlined" 
            size="small"
          >
            ← Back to All Sensors
          </Button>
        </Box>
      )} */}

      {/* Family Name  */}
      {/* <Typography
        component="div"
        gutterBottom
        sx={{
          fontSize: { xs: 30, sm: 55 },
          fontWeight: 300,
        }}
      >
        {isAllSensors ? 'All Sensors' : props.family}
      </Typography> */}

      {/* Regulator Table  */}
      <Box
        sx={{
          height: {xs:500, md:600},
          width: { xs: '90%', sm: '75%', md: '60%' },
        }}
      >
        {(loading || (isAllSensors && allSensorsLoading)) ? (
          <Skeleton
            variant="rectangular"
            width="100%"
            height={400}
            animation="pulse"
          />
        ) : (
          <DataGrid
            key={isAllSensors ? 'all-sensors' : props.family}
            rows={rows}
            columns={getColumns()}
            pageSizeOptions={[10, 20, 30]}
            density="compact"
            sx={{fontSize: {xs:12, sm: 14}, paddingLeft:2 }}
            disableRowSelectionOnClick

            initialState={{
              pagination: { paginationModel: { pageSize: 20 } },
              columns: {
                columnVisibilityModel: {
                  // Hide these columns
                  id: false,
                },
              },
            }}
            showToolbar
            slotProps={{
              toolbar: {
                printOptions: { disableToolbarButton: true },
                csvOptions: { disableToolbarButton: true },
              },
            }}
          />
        )}
      </Box>

      {/* Sensor Page Placeholder  */}
      <Box
        sx={{
          width: '95%',
          mt: 2,
        }}
        // ref={scrollRef}
      >
        <Routes>
          <Route path="/" element={selectionPrompt()} />

          {sensorRouteList}
        </Routes>
      </Box>
    </Grid>
  );
}
