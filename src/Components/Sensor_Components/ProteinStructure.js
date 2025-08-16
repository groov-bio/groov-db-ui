import React, { useState, useEffect } from 'react';

import {
  Box,
  Grid,
  Typography,
  Paper,
  Pagination,
  Stack,
  Link,
} from '@mui/material';

export default function ProteinStructure(props) {
  const structureIDs = props.structureIDs;

  //index of structures currently displayed
  const [structureIndex, setStructureIndex] = useState(1);
  const [isComponentLoaded, setIsComponentLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const changeStructure = (event, value) => {
    setStructureIndex(value);
  };

  // Lazy load ProtvistaStructure only when needed
  useEffect(() => {
    if (
      typeof structureIDs[structureIndex - 1] !== 'undefined' &&
      !isComponentLoaded
    ) {
      setIsLoading(true);
      import('@nightingale-elements/nightingale-structure')
        .then((module) => {
          const NightingaleStructureComponent = module.default;
          // Define the custom element only after the component is loaded
          if (!window.customElements.get('nightingale-structure')) {
            window.customElements.define(
              'nightingale-structure',
              NightingaleStructureComponent
            );
          }
          setIsComponentLoaded(true);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Failed to load NightingaleStructure:', error);
          setIsLoading(false);
        });
    }
  }, [structureIDs, structureIndex, isComponentLoaded]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container style={{ width: '100%' }}>
        {/* Component Title */}
        <Grid size={12}>
          <Typography
            component="div"
            sx={{ marginLeft: '5%', fontSize: {xs:24,sm:28}, fontWeight: 300 }}
          >
            Structure
          </Typography>
        </Grid>

        {/* Protein Structure */}
        <Grid size={12}>
          <Paper elevation={0} sx={{ height: '500px' }}>
            {typeof structureIDs[structureIndex - 1] !== 'undefined' ? (
              isLoading ? (
                <div style={{ textAlign: 'center', paddingTop: '200px' }}>
                  <Typography variant="h6">
                    Loading 3D structure viewer...
                  </Typography>
                </div>
              ) : isComponentLoaded ? (
                <nightingale-structure
                  height="500px"
                  protein-accession={props.uniprotID}
                  structure-id={structureIDs[structureIndex - 1]}
                  hide-table
                />
              ) : null
            ) : (
              <div style={{ textAlign: 'center' }}>
                <img
                  style={{
                    height: '250px',
                    marginTop: '35px',
                    marginBottom: '40px',
                  }}
                  alt="Greyed out biosensor structure"
                  src={'/TetRNoStructure.png'}
                />
                <h2>No structure available</h2>
              </div>
            )}

            <Typography
              component="div"
              sx={{ textAlign: 'center', fontSize: {xs:18,sm:24}, fontWeight: 400 }}
            >
              {typeof structureIDs[structureIndex - 1] !== 'undefined'
                ? structureIDs[structureIndex - 1]
                : 'No structure'}
            </Typography>
          </Paper>
        </Grid>

        {/* Pagination */}
        <Grid size={12} mt={7} mb={3}>
          <Stack spacing={2} alignItems="center">
            <Pagination
              count={props.structureIDs.length}
              page={structureIndex}
              onChange={changeStructure}
              size="small"
            />
          </Stack>
        </Grid>

        {/* Reference */}

        <Grid size={12} mt={1}>
          <Grid container>
            <Grid size={5} textAlign="right">
              <Typography
                component="span"
                width="100px"
                sx={{
                  fontSize: { xs: 14, sm: 16, md: 16 },
                  paddingRight: '15px',
                  borderRight: '2px solid #0084ff',
                }}
              >
                <b>ID</b>
              </Typography>
            </Grid>

            <Grid size={6} textAlign="left" ml={'15px'}>
              {typeof structureIDs[structureIndex - 1] !== 'undefined' ? (
                structureIDs[structureIndex - 1].length == 4 ? (
                  <Link
                    href={
                      'https://www.ebi.ac.uk/pdbe/entry/pdb/' +
                      structureIDs[structureIndex - 1]
                    }
                    target="_blank"
                    style={{ textDecoration: 'None', color: '#243fab' }}
                  >
                    <Typography
                      component="span"
                      width="100px"
                      sx={{ fontSize: { xs: 14, sm: 16, md: 16 } }}
                    >
                      {structureIDs[structureIndex - 1]}
                    </Typography>
                  </Link>
                ) : (
                  <Link
                    href={
                      'https://alphafold.ebi.ac.uk/entry/' + props.uniprotID
                    }
                    target="_blank"
                    style={{ textDecoration: 'None', color: '#243fab' }}
                  >
                    <Typography
                      component="span"
                      width="100px"
                      sx={{ fontSize: { xs: 14, sm: 16, md: 16 } }}
                    >
                      {structureIDs[structureIndex - 1]}
                    </Typography>
                  </Link>
                )
              ) : (
                <Typography
                  component="span"
                  width="100px"
                  sx={{ fontSize: { xs: 14, sm: 16, md: 16 } }}
                >
                  No structure
                </Typography>
              )}
            </Grid>
          </Grid>
        </Grid>

        {/* Method */}

        <Grid size={12} mt={1}>
          <Grid container>
            <Grid size={5} textAlign="right">
              <Typography
                component="span"
                width="100px"
                sx={{
                  fontSize: { xs: 14, sm: 16, md: 16 },
                  paddingRight: '15px',
                  borderRight: '2px solid #0084ff',
                }}
              >
                <b>Method</b>
              </Typography>
            </Grid>

            <Grid size={6} textAlign="left" ml={'15px'}>
              <Typography
                component="span"
                width="100px"
                sx={{ fontSize: { xs: 14, sm: 16, md: 16 } }}
              >
                {structureIDs[structureIndex - 1].length == 4
                  ? 'X-ray'
                  : 'Predicted'}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
