import React from 'react';

import { Box, Grid, Typography, Paper } from '@mui/material';

export default function SeqViewer(props) {
  function splitStringIntoChunks(str, chunkSize) {
    let result = [];
    for (let i = 0; i < str.length; i += chunkSize) {
      result.push(str.slice(i, i + chunkSize));
    }
    return result;
  }

  const proteinChunks = splitStringIntoChunks(props.sequence, 10);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container style={{ width: '100%' }}>

        <Grid size={12} mt={1}>
          <Paper
            elevation={0}
            sx={{
              padding: 3,
              border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? '#555' : '#c7c7c7'}`,
              backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#2a2a2a' : '#f2f2f2',
              marginLeft: {xs:1,sm:0},
              marginRight: {xs:1,sm:0}
            }}
          >
            {/* Protein length indicator */}

            <Grid size={{xs:6, sm:10, md:6}} mb={3}>
              <Grid container>
                <Grid size={{xs:5, sm:2}} textAlign="right">
                  <Typography
                    component="span"
                    width="100px"
                    sx={{
                      fontSize: { xs: 14, sm: 16, md: 16 },
                      paddingRight: '15px',
                      borderRight: '2px solid #0084ff',
                    }}
                  >
                    <b>Length</b>
                  </Typography>
                </Grid>

                <Grid size={{xs:5, sm:4}} textAlign="left" ml={'15px'}>
                  <Typography
                    component="span"
                    width="100px"
                    sx={{ fontSize: { xs: 14, sm: 16, md: 16 } }}
                  >
                    {props.sequence.length}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            {/* Protein Sequence */}

            {proteinChunks.map((seq, index) => (
              <Box
                key={index}
                sx={{
                  width: { xs: '90px', sm: '130px' },
                  marginBottom: { xs: '0px', sm: '7px' },
                  display: 'inline-block',
                }}
              >
                <Typography
                  component="span"
                  sx={{ fontSize: { xs: 12, sm: 16 } }}
                >
                  {seq}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
