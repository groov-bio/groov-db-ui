import React, { useState, useEffect, useMemo } from 'react';
import SmilesDrawer from 'smiles-drawer';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Link,
  Pagination,
  Stack,
} from '@mui/material';

/**
 * Renders v2-format stimulus data for a single protein.
 * Each stimulus entry has:
 *   stimulusType[]: [{small_molecule: [...], light: null, temperature: null}]
 *   stimulus_evidence[]: [{method: [], ref_figure, doi, kd}]
 *
 * canvasId should be unique per protein instance (e.g. uniprot_id) to avoid
 * canvas ID collisions when multiple proteins are on screen simultaneously.
 */
export default function StimulusViewer({ stimulus, canvasId }) {
  const [currentIndex, setCurrentIndex] = useState(1);

  // Flatten every displayable stimulus item (each small molecule / light /
  // temperature across every stimulus entry and type entry) into its own page,
  // carrying the evidence from its parent stimulus entry. A single type entry
  // can hold multiple molecules (e.g. Estradiol + Estrone), so we can't index [0].
  const items = useMemo(() => {
    const asArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);
    const out = [];
    for (const entry of stimulus ?? []) {
      const types = entry?.stimulusType ?? entry?.stimulus_type ?? [];
      const evidence = entry?.stimulus_evidence ?? [];
      for (const t of types) {
        for (const data of asArray(t?.small_molecule)) out.push({ kind: 'molecule', data, evidence });
        for (const data of asArray(t?.light)) out.push({ kind: 'light', data, evidence });
        for (const data of asArray(t?.temperature)) out.push({ kind: 'temperature', data, evidence });
      }
    }
    return out;
  }, [stimulus]);

  const pageCount = items.length;
  const safeIndex = Math.min(currentIndex, pageCount) || 1;
  const current = items[safeIndex - 1];
  const smallMolecule = current?.kind === 'molecule' ? current.data : null;
  const light = current?.kind === 'light' ? current.data : null;
  const temperature = current?.kind === 'temperature' ? current.data : null;
  const evidence = current?.evidence?.[0];
  const smiles = smallMolecule?.smiles ?? smallMolecule?.SMILES;

  const stableCanvasId = `SMILEScanvas-${canvasId}`;

  useEffect(() => {
    const canvas = document.getElementById(stableCanvasId);
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    if (smiles) {
      const options = { compactDrawing: false, bondThickness: 1.2 };
      const drawer = new SmilesDrawer.Drawer(options);
      SmilesDrawer.parse(
        smiles,
        (tree) => { drawer.draw(tree, stableCanvasId); },
        () => {}
      );
    }
  }, [safeIndex, smiles, stableCanvasId]);

  if (!pageCount) {
    return (
      <Typography color="text.secondary" textAlign="center" py={4}>
        No stimulus data submitted
      </Typography>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Molecule / Stimulus Display */}
      {smallMolecule ? (
        <>
          <Paper
            elevation={0}
            sx={{
              border: '1px solid #c2c2c2',
              backgroundColor: '#ffffff',
              height: '480px',
            }}
          >
            <Box
              sx={{
                width: '300px',
                height: '300px',
                marginTop: { xs: 0, sm: '100px' },
                margin: 'auto',
                display: 'block',
              }}
            >
              <canvas
                id={stableCanvasId}
                style={{ width: '100%', height: '100%', backgroundColor: '#ffffff' }}
              />
            </Box>
          </Paper>
          <Typography
            sx={{ textAlign: 'center', fontSize: { xs: 18, sm: 24 }, fontWeight: 400, mt: 1 }}
          >
            {smallMolecule.name}
          </Typography>
          {smallMolecule.regulatory_effect && (
            <Typography textAlign="center" color="text.secondary" variant="body2">
              Effect: {smallMolecule.regulatory_effect}
            </Typography>
          )}
        </>
      ) : light ? (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            border: '1px solid #c2c2c2',
            textAlign: 'center',
            height: { xs: '200px', sm: '300px' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h5" gutterBottom>Light Stimulus</Typography>
          {light.wavelength && <Typography>{light.wavelength} nm</Typography>}
          {light.regulatory_effect && (
            <Typography color="text.secondary">{light.regulatory_effect}</Typography>
          )}
        </Paper>
      ) : temperature ? (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            border: '1px solid #c2c2c2',
            textAlign: 'center',
            height: { xs: '200px', sm: '300px' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h5" gutterBottom>Temperature Stimulus</Typography>
          {temperature.temperature !== undefined && (
            <Typography>{temperature.temperature}°C</Typography>
          )}
          {temperature.regulatory_effect && (
            <Typography color="text.secondary">{temperature.regulatory_effect}</Typography>
          )}
        </Paper>
      ) : null}

      {/* Pagination — always shown to match Structure card alignment */}
      <Stack spacing={2} alignItems="center" sx={{ mt: 4, mb: 3 }}>
        <Pagination
          count={pageCount}
          page={safeIndex}
          onChange={(_, v) => setCurrentIndex(v)}
          size="small"
        />
      </Stack>

      {/* Evidence details */}
      {evidence && (
        <Grid container>
          <Grid size={12} mt={1}>
            <Grid container>
              <Grid size={5} textAlign="right">
                <Typography
                  component="span"
                  sx={{
                    fontSize: { xs: 14, sm: 16 },
                    paddingRight: '15px',
                    borderRight: '2px solid #0084ff',
                  }}
                >
                  <b>Reference</b>
                </Typography>
              </Grid>
              <Grid size={6} textAlign="left" ml="15px">
                {evidence.doi ? (
                  <Link
                    href={`https://doi.org/${evidence.doi}`}
                    target="_blank"
                    sx={{ textDecoration: 'none' }}
                  >
                    <Typography component="span" sx={{ fontSize: { xs: 14, sm: 16 } }}>
                      {evidence.ref_figure || evidence.doi}
                    </Typography>
                  </Link>
                ) : (
                  <Typography component="span" sx={{ fontSize: { xs: 14, sm: 16 } }}>
                    {evidence.ref_figure || 'N/A'}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Grid>

          <Grid size={12} mt={1}>
            <Grid container>
              <Grid size={5} textAlign="right">
                <Typography
                  component="span"
                  sx={{
                    fontSize: { xs: 14, sm: 16 },
                    paddingRight: '15px',
                    borderRight: '2px solid #0084ff',
                  }}
                >
                  <b>Method</b>
                </Typography>
              </Grid>
              <Grid size={6} textAlign="left" ml="15px">
                <Link
                  href="https://www.groov.bio/about/about-groovdb"
                  sx={{ textDecoration: 'none' }}
                >
                  <Typography component="span" sx={{ fontSize: { xs: 14, sm: 16 } }}>
                    {Array.isArray(evidence.method)
                      ? evidence.method.join(', ')
                      : evidence.method || 'N/A'}
                  </Typography>
                </Link>
              </Grid>
            </Grid>
          </Grid>

          {evidence.kd !== null && evidence.kd !== undefined && (
            <Grid size={12} mt={1}>
              <Grid container>
                <Grid size={5} textAlign="right">
                  <Typography
                    component="span"
                    sx={{
                      fontSize: { xs: 14, sm: 16 },
                      paddingRight: '15px',
                      borderRight: '2px solid #0084ff',
                    }}
                  >
                    <b>K<sub>d</sub></b>
                  </Typography>
                </Grid>
                <Grid size={6} textAlign="left" ml="15px">
                  <Typography component="span" sx={{ fontSize: { xs: 14, sm: 16 } }}>
                    {evidence.kd}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
}
