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
        {/* Component Title */}
        <Grid item xs={12}>
          <Typography
            component="div"
            sx={{ ml: { xs: '5%', sm: '2.5%' }, fontSize: 28, fontWeight: 300 }}
          >
            Protein Sequence
          </Typography>
        </Grid>

        <Grid item xs={12} mt={1}>
          <Paper
            elevation={0}
            sx={{
              padding: 3,
              border: '1px solid #c7c7c7',
              background: '#f2f2f2',
            }}
          >
            {/* Protein length indicator */}

            <Grid item xs={6} sm={10} md={6} mb={3}>
              <Grid container>
                <Grid item xs={5} sm={2} textAlign="right">
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

                <Grid item xs={5} sm={4} textAlign="left" ml={'15px'}>
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
                  width: { xs: '100px', sm: '130px' },
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
            {/* <Typography
              component="div"
              sx={{ fontSize: { xs: 16, sm: 22 }, overflowWrap: 'anywhere' }}
            >
              {props.sequence}
            </Typography> */}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
