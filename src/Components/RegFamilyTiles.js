import React, { Fragment } from 'react';

import { Link, Route, Routes } from 'react-router-dom';

import SensorTable from './SensorTable.js';

import { Box, Paper, Grid, Typography, Button } from '@mui/material';

export default function RegFamilyTiles() {
  /* adjusts information displayed in table based on screen size width */
  const [dimensions, setDimensions] = React.useState({
    width: window.innerWidth,
  });

  React.useEffect(() => {
    function handleResize() {
      setDimensions({
        width: window.innerWidth,
      });
    }

    window.addEventListener('resize', handleResize);

    return (_) => {
      window.removeEventListener('resize', handleResize);
    };
  });

  const torender = [
    { image: '/TetR-family.png', family: 'TetR' },
    { image: '/LysR-family.png', family: 'LysR' },
    { image: '/AraC-family.png', family: 'AraC' },
    { image: '/MarR-family.png', family: 'MarR' },
    { image: '/LacI-family.png', family: 'LacI' },
    { image: '/GntR-family.png', family: 'GntR' },
    { image: '/LuxR-family.png', family: 'LuxR' },
    { image: '/IclR-family.png', family: 'IclR' },
    { image: '/Other-family.png', family: 'Other' },
  ];

  const allSensorsView = () => {
    return (
      <Box>
        <Grid container spacing={4} columns={12} mt={8} justifyContent="center">
          <Grid size={10} mb={6} position="relative">
            <Typography
              sx={{ fontSize: { xs: 22, md: 24 }, textAlign: 'center' }}
            >
              Browse all sensors or select a family below
            </Typography>
          </Grid>

          {/* "Download all sensors" pushed to the right */}
          <Grid
            size={5}
            container
            justifyContent="flex-end"
            alignItems="center"
          >
            <Button variant="outlined" href="/about/programmatic-access">
              Download all sensors
            </Button>
          </Grid>

          {/* "Add a sensor" stays on the left */}
          <Grid
            size={5}
            ml={5}
            container
            justifyContent="flex-start"
            alignItems="center"
          >
            <Button variant="outlined" href="/addSensor">
              Add a sensor
            </Button>
          </Grid>
        </Grid>
        
        <SensorTable family="all" dimensions={dimensions} />
      </Box>
    );
  };

  return (
    <Fragment>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          overflowX: 'scroll',
          '& > :not(style)': {
            m: 1,
            p: 1,
            width: { xs: 85, sm: 170 },
            height: { xs: 85, sm: 170 },
          },
        }}
      >
        {torender.map((item) => (
          <Paper key={item.family} elevation={4}>
            <Link to={`/database/${item.family}`}>
              <Box
                component="img"
                sx={{
                  width: { xs: 72, sm: 160 },
                }}
                src={item.image}
              />
            </Link>
          </Paper>
        ))}
      </Box>

      <Routes>
        <Route path="/" element={allSensorsView()} />

        {torender.map((item) => (
          <Route
            key={item}
            path={item.family + '/*'}
            element={
              <SensorTable family={item.family} dimensions={dimensions} />
            }
          />
        ))}
      </Routes>
    </Fragment>
  );
}
