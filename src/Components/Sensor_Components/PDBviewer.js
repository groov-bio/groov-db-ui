import React, { useEffect, useState } from 'react';
import '../../css/LiteMol/css/LiteMol-plugin.min.css';

import NoStructure from '../../images/TetRNoStructure.png';

import { Box, Grid, Typography, Paper, Pagination, Stack } from '@mui/material';

export default function PDBviewer(props) {
  //An array of all 4 letter PDB codes.
  const allPDBs = props.pdb;
  //LiteMol plugin object
  const [plugin, setPlugin] = useState();
  //index of PDB structure currently displayed
  const [pdbNumber, setPDBnumber] = useState(1);
  const [isComponentLoaded, setIsComponentLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const changeStructure = (event, value) => {
    setPDBnumber(value);
  };

  // Lazy load LiteMol only when needed
  useEffect(() => {
    if (typeof allPDBs[pdbNumber - 1] !== 'undefined' && !isComponentLoaded) {
      setIsLoading(true);
      import('litemol')
        .then((module) => {
          window.LiteMol = module.default; // Store globally for access
          setIsComponentLoaded(true);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Failed to load LiteMol:', error);
          setIsLoading(false);
        });
    }
  }, [allPDBs, pdbNumber, isComponentLoaded]);

  //on first page load initialize the LiteMol plugin interface
  useEffect(() => {
    if (
      typeof allPDBs[pdbNumber - 1] !== 'undefined' &&
      isComponentLoaded &&
      window.LiteMol
    ) {
      let pluginData = window.LiteMol.Plugin.create({
        target: '#litemol',
        viewportBackground: '#fff',
        layoutState: { hideControls: true },
        allowAnalytics: true,
      });
      setPlugin(pluginData);
    }
  }, [allPDBs, isComponentLoaded]);

  //load the PDB structure into the LiteMol interface on load and on button click
  useEffect(() => {
    if (typeof allPDBs[pdbNumber - 1] !== 'undefined') {
      if (typeof plugin !== 'undefined') {
        const id = allPDBs[pdbNumber - 1];
        plugin.clear();
        plugin.loadMolecule({
          id,
          url:
            'https://www.ebi.ac.uk/pdbe/static/entry/' +
            id.toLowerCase() +
            '_updated.cif',
          format: 'cif',
          moleculeRef: id + '-molecule',
        });
      }
    }
  }, [plugin, pdbNumber, allPDBs]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container>
        {/* Component Title */}
        <Grid item xs={12} style={{ marginLeft: '5%' }}>
          <Typography component="div" variant="h5">
            Structure
          </Typography>
        </Grid>

        {/* Protein Structure */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ height: '400px' }}>
            {typeof allPDBs[pdbNumber - 1] != 'undefined' ? (
              isLoading ? (
                <div style={{ textAlign: 'center', paddingTop: '150px' }}>
                  <Typography variant="h6">Loading 3D viewer...</Typography>
                </div>
              ) : isComponentLoaded ? (
                <Box
                  id="litemol"
                  sx={{
                    position: 'absolute',
                    height: '390px',
                    width: { xs: '95%', sm: '40%' },
                  }}
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
                  src={NoStructure}
                />
                <h2>No structure available</h2>
              </div>
            )}
          </Paper>
        </Grid>

        {/* Pagination */}
        <Grid item xs={12} mt={3}>
          <Stack spacing={2} alignItems="center">
            <Pagination
              count={props.pdb.length}
              page={pdbNumber}
              onChange={changeStructure}
              size="small"
            />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
