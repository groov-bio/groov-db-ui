import React, { useState, useEffect } from 'react';

import SmilesDrawer from 'smiles-drawer';

import {
  Box,
  Grid,
  Typography,
  Paper,
  Link,
  Divider,
  Pagination,
  Stack,
} from '@mui/material';

export default function LigandViewer({ ligand, placement }) {
  const [ligandNumber, setLigandNumber] = useState(1);
  const [ligandName, setLigandName] = useState('Loading ...');
  const [smileValid, setSmileValid] = useState([]);

  const changeLigand = (event, value) => {
    setLigandNumber(value);
  };

  // Set the displayed chemical structure
  useEffect(() => {
    if (
      ligand[ligandNumber - 1] !== undefined &&
      ligand[ligandNumber - 1].SMILES !== ''
    ) {
      setLigandName(ligand[ligandNumber - 1]['name']);
      let ligandSMILES = ligand[ligandNumber - 1]['SMILES'];

      let options = {
        compactDrawing: false,
        bondThickness: 1.2,
      };
      let smilesDrawer = new SmilesDrawer.Drawer(options);

      SmilesDrawer.parse(
        ligandSMILES,
        function (tree) {
          smilesDrawer.draw(tree, 'SMILEScanvas');
        },
        function (err) {
          //TODO - remove
        }
      );
    } else {
      //Missing SMILES

      //Clear canvas
      const canvas = document.getElementById('SMILEScanvas');
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);

      //Write text
      context.font = '30px Arial';
      context.fillText('Please enter a SMILES to get started.', 0, 200);
    }
  }, [ligandNumber, ligand]);

  //Mark is a ligand has at least SMILES
  useEffect(() => {
    let temp = [];
    for (let i = 0; i < ligand.length; i++) {
      if (ligand[i].SMILES === '') {
        temp.push(false);
      } else {
        temp.push(true);
      }
    }

    setSmileValid(temp);
  }, [ligand]);

  //TODO - need to figure out how to display something if a ligand SMILES isn't valid
  //TODO - seems like canvas is required

  return (
    <Box sx={{ flexGrow: 1 }} mt={placement.ligMT} mb={placement.ligMB}>
      <Grid container style={{ width: '100%' }}>
        {/* Component Title */}
        <Grid size={12}>
          <Typography
            component="div"
            style={{ marginLeft: '5%', fontSize: 28, fontWeight: 300 }}
          >
            Ligand
          </Typography>
        </Grid>

        {/* Chemical Structure and Name */}
        <Grid size={12}>
          <Paper
            elevation={0}
            sx={{
              border: '1px solid #c7c7c7',
              height: { xs: '300px', sm: '500px' },
            }}
          >
            <Box
              sx={{
                width: { xs: '300px' }, //This is being driven by the paper above
                height: { xs: '300px' }, //This is being driven by the paper above
                marginTop: { xs: 0, sm: '100px' },
                marginBottom: { xs: 0, sm: '100px' },
                margin: 'auto',
                display: 'block',
              }}
              id="daBox"
            >
              <canvas
                style={{
                  width: '100%',
                  height: '100%',
                }}
                id="SMILEScanvas"
              />
            </Box>
            <Typography
              component="div"
              sx={{ textAlign: 'center', fontSize: 24, fontWeight: 400 }}
            >
              {ligandName}
            </Typography>
          </Paper>
        </Grid>

        {/* Pagination */}
        <Grid size={12} mb={3} mt={7}>
          <Stack spacing={2} alignItems="center">
            <Pagination
              count={ligand.length}
              page={ligandNumber}
              onChange={changeLigand}
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
                <b>Reference</b>
              </Typography>
            </Grid>

            <Grid size={6} textAlign="left" ml={'15px'}>
              <Link
                href={'https://doi.org/' + ligand[ligandNumber - 1]['doi']}
                target="_blank"
                style={{ textDecoration: 'None', color: '#243fab' }}
              >
                <Typography
                  component="span"
                  width="100px"
                  sx={{ fontSize: { xs: 14, sm: 16, md: 16 } }}
                >
                  {ligand[ligandNumber - 1]['ref_figure']}
                </Typography>
              </Link>
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
              <Link
                href={'https://www.groov.bio/about/about-groovdb'}
                style={{ textDecoration: 'None', color: '#243fab' }}
              >
                <Typography
                  component="span"
                  width="100px"
                  sx={{ fontSize: { xs: 14, sm: 16, md: 16 } }}
                >
                  {ligand[ligandNumber - 1]['method']}
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
