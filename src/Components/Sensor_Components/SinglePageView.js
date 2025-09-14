import React from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Container, 
  Card, 
  CardContent, 
  Stack, 
} from '@mui/material';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
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
import ProteinStructure from './ProteinStructure.js';


export default function SinglePageView({ 
  sensorData, 
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
      <Card elevation={0}  sx={{ height: '100%', borderRadius: 2, border: "1px solid #c5c6fc" }}>
        <CardContent sx={{ pt: dense ? 2 : 3, pl: {xs:0, sm: dense ? 2 : 3},pr: {xs:0, sm: dense ? 2 : 3}, '&:last-child': { pb: dense ? 2 : 3 } }}>
          {title && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, ml:{xs:2,sm:0} }}>
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
  };

  return (
    <Container maxWidth="xl" disableGutters sx={{ py: 3 }}>
      <Stack spacing={4}>

        {/* Structure & Ligands Section */}
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }} >
            {sensorData.ligands ? (
              <SectionCard title="Ligand" icon={<HexagonOutlinedIcon size="medium" color="primary" />}>
                <LigandViewer
                  ligand={sensorData.ligands}
                  key={new Date().getTime()}
                  placement={placement}
                />
              </SectionCard>
            ) : (
              <MissingDataComponent
                title="Ligand"
                message="No ligand submitted"
              />
            )}
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
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
            <SectionCard title="Genome Context" icon={<HubOutlinedIcon color="primary" />}>
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