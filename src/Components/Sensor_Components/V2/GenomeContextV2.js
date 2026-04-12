import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Link,
  useMediaQuery,
  useTheme,
  Chip,
  Stack,
} from '@mui/material';
import { generateGraphic } from '../../../lib/FormatOperon';

/**
 * Genome context viewer for v2 data format.
 * Accepts context[] where context[0] has { reg_index, genome, operon_dir[] }.
 * operon_dir items: { link, start, stop, description, direction }
 */
export default function GenomeContextV2({ context, alias }) {
  const [operon, setOperon] = useState([]);
  const [geneFocus, setGeneFocus] = useState(undefined);
  const [formattedData, setFormattedData] = useState([]);
  const [calculatedWidth, setCalculatedWidth] = useState(800);

  const lineRef = useRef(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const arrowLength = parseInt(window.innerHeight) > 800 ? 20 : 15;
  const geneHeight = parseInt(window.innerHeight) > 800 ? 40 : 30;
  const yOffset = 3;
  const xOffset = 3;
  const strokeWidth = parseInt(window.innerHeight) > 800 ? 3 : 2;
  const baseOperonWidth = isSmallScreen ? 800 : parseInt(window.innerWidth) * 0.62;

  const ctx = context?.[0];

  useEffect(() => {
    if (ctx?.operon_dir?.length) {
      const graphic = generateGraphic(ctx.operon_dir, ctx.reg_index);
      setFormattedData(graphic);
    }
  }, []);

  useEffect(() => {
    if (formattedData.length === 0) return;

    let totalWidth = xOffset;
    for (const gene of formattedData) {
      const genePercent = parseInt(gene.length);
      const geneLength =
        genePercent > 2
          ? baseOperonWidth * (genePercent * 0.01) - arrowLength
          : baseOperonWidth * (genePercent * 0.01);
      const spacerLength = baseOperonWidth * (parseInt(gene.spacer) * 0.01);
      totalWidth += geneLength + arrowLength + spacerLength;
    }

    const finalWidth = isSmallScreen ? Math.max(800, totalWidth + 50) : baseOperonWidth;
    setCalculatedWidth(finalWidth);

    let x_pos = xOffset;
    const genes = [];
    let counter = 0;

    for (const gene of formattedData) {
      const genePercent = parseInt(gene.length);
      const geneLength =
        genePercent > 2
          ? finalWidth * (genePercent * 0.01) - arrowLength
          : finalWidth * (genePercent * 0.01);
      const spacerLength = finalWidth * (parseInt(gene.spacer) * 0.01);

      genes.push(
        <Line
          key={counter}
          ref={lineRef}
          closed
          points={
            gene.direction === '+'
              ? [
                  x_pos, yOffset,
                  x_pos + geneLength, yOffset,
                  x_pos + geneLength + arrowLength, yOffset + geneHeight / 2,
                  x_pos + geneLength, yOffset + geneHeight,
                  x_pos, yOffset + geneHeight,
                ]
              : [
                  x_pos + arrowLength, yOffset,
                  x_pos + arrowLength + geneLength, yOffset,
                  x_pos + arrowLength + geneLength, yOffset + geneHeight,
                  x_pos + arrowLength, yOffset + geneHeight,
                  x_pos, yOffset + geneHeight / 2,
                ]
          }
          stroke="black"
          strokeWidth={strokeWidth}
          fill={gene.color}
          id={String(counter)}
          opacity={counter === geneFocus ? 1 : 0.5}
          onClick={(e) => setGeneFocus(parseInt(e.target.getAttrs().id))}
          onTap={(e) => setGeneFocus(parseInt(e.target.getAttrs().id))}
          onMouseEnter={(e) => {
            e.target.getStage().container().style.cursor = 'pointer';
          }}
          onMouseLeave={(e) => {
            e.target.getStage().container().style.cursor = 'default';
          }}
        />
      );

      x_pos += geneLength + arrowLength + spacerLength;
      counter += 1;
    }

    setOperon(genes);
  }, [formattedData, geneFocus]);

  if (!ctx?.operon_dir?.length) {
    return (
      <Typography color="text.secondary" textAlign="center" py={4}>
        No genome context submitted
      </Typography>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container style={{ width: '100%' }}>
        <Grid size={12} mt={1}>
          <Paper
            elevation={0}
            sx={{
              pl: { xs: 0, sm: 3 },
              pr: { xs: 0, sm: 3 },
              pt: 3,
              pb: 3,
              border: '1px solid #c7c7c7',
              marginLeft: { xs: 1, sm: 0 },
              marginRight: { xs: 1, sm: 0 },
            }}
          >
            <Grid container spacing={4} columns={12}>
              <Grid size={12} align="center">
                <Box
                  sx={{
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    width: '100%',
                    '&::-webkit-scrollbar': { height: '8px' },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: '#f1f1f1',
                      borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: '#c1c1c1',
                      borderRadius: '4px',
                      '&:hover': { backgroundColor: '#a1a1a1' },
                    },
                  }}
                >
                  <Stage width={calculatedWidth} height={50}>
                    <Layer>{operon}</Layer>
                  </Stage>
                </Box>
              </Grid>

              {/* Legend */}
              <Grid container columns={12} justifyContent="center" size={12}>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: { xs: 0.5, sm: 1 },
                    maxWidth: '100%',
                    px: { xs: 1, sm: 0 },
                  }}
                >
                  <Chip label="Enzyme" size={isSmallScreen ? 'small' : 'medium'}
                    sx={{ backgroundColor: '#ff3021', color: 'white', fontSize: { xs: 10, sm: 16 } }} />
                  <Chip label="Transporter" size={isSmallScreen ? 'small' : 'medium'}
                    sx={{ backgroundColor: 'yellow', color: 'black', fontSize: { xs: 10, sm: 16 } }} />
                  <Chip label="Regulator" size={isSmallScreen ? 'small' : 'medium'}
                    sx={{ backgroundColor: '#3030fc', color: 'white', fontSize: { xs: 10, sm: 16 } }} />
                  <Chip label="Other" size={isSmallScreen ? 'small' : 'medium'}
                    sx={{ backgroundColor: '#3d3d3d', color: 'white', fontSize: { xs: 10, sm: 16 } }} />
                  {alias && (
                    <Chip label={alias} size={isSmallScreen ? 'small' : 'medium'}
                      sx={{ backgroundColor: '#008c02', color: 'white', fontSize: { xs: 10, sm: 16 } }} />
                  )}
                </Box>
              </Grid>

              {/* Gene detail on click */}
              <Grid size={12} mb={3} align="left" style={{ height: 100, textAlign: 'center' }}>
                {geneFocus !== undefined ? (
                  <Grid size={12} mt={3}>
                    <Grid container>
                      <Grid size={{ xs: 3, sm: 2, md: 2 }} textAlign="right">
                        <Typography
                          component="span"
                          sx={{
                            fontSize: { xs: 14, sm: 16 },
                            paddingRight: '15px',
                            borderRight: '2px solid #0084ff',
                          }}
                        >
                          <b>Accession</b>
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 8, sm: 3, md: 2 }} textAlign="left" ml="15px">
                        <Link
                          href={`https://www.ncbi.nlm.nih.gov/protein/${formattedData[geneFocus].link}`}
                          target="_blank"
                          sx={{ textDecoration: 'none' }}
                        >
                          <Typography component="span" sx={{ fontSize: { xs: 14, sm: 16 } }}>
                            {formattedData[geneFocus].link}
                          </Typography>
                        </Link>
                      </Grid>
                      <Grid size={{ xs: 3, sm: 2, md: 2 }} textAlign="right">
                        <Typography
                          component="span"
                          sx={{
                            fontSize: { xs: 14, sm: 16 },
                            paddingRight: '15px',
                            borderRight: '2px solid #0084ff',
                          }}
                        >
                          <b>Description</b>
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 8, sm: 4, md: 5 }} textAlign="left" ml="15px">
                        <Typography component="span" sx={{ fontSize: { xs: 14, sm: 16 } }}>
                          {formattedData[geneFocus].description}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                ) : (
                  <Typography
                    component="div"
                    align="center"
                    sx={{ height: 160, fontSize: { xs: 18, sm: 22, md: 24 } }}
                  >
                    Please select a gene
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
