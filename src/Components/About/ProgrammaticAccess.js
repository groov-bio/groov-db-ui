import React from 'react';

import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import DownloadAllSensors from './DownloadAllSensors.js';

export default function ProgrammaticAccess() {
  return (
    <Box
      sx={{
        marginLeft: { xs: '10vw', sm: '35vw', md: '30vw' },
        marginRight: { xs: '10vw', sm: '5vw', md: '15vw' },
      }}
    >
      <Typography
        sx={{ fontSize: { xs: 24, sm: 28, md: 32 } }}
        fontWeight="300"
        gutterBottom
      >
        Programmatic access
      </Typography>
      <Typography sx={{ fontSize: { xs: 14, sm: 16, md: 18 }, mb: 6 }}>
        Besides this website, data within groov<sup>DB</sup> can be accessed in
        two ways.
      </Typography>

      <Typography
        sx={{ fontSize: { xs: 18, sm: 24, md: 28 } }}
        fontWeight="300"
        gutterBottom
      >
        <b>Download all sensors</b>
      </Typography>
      <DownloadAllSensors />
      <Typography sx={{ fontSize: { xs: 14, sm: 16, md: 18 }, mt: 2, mb: 4 }}>
        All sensor data can be downloaded as a single JSON file via the link
        above. As of May 2025, the file is 2.1 MB.
      </Typography>

      <Typography
        sx={{ fontSize: { xs: 18, sm: 24, md: 28 } }}
        fontWeight="300"
        gutterBottom
      >
        <b>REST API</b>
      </Typography>
      <a href={'https://api.groov.bio/swagger'} target="__blank">
        https://api.groov.bio/swagger
      </a>
      <Typography sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }}>
        Subsets of the database can be accessed via our REST API. Full
        documentation on API endpoints and path parameters are detailed in the
        Swagger page linked above. The main endpoints are <b>/search</b>, for
        text-based queries, <b>/getPages</b>, to retrieve all sensors within a
        specific family, and <b>/getSensor</b>, to retrieve all information on a
        specific sensor entry.
      </Typography>

      {/* <Typography sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }} mt={3}>
        <b>Submit a new biosensor</b>
      </Typography> */}
    </Box>
  );
}
