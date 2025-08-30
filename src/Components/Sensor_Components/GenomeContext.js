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
  Stack
} from '@mui/material';

import { generateGraphic } from '../../lib/FormatOperon';

export default function GenomeContext({ sensor, alias }) {
  const [operon, setOperon] = useState([]);
  const [geneFocus, setGeneFocus] = useState(undefined);
  const [formattedData, setFormattedData] = useState([]);
  const [calculatedWidth, setCalculatedWidth] = useState(800);

  const lineRef = useRef(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Use desktop dimensions for consistency
  const arrowLength = parseInt(window.innerHeight) > 800 ? 20 : 15;
  const geneHeight = parseInt(window.innerHeight) > 800 ? 40 : 30;
  const yOffset = 3;
  const xOffset = 3;
  const strokeWidth = parseInt(window.innerHeight) > 800 ? 3 : 2;
  
  // Use desktop width as base, but allow override for calculated width
  const baseOperonWidth = isSmallScreen ? 800 : parseInt(window.innerWidth) * 0.62;


  useEffect(() => {
    //the if statement here is used to prevent this from running on initialization.
    if (sensor.operon || sensor.newOperon) {
      // we always read newOperon first
      let data = sensor.newOperon ? sensor.newOperon : sensor.operon;

      const graphic = generateGraphic(data.operon, data.regIndex);

      setFormattedData(graphic);
    }
  }, []);

  useEffect(() => {
    if (formattedData.length === 0) return;
    
    // First pass: calculate total required width
    let totalWidth = xOffset;
    for (var gene of formattedData) {
      var genePercent = parseInt(gene.length);
      var geneLength =
        genePercent > 2
          ? baseOperonWidth * (genePercent * 0.01) - arrowLength
          : baseOperonWidth * (genePercent * 0.01);
      var spacerLength = baseOperonWidth * (parseInt(gene.spacer) * 0.01);
      totalWidth += geneLength + arrowLength + spacerLength;
    }
    
    // On desktop, use base width. On mobile, use calculated width for natural scrolling
    const finalWidth = isSmallScreen ? Math.max(800, totalWidth + 50) : baseOperonWidth;
    setCalculatedWidth(finalWidth);
    
    // Second pass: render genes with final width
    var x_pos = xOffset;
    const genes = [];
    var counter = 0;

    // calculate total percentage of genes + spacers such that operon doesn't overflow? Or rewrite this on the backend?
    for (var gene of formattedData) {
      var genePercent = parseInt(gene.length);

      var geneLength =
        genePercent > 2
          ? finalWidth * (genePercent * 0.01) - arrowLength
          : finalWidth * (genePercent * 0.01);
      var spacerLength = finalWidth * (parseInt(gene.spacer) * 0.01);

      genes.push(
        <Line
          key={counter}
          ref={lineRef}
          closed
          points={
            gene.direction == '+'
              ? [
                  x_pos,
                  yOffset,
                  x_pos + geneLength,
                  yOffset,
                  x_pos + geneLength + arrowLength,
                  yOffset + geneHeight / 2,
                  x_pos + geneLength,
                  yOffset + geneHeight,
                  x_pos,
                  yOffset + geneHeight,
                ]
              : [
                  x_pos + arrowLength,
                  yOffset,
                  x_pos + arrowLength + geneLength,
                  yOffset,
                  x_pos + arrowLength + geneLength,
                  yOffset + geneHeight,
                  x_pos + arrowLength,
                  yOffset + geneHeight,
                  x_pos,
                  yOffset + geneHeight / 2,
                ]
          }
          stroke="black"
          strokeWidth={strokeWidth}
          fill={gene.color}
          //Konva doesn't like Line element IDs being integers
          id={String(counter)}
          opacity={counter == geneFocus ? 1 : 0.5}
          onClick={(e) => {
            setGeneFocus(parseInt(e.target.getAttrs().id));
          }}
          //Need to include this for "click" to work on mobile
          onTap={(e) => {
            setGeneFocus(parseInt(e.target.getAttrs().id));
          }}
          onMouseEnter={(e) => {
            // style stage container:
            const container = e.target.getStage().container();
            container.style.cursor = 'pointer';
          }}
          onMouseLeave={(e) => {
            const container = e.target.getStage().container();
            container.style.cursor = 'default';
          }}
        />
      );

      x_pos += geneLength + arrowLength;
      x_pos += spacerLength;
      counter += 1;
    }

    setOperon(genes);
  }, [formattedData, geneFocus]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container style={{ width: '100%' }}>
        {/* Operon */}
        <Grid size={12} mt={1}>
          <Paper 
            elevation={0} 
            sx={{ 
              padding: 3, 
              border: '1px solid #c7c7c7',
              marginLeft: {xs:1,sm:0},
              marginRight: {xs:1,sm:0}
            }}
          >
            <Grid container spacing={5} columns={12}>
              <Grid size={12} align="center">
                <Box 
                  sx={{ 
                    overflowX: 'auto', 
                    overflowY: 'hidden',
                    width: '100%',
                    '&::-webkit-scrollbar': {
                      height: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: '#f1f1f1',
                      borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: '#c1c1c1',
                      borderRadius: '4px',
                      '&:hover': {
                        backgroundColor: '#a1a1a1',
                      },
                    },
                  }}
                >
                  <Stage width={calculatedWidth} height={50}>
                    <Layer>{operon}</Layer>
                  </Stage>
                </Box>
              </Grid>

              {/* Color-coded Legend */}
              <Grid container columns={12} justifyContent="center" size={12}>
                <Box 
                  sx={{ 
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: { xs: 0.5, sm: 1 },
                    maxWidth: '100%',
                    px: { xs: 1, sm: 0 }
                  }}
                >
                  <Chip 
                    label="Enzyme" 
                    id="enzyme-chip"
                    size={isSmallScreen ? "small" : "medium"}
                    sx={{backgroundColor: '#ff3021', color: "white", fontSize: {xs:10,sm:16}}}
                  />
                  <Chip 
                    label="Transporter" 
                    id="transporter-chip"
                    size={isSmallScreen ? "small" : "medium"}
                    sx={{backgroundColor: "yellow", color: "black", fontSize: {xs:10,sm:16}}}
                  />
                  <Chip 
                    label="Regulator" 
                    id="regulator-chip"
                    size={isSmallScreen ? "small" : "medium"}
                    sx={{backgroundColor: "#3030fc", color: "white", fontSize: {xs:10,sm:16}}}
                  />
                  <Chip 
                    label="Other" 
                    id="other-chip"
                    size={isSmallScreen ? "small" : "medium"}
                    sx={{backgroundColor: "#3d3d3d", color: "white", fontSize: {xs:10,sm:16}}}
                  />
                  <Chip 
                    label={alias} 
                    id="alias-chip"
                    size={isSmallScreen ? "small" : "medium"}
                    sx={{backgroundColor: "#008c02", color: "white", fontSize: {xs:10,sm:16}}}
                  />
                </Box>
              </Grid>

              {/* Gene Annotation Table */}
              <Grid
                size={12}
                mb={3}
                align="left"
                style={{ height: 100, textAlign: 'center' }}
              >
                {geneFocus != undefined ? (
                  <Grid size={12} mt={3}>
                    <Grid container>
                      <Grid size={{xs:3, sm:2, md:2}} textAlign="right">
                        <Typography
                          component="span"
                          width="100px"
                          sx={{
                            fontSize: { xs: 14, sm: 16, md: 16 },
                            paddingRight: '15px',
                            borderRight: '2px solid #0084ff',
                          }}
                        >
                          <b>Accession</b>
                        </Typography>
                      </Grid>

                      <Grid
                        size={{xs:8, sm:3, md:2}}
                        textAlign="left"
                        ml={'15px'}
                      >
                        <Link
                          href={
                            'https://www.ncbi.nlm.nih.gov/protein/' +
                            formattedData[geneFocus].link
                          }
                          target="_blank"
                          sx={{ textDecoration: 'none' }}
                        >
                          <Typography
                            component="span"
                            width="100px"
                            sx={{ fontSize: { xs: 14, sm: 16, md: 16 } }}
                          >
                            {formattedData[geneFocus].link}
                          </Typography>
                        </Link>
                      </Grid>

                      <Grid size={{xs:3, sm:2, md:2}} textAlign="right">
                        <Typography
                          component="span"
                          width="100px"
                          sx={{
                            fontSize: { xs: 14, sm: 16, md: 16 },
                            paddingRight: '15px',
                            borderRight: '2px solid #0084ff',
                          }}
                        >
                          <b>Description</b>
                        </Typography>
                      </Grid>

                      <Grid
                        size={{xs:8, sm:4, md:5}}
                        textAlign="left"
                        ml={'15px'}
                      >
                        <Typography
                          component="span"
                          width="100px"
                          sx={{ fontSize: { xs: 14, sm: 16, md: 16 } }}
                        >
                          {formattedData[geneFocus].description}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                ) : (
                  <Typography
                    component="div"
                    align="center"
                    sx={{ height: 160, fontSize: {xs:18,sm:22, md: 24} }}
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
