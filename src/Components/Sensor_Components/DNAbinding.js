import React, { useEffect, useState } from 'react';

import { DNALogo } from 'logojs-react';
import biomsa from 'biomsa';

import { Box, Grid, Typography, Link, Paper } from '@mui/material';

import { DataGrid } from '@mui/x-data-grid';
import { useMediaQuery, useTheme } from '@mui/material';

export default function DNAbinding({ operator_data }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [logoMatrix, setLogoMatrix] = useState();
  const [rows, setRows] = useState([]);

  // set the table columns. Make the Reference item 'clickable'
  const columns = [
    { field: 'id', headerName: 'Id', width: 20 },
    { field: 'sequence', headerName: 'Sequence', width: 350 },
    {
      field: 'reference',
      headerName: 'Reference',
      width: 120,
      renderCell: (params) => (
        <Link href={'https://doi.org/' + params.value.link} target="_blank">
          {params.value.name}
        </Link>
      ),
    },
    { field: 'method', headerName: 'Method', width: 200 },
  ];

  useEffect(() => {
    // populate a table with seq/ref/method data on operators.
    const rowsToAdd = [];
    let counter = 1;

    for (const op of operator_data) {
      var entry = {
        id: counter,
        sequence: op['sequence'],
        reference: { name: op['ref_figure'], link: op['doi'] },
        method: op['method'],
      };
      rowsToAdd.push(entry);

      counter += 1;
      setRows(rowsToAdd);
    }

    // format the operators
    var operators = [];
    for (const entry of operator_data) {
      var op = entry['sequence'].toUpperCase();
      operators.push(op);
    }

    // Input aligned operators, output a matrix
    const calc_matrix = (operators) => {
      const num_ops = operators.length;
      const operator_length = operators[0].length;
      const matrix = [];

      // define the position
      for (let i = 0; i < operator_length; i++) {
        var base = [0, 0, 0, 0];
        // loop through each operator
        for (const op of operators) {
          if (op[i] === 'A') {
            base[0] += 1 / num_ops;
          } else if (op[i] === 'C') {
            base[1] += 1 / num_ops;
          } else if (op[i] === 'G') {
            base[2] += 1 / num_ops;
          } else if (op[i] === 'T') {
            base[3] += 1 / num_ops;
          }
        }
        base[0] = Math.round((base[0] + Number.EPSILON) * 100) / 100;
        base[1] = Math.round((base[1] + Number.EPSILON) * 100) / 100;
        base[2] = Math.round((base[2] + Number.EPSILON) * 100) / 100;
        base[3] = Math.round((base[3] + Number.EPSILON) * 100) / 100;

        matrix.push(base);
      }
      return matrix;
    };

    // If there's more than 1 operator, do an alignment. If not, don't do an alignment
    if (operators.length > 1) {
      // align the operators
      biomsa
        .align(operators, {
          gapopen: -100,
          gapextend: -100,
          method: 'diag',
          type: 'nucleic',
          gapchar: '-',
          debug: true,
        })
        .then((result) => {
          var matrix = calc_matrix(result);
          setLogoMatrix(matrix);
        });
    } else {
      var matrix = calc_matrix(operators);
      setLogoMatrix(matrix);
    }
  }, [operator_data]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container style={{ width: '100%' }}>
        {/* Component Title */}
        <Grid size={12}>
          <Typography
            component="div"
            variant="h5"
            sx={{ ml: { xs: '5%', sm: '2.5%' }, fontSize: {xs:24,sm:28}, fontWeight: 300 }}
          >
            DNA Binding
          </Typography>
        </Grid>
        <Grid size={12} mt={1}>
          {/* Container */}
          <Paper 
            elevation={0} 
            sx={{ 
            padding: 3, 
            border: '1px solid #c7c7c7',
            marginLeft: {xs:1,sm:0},
            marginRight: {xs:1,sm:0} }}>
            <Grid container>
              {/* Operator Logo */}
              <Grid size={{xs:12, md:12}} sx={{ overflow: 'scroll' }}>
                {isSmallScreen && logoMatrix ? (
                  <DNALogo ppm={logoMatrix} height="90px" yAxisMax={2.5} />
                ) : (
                  <Box></Box>
                )}
                :
                {isSmallScreen == false && logoMatrix ? (
                  <DNALogo ppm={logoMatrix} height="170px" yAxisMax={2.5} />
                ) : (
                  <Box></Box>
                )}
              </Grid>

              {/* Operator data table */}
              <Grid
                size={12}
                sx={{ height: '200px', pl: { xs: 0, md: 4 } }}
              >
                <DataGrid
                  rows={rows}
                  columns={columns}
                  autoPageSize
                  height="400px"
                  rowsPerPageOptions={[5]}
                  density="compact"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
