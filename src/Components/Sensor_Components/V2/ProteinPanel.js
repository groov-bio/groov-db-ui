import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Container,
} from '@mui/material';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import HexagonOutlinedIcon from '@mui/icons-material/HexagonOutlined';
import SwapCallsOutlinedIcon from '@mui/icons-material/SwapCallsOutlined';
import ScatterPlotOutlinedIcon from '@mui/icons-material/ScatterPlotOutlined';
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined';

import StimulusViewer from './StimulusViewer';
import GenomeContextV2 from './GenomeContextV2';
import ReferenceViewerV2 from './ReferenceViewerV2';
import DNAbinding from '../DNAbinding';
import ProteinStructure from '../ProteinStructure';
import MetadataTable from '../MetadataTable';

const SectionCard = ({ children, title, icon }) => (
  <Card
    elevation={0}
    sx={{ height: '100%', borderRadius: 2, border: '1px solid #c5c6fc' }}
  >
    <CardContent
      sx={{
        pt: 3,
        pl: { xs: 0, sm: 3 },
        pr: { xs: 0, sm: 3 },
        '&:last-child': { pb: 3 },
      }}
    >
      {title && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, ml: { xs: 2, sm: 0 } }}>
          {icon}
          <Typography variant="h5" sx={{ fontWeight: 400 }}>
            {title}
          </Typography>
        </Box>
      )}
      {children}
    </CardContent>
  </Card>
);

const MissingDataCard = ({ title, message }) => (
  <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', borderRadius: 2 }}>
    <CardContent sx={{ textAlign: 'center', width: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 300 }}>
        {title}
      </Typography>
      <Typography color="text.secondary">{message}</Typography>
    </CardContent>
  </Card>
);

/**
 * Displays all data sections for a single v2 Protein.
 * protein: Protein object from the v2 data contract.
 * isNightingaleLoaded / setIsNightingaleLoaded: shared state for lazy-loading
 *   the nightingale-structure web component (only needs to happen once per page).
 */
export default function ProteinPanel({ protein, isNightingaleLoaded, setIsNightingaleLoaded }) {
  const origin = protein.origin?.[0];

  const metadataTableData = {
    'UniProt ID': {
      name: protein.uniprot_id,
      link: { url: `https://www.uniprot.org/uniprot/${protein.uniprot_id}` },
    },
    'RefSeq ID': {
      name: protein.refseq_id,
      link: { url: `https://www.ncbi.nlm.nih.gov/protein/${protein.refseq_id}` },
    },
    'KEGG ID': {
      name: protein.kegg_id || 'None',
      ...(protein.kegg_id && protein.kegg_id !== 'None'
        ? { link: { url: `https://www.genome.jp/dbget-bin/www_bget?${protein.kegg_id}` } }
        : {}),
    },
    ...(origin
      ? {
          Organism: {
            name: origin.organism_name,
            link: {
              url: `https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?lvl=0&id=${origin.organism_id}`,
            },
          },
        }
      : {}),
  };

  const structureIDs = [
    ...(protein.structures?.map((s) => s.ID) ?? []),
    `AF-${protein.uniprot_id}-F1`,
  ];

  const hasDNA = protein.dna?.length > 0;
  const hasStimulus = protein.stimulus?.length > 0;
  const hasContext = protein.context?.length > 0 && protein.context[0]?.operon_dir?.length > 0;
  const hasReferences = protein.references?.length > 0;

  return (
    <Container maxWidth="xl" disableGutters sx={{ py: 3 }}>
      <Stack spacing={4}>

        {/* Protein metadata */}
        <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #c5c6fc' }}>
          <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
            <MetadataTable tableData={metadataTableData} />
          </CardContent>
        </Card>

        {/* Stimulus + Structure */}
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            {hasStimulus ? (
              <SectionCard title="Stimulus" icon={<HexagonOutlinedIcon color="primary" />}>
                <StimulusViewer
                  stimulus={protein.stimulus}
                  canvasId={protein.uniprot_id}
                  key={protein.uniprot_id}
                />
              </SectionCard>
            ) : (
              <MissingDataCard title="Stimulus" message="No stimulus data submitted" />
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <SectionCard title="Structure" icon={<SwapCallsOutlinedIcon color="primary" />}>
              <ProteinStructure
                key={protein.uniprot_id}
                structureIDs={structureIDs}
                uniprotID={protein.uniprot_id}
                isComponentLoaded={isNightingaleLoaded}
                setIsComponentLoaded={setIsNightingaleLoaded}
              />
            </SectionCard>
          </Grid>
        </Grid>

        {/* DNA Binding */}
        {hasDNA ? (
          <Grid container>
            <Grid size={12}>
              <SectionCard title="DNA Binding" icon={<ScatterPlotOutlinedIcon color="primary" />}>
                <DNAbinding operator_data={protein.dna} />
              </SectionCard>
            </Grid>
          </Grid>
        ) : null}

        {/* Genome Context */}
        <Grid container>
          <Grid size={12}>
            {hasContext ? (
              <SectionCard title="Genome Context" icon={<HubOutlinedIcon color="primary" />}>
                <GenomeContextV2
                  context={protein.context}
                  alias={protein.alias}
                  key={protein.uniprot_id}
                />
              </SectionCard>
            ) : (
              <MissingDataCard title="Genome Context" message="No genome context submitted" />
            )}
          </Grid>
        </Grid>

        {/* References */}
        {hasReferences && (
          <Grid container>
            <Grid size={12}>
              <SectionCard title="References" icon={<FeedOutlinedIcon color="primary" />}>
                <ReferenceViewerV2 references={protein.references} key={protein.uniprot_id} />
              </SectionCard>
            </Grid>
          </Grid>
        )}
      </Stack>
    </Container>
  );
}
