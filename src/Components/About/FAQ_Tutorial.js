import React from 'react';

import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default function FAQ_Tutorial() {
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
        Frequently asked questions
      </Typography>

      <Typography
        sx={{
          fontSize: { xs: 18, sm: 20, md: 24 },
          mt: 5,
          fontWeight: 500,
        }}
      >
        How can I add my sensor to this database?
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: 14, sm: 16, md: 18 },
          mt: 1,
        }}
      >
        Please submit your sensor via our
        <a
          href="https://groov.bio/addSensor"
          style={{ textDecoration: 'None' }}
        >
          {' '}
          submission form.{' '}
        </a>
        You will first be prompted to login if you haven't already.
      </Typography>

      <Typography
        sx={{
          fontSize: { xs: 18, sm: 20, md: 24 },
          mt: 5,
          fontWeight: 500,
        }}
      >
        I have a <i>lot</i> of data to submit... do I have to use the form?
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: 14, sm: 16, md: 18 },
          mt: 1,
        }}
      >
        We'll happily accept it! Please
        <a
          href="https://groov.bio/about/contact"
          style={{ textDecoration: 'None' }}
        >
          {' '}
          contact us{' '}
        </a>
        for help with automating large submissions.
      </Typography>

      <Typography
        sx={{
          fontSize: { xs: 18, sm: 20, md: 24 },
          mt: 5,
          fontWeight: 500,
        }}
      >
        My method for DNA / ligand interaction is not listed. How can I add it?
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: 14, sm: 16, md: 18 },
          mt: 1,
        }}
      >
        Currently accepted methods for interaction evidence are listed
        <a
          href="https://groov.bio/about/about-groovdb"
          style={{ textDecoration: 'None' }}
        >
          {' '}
          here.{' '}
        </a>
        However, we'd be happy to consider other methods that also provide
        confident interaction evidence. Please
        <a
          href="https://groov.bio/about/contact"
          style={{ textDecoration: 'None' }}
        >
          {' '}
          contact us{' '}
        </a>
        to add it to our accepted methods list.
      </Typography>

      <Typography
        sx={{
          fontSize: { xs: 18, sm: 20, md: 24 },
          mt: 5,
          fontWeight: 500,
        }}
      >
        Does this database include riboswitches or two component systems?
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: 14, sm: 16, md: 18 },
          mt: 1,
        }}
      >
        Not currently. Only one-component transcription factors (repressors and
        activators) are supported. However, we would consider adding support for
        other biosensor types if there is enough interest. If you would like to
        see this feature added, please
        <a
          href="https://groov.bio/about/contact"
          style={{ textDecoration: 'None' }}
        >
          {' '}
          let us know.
        </a>
      </Typography>

      {/* <Typography sx={{ 
        fontSize: { xs: 18, sm: 20, md: 24 }, mt: 5, fontWeight: 500,
         }}>
        How can I <i>use</i> data here to create a ligand-inducible biosensor plasmid?
      </Typography>
      <Typography sx={{ 
        fontSize: { xs: 14, sm: 16, md: 18 }, mt: 1
         }}>
        Please see our tutorial below!
      </Typography> */}

      {/* <Typography
        sx={{ fontSize: { xs: 24, sm: 28, md: 32 }, 
        mt:8 }}
        fontWeight="300"
        gutterBottom
      >
        Tutorial
      </Typography>
      <Typography sx={{ 
        fontSize: { xs: 14, sm: 16, md: 18 }, mt: 1
         }}>
        This video tutorial describes:
        <ul style={{marginTop: 2}}>
          <li>The scope and focus of groovDB</li>
          <li>Three methods to search the database</li>
          <li>Information within each biosensor page</li>
          <li>How to add a new sensor to the database</li>
          <li>How to use groovDB to build ligand-inducible biosensor plasmids</li>
        </ul>
      </Typography> */}
    </Box>
  );
}
