import React from 'react';

import {
  Box,
  Grid,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
} from '@mui/material';

/**
 * This component is a data agnostic component to render a table
 * It expects the following structure:
 * {
 *  key: {
 *      name: string
 *      link: {       //nullable
 *        url: string
 *      }
 *    }
 * }
 * This will render each key as a header, name as a table cell and wrap in link if it exists to the provided url
 * @param {Object} tableData
 * @returns
 */
export default function MetadataTable({ tableData }) {
  return (
    <Grid container>
      {Object.keys(tableData).map((key, index) => {
        if (tableData[key].link) {
          return (
            <Grid size={{xs:12, sm:6}} key={index} mb={1}>
              <Grid container>
                <Grid size={6} textAlign="right">
                  <Typography
                    component="span"
                    width="100px"
                    sx={{
                      fontSize: { xs: 14, sm: 16, md: 16 },
                      paddingRight: '15px',
                      borderRight: '2px solid #0084ff',
                    }}
                  >
                    <b>{key}</b>
                  </Typography>
                </Grid>

                <Grid size={5} textAlign="left" ml={'15px'}>
                  {tableData[key].link.url ===
                  'https://www.genome.jp/dbget-bin/www_bget?null' ? (
                    <Typography
                      component="span"
                      width="100px"
                      sx={{ fontSize: { xs: 14, sm: 16, md: 16 } }}
                    >
                      {tableData[key].name}
                    </Typography>
                  ) : (
                    <Link
                      href={tableData[key].link.url}
                      target="_blank"
                      style={{ textDecoration: 'None', color: '#243fab' }}
                    >
                      <Typography
                        component="span"
                        width="100px"
                        sx={{ fontSize: { xs: 14, sm: 16, md: 16 } }}
                      >
                        {tableData[key].name}
                      </Typography>
                    </Link>
                  )}
                </Grid>
              </Grid>
            </Grid>
          );
        } else {
          return (
            <Grid size={{xs:12, sm:6}} key={index} mb={1}>
              <Grid container>
                <Grid size={6} textAlign="right">
                  <Typography
                    component="span"
                    width="100px"
                    sx={{
                      fontSize: { xs: 14, sm: 16, md: 16 },
                      paddingRight: '15px',
                      borderRight: '2px solid #0084ff',
                    }}
                  >
                    <b>{key}</b>
                  </Typography>
                </Grid>

                <Grid size={5} textAlign="left" ml={'15px'}>
                  <Typography
                    component="span"
                    width="100px"
                    sx={{ fontSize: { xs: 14, sm: 16, md: 16 } }}
                  >
                    {tableData[key].name}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          );
        }
      })}
    </Grid>
  );
}
