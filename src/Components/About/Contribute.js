import React from 'react';

import { Box, Typography, Link as MuiLink, styled } from '@mui/material';
import { Link } from 'react-router-dom';

const StyledRouterLink = styled(Link)(({ theme }) => ({
  fontSize: '18px',
  textDecoration: 'none',
  display: 'inline',
  paddingLeft: '5px',
  paddingRight: '5px',
  color: theme.palette.mode === 'dark' ? '#90caf9' : '#1976d2',
  '&:hover': {
    color: theme.palette.mode === 'dark' ? '#bbdefb' : '#1565c0',
  },
}));

export default function Contribute() {
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
        Contributing to groov<sup>DB</sup>
      </Typography>
      <Typography sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }}>
        If you would like to help expand and improve the database, please
        consider contributing to groov<sup>DB</sup>. In order to make any
        changes to the database, you must first create an account.
        <i>
          {' '}
          Please only submit information that can be independently verified with
          an accompanying reference.
        </i>
      </Typography>

      <Typography sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }} mt={3}>
        <b>Submit a new biosensor</b>
      </Typography>

      <Typography
        sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }}
        component="span"
        fontWeight={400}
        mt={1}
      >
        Use the <a href="https://www.groov.bio/addSensor/" style={{textDecoration:"none"}}>biosensor submission form</a>{' '}
        to create a new record for a biosensor that is not currently in the
        database. Please search for the biosensor and common aliases first to
        confirm that it does not already exits. All new submissions must be
        accompanied by DOIs for publications that describe the biosensor's DNA
        and ligand binding activities. If you would like to submit information
        about unpublished proteins, please <a href="https://groov.bio/about/contact" style={{textDecoration:"none"}}>
          {' '} contact us</a>.
      </Typography>

      <Typography sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }} mt={3}>
        <b>Batch submissions</b>
      </Typography>

      <Typography
        sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }}
        component="span"
        mt={1}
      >
        If you would like to submit batches of multiple sensor entries, please 
        <a href="https://groov.bio/about/contact" style={{textDecoration:"none"}}>
          {' '} contact us</a>.
      </Typography>

    </Box>
  );
}
