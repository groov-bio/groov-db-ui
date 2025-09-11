import React from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Container, 
  Card, 
  CardContent, 
  Stack, 
  Button 
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import SourceIcon from '@mui/icons-material/Source';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import HexagonOutlinedIcon from '@mui/icons-material/HexagonOutlined';
import SwapCallsOutlinedIcon from '@mui/icons-material/SwapCallsOutlined';
import ClearAllOutlinedIcon from '@mui/icons-material/ClearAllOutlined';
import ScatterPlotOutlinedIcon from '@mui/icons-material/ScatterPlotOutlined';
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined';

import GenomeContext from './GenomeContext.js';
import LigandViewer from './LigandViewer.js';
import ReferenceViewer from './ReferenceViewer.js';
import SeqViewer from './SeqViewer.js';
import DNAbinding from './DNAbinding.js';
import MetadataTable from './MetadataTable.js';
import ProteinStructure from './ProteinStructure.js';

import { getFirstTwoWords } from '../../lib/utils.js';

export default function SinglePageView({ 
  sensorData, 
  family, 
  isNightingaleLoaded, 
  setIsNightingaleLoaded,
  placement 
}) {
  const MissingDataComponent = ({ title, message }) => {
    return (
      <Card sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
        <CardContent sx={{ textAlign: 'center', width: '100%' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 300 }}>
            {title}
          </Typography>
          <Typography color="text.secondary">
            {message}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  const SectionCard = ({ children, title, icon, dense = false }) => {
    return (
      <Card sx={{ height: '100%', borderRadius: 2 }}>
        <CardContent sx={{ p: dense ? 2 : 3, '&:last-child': { pb: dense ? 2 : 3 } }}>
          {title && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              {icon}
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {title}
              </Typography>
            </Box>
          )}
          {children}
        </CardContent>
      </Card>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Stack spacing={4}>
        {/* Overview Section */}
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionCard title="Sensor Information" icon={<InfoIcon color="primary" />}>
              <MetadataTable
                tableData={{
                  'Regulation Type': {
                    name: sensorData.regulationType.length
                      ? sensorData.regulationType
                      : 'Unavailable',
                  },
                  'Uniprot ID': {
                    name: sensorData.uniprotID,
                    link: {
                      url: `https://www.uniprot.org/uniprot/${sensorData.uniprotID}`,
                    },
                  },
                  'RefSeq ID': {
                    name: sensorData.accession,
                    link: {
                      url: `https://www.ncbi.nlm.nih.gov/protein/${sensorData.accession}`,
                    },
                  },
                  'KEGG ID': {
                    name: sensorData.keggID ? sensorData.keggID : 'None',
                    ...(sensorData.keggID !== 'None' && {
                      link: {
                        url: `https://www.genome.jp/dbget-bin/www_bget?${sensorData.keggID}`,
                      },
                    }),
                  },
                  Organism: {
                    name: getFirstTwoWords(sensorData.organism),
                    link: {
                      url: `https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?lvl=0&id=${sensorData.organismID}`,
                    },
                  },
                  'Protein Length': {
                    name: sensorData.sequence.length,
                  },
                }}
              />
            </SectionCard>
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionCard title="External Database Links" icon={<SourceIcon color="primary" />}>
              <Stack spacing={2}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  href={`https://www.uniprot.org/uniprot/${sensorData.uniprotID}`}
                  target="_blank"
                  sx={{ justifyContent: 'flex-start' }}
                >
                  View in UniProt
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  href={`https://www.ncbi.nlm.nih.gov/protein/${sensorData.accession}`}
                  target="_blank"
                  sx={{ justifyContent: 'flex-start' }}
                >
                  View in NCBI
                </Button>
                {sensorData.keggID && sensorData.keggID !== 'None' && (
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    href={`https://www.genome.jp/dbget-bin/www_bget?${sensorData.keggID}`}
                    target="_blank"
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    View in KEGG
                  </Button>
                )}
                <Button 
                  variant="outlined" 
                  fullWidth 
                  href={`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?lvl=0&id=${sensorData.organismID}`}
                  target="_blank"
                  sx={{ justifyContent: 'flex-start' }}
                >
                  View Organism in NCBI Taxonomy
                </Button>
              </Stack>
            </SectionCard>
          </Grid>
        </Grid>

        {/* Structure & Ligands Section */}
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, lg: 6 }}>
            {sensorData.ligands ? (
              <SectionCard title="Ligands" icon={<HexagonOutlinedIcon size="medium" color="primary" />}>
                <LigandViewer
                  ligand={sensorData.ligands}
                  key={new Date().getTime()}
                  placement={placement}
                />
              </SectionCard>
            ) : (
              <MissingDataComponent
                title="Ligands"
                message="No ligands submitted"
              />
            )}
          </Grid>
          
          <Grid size={{ xs: 12, lg: 6 }}>
            <SectionCard title="Structure" icon={<SwapCallsOutlinedIcon color="primary" />}>
              <ProteinStructure
                key={new Date().getTime()}
                structureIDs={[
                  ...(sensorData.structures ? sensorData.structures : []),
                  `AF-${sensorData.uniprotID}-F1`,
                ]}
                uniprotID={sensorData.uniprotID}
                isComponentLoaded={isNightingaleLoaded}
                setIsComponentLoaded={setIsNightingaleLoaded}
              />
            </SectionCard>
          </Grid>
        </Grid>

        {/* Sequence & Operators Section */}
        <Grid container spacing={4}>
          <Grid size={12}>
            <SectionCard title="Sequence" icon={<ClearAllOutlinedIcon color="primary" />}>
              <SeqViewer sequence={sensorData.sequence} />
            </SectionCard>
          </Grid>
          
          {sensorData.operators && (
            <Grid size={12}>
              <SectionCard title="DNA Binding" icon={<ScatterPlotOutlinedIcon color="primary" />}>
                <DNAbinding operator_data={sensorData.operators} />
              </SectionCard>
            </Grid>
          )}
        </Grid>

        {/* Genome Context Section */}
        <Grid container spacing={4}>
          <Grid size={12}>
            <SectionCard title="Genome Context" icon={<AccountTreeIcon color="primary" />}>
              <GenomeContext
                sensor={sensorData}
                key={new Date().getTime()}
                alias={sensorData.alias}
              />
            </SectionCard>
          </Grid>
        </Grid>

        {/* References Section */}
        <Grid container spacing={4}>
          <Grid size={12}>
            <SectionCard title="References" icon={<FeedOutlinedIcon color="primary" />}>
              <ReferenceViewer
                references={sensorData.fullReferences}
                key={new Date().getTime()}
              />
            </SectionCard>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}