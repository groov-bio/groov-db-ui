import React from 'react';

import {
  Box,
  Grid,
  Typography,
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
  const labelSx = {
    fontSize: { xs: 14, sm: 16, md: 16 },
  };

  const valueSx = {
    fontSize: { xs: 14, sm: 16 },
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
  };

  return (
    <Grid container>
      {Object.keys(tableData).map((key, index) => (
        <Grid size={{ xs: 12, sm: 6 }} key={index} mb={1}>
          <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
            {/* Fixed-width label box — border is on the Box so the separator
                always lands at the same x position regardless of label length.
                Narrower on xs so cramped phones leave more room for the value. */}
            <Box sx={{
              width: { xs: '124px', sm: '180px' },
              flexShrink: 0,
              paddingRight: { xs: '10px', sm: '15px' },
              borderRight: '2px solid #0084ff',
              textAlign: 'right',
            }}>
              <Typography component="span" sx={labelSx}>
                <b>{key}</b>
              </Typography>
            </Box>

            {/* Value: flex: 1 + minWidth: 0 lets long text wrap without overflow */}
            <Box sx={{ pl: { xs: 1.5, sm: 2 }, flex: 1, minWidth: 0 }}>
              {tableData[key].link ? (
                tableData[key].link.url ===
                'https://www.genome.jp/dbget-bin/www_bget?null' ? (
                  <Typography
                    component="span"
                    sx={valueSx}
                    id={`metadata-table-${key}`}
                  >
                    {tableData[key].name}
                  </Typography>
                ) : (
                  <Link
                    href={tableData[key].link.url}
                    target="_blank"
                    sx={{ textDecoration: 'none' }}
                  >
                    <Typography
                      component="span"
                      sx={valueSx}
                      id={`metadata-table-data-${key}`}
                    >
                      {tableData[key].name}
                    </Typography>
                  </Link>
                )
              ) : (
                <Typography
                  component="span"
                  sx={{ ...valueSx, fontSize: { xs: 14, sm: 16, md: 16 } }}
                  id={`metadata-table-${key}`}
                >
                  {tableData[key].name}
                </Typography>
              )}
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}
