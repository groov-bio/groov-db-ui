import React, { useEffect, useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';

import SensorPage from './Sensor_Components/SensorPage.js';

import {
  Box,
  Grid,
  Typography,
  Skeleton,
  Tooltip,
  Badge
} from '@mui/material';

import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import {
  DataGrid,
  Toolbar,
  ToolbarButton,
  ColumnsPanelTrigger,
  FilterPanelTrigger,
} from '@mui/x-data-grid';

import useSensorStore from '../zustand/sensor.store.js';

import { getFirstTwoWords } from '../lib/utils.js';

export default function SensorTable(props) {
  const [rows, setRows] = useState([]);
  const [sensorRouteList, setSensorRouteList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allSensorsData, setAllSensorsData] = useState([]);

  const isAllSensors = props.family === 'all';

  // access data from zustand store
  const setSensorTable = useSensorStore((context) => context.setSensorTable);
  const sensorTable = useSensorStore(
    (context) => isAllSensors ? [] : context.sensorTable[props.family.toLowerCase()]
  );


  // const scrollRef = useRef(null);

  useEffect(() => {
    if (isAllSensors) {
      // Fetch all sensors data
      if (allSensorsData.length === 0) {
        setLoading(true);
        fetch('https://groov-api.com/all-sensors.json', {
          headers: {
            Accept: 'application/json',
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setAllSensorsData(data.sensors || []);
          })
          .catch((error) => {
            console.error('Error fetching all sensors data:', error);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } else {
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
          .catch((error) => {
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
          <Link 
            to={`/entry/${isAllSensors ? params.row.family : props.family}/${params.value}`} 
          >
            {params.value}
          </Link>
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
        <Grid container spacing={4} columns={12} mt={8} justifyContent="center">
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






  function CustomToolbar() {
  
    return (
      <Toolbar>
  
        <Tooltip title="Columns">
          <ColumnsPanelTrigger render={<ToolbarButton />}>
            <ViewColumnIcon />
          </ColumnsPanelTrigger>
        </Tooltip>
  
        <Tooltip title="Filters">
          <FilterPanelTrigger
            render={(props, state) => (
              <ToolbarButton {...props} color="default">
                <Badge badgeContent={state.filterCount} color="primary" variant="dot">
                  <FilterListIcon />
                </Badge>
              </ToolbarButton>
            )}
          />
        </Tooltip>
      </Toolbar>
    );
  }






  return (
    // Container
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      sx={{ minHeight: '100vh', mt: 5 }}
    >
      {/* Family Name  */}
      <Typography
        component="div"
        gutterBottom
        sx={{
          fontSize: { xs: 30, sm: 55 },
          fontWeight: 300,
        }}
      >
        {isAllSensors ? 'All Sensors' : props.family}
      </Typography>

      {/* Regulator Table  */}
      <Box
        sx={{
          height: 460,
          width: { xs: '90%', sm: '80%', md: isAllSensors ? '80%' : '60%' },
        }}
      >
        {loading ? (
          <Skeleton
            variant="rectangular"
            width="100%"
            height={460}
            animation="pulse"
          />
        ) : (
          <DataGrid
            rows={rows}
            columns={getColumns()}
            autoHeight={true}
            pageSizeOptions={[10, 20, 30]}
            density="compact"
            sx={{fontSize: {xs:12, sm: 14}, paddingLeft:2 }}

            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
              columns: {
                columnVisibilityModel: {
                  // Hide these columns
                  id: false,
                },
              },
            }}
            slots={{ toolbar: CustomToolbar }}
            showToolbar
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
