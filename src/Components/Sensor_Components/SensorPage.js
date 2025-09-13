import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

import GenomeContext from './GenomeContext.js';
import LigandViewer from './LigandViewer.js';
import ReferenceViewer from './ReferenceViewer.js';
import SeqViewer from './SeqViewer.js';
import DNAbinding from './DNAbinding.js';
import MetadataTable from './MetadataTable.js';
import ProteinStructure from './ProteinStructure';
import SinglePageView from './SinglePageView.js';

import { 
  Box, 
  Grid, 
  Typography, 
  Button, 
  Skeleton, 
  Container, 
  Card, 
  CardContent, 
  Stack, 
  Paper,
  Chip,
  Tab,
  Tabs,
  Switch,
  FormControlLabel,
  useMediaQuery,
  useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import DnaIcon from '@mui/icons-material/Biotech';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SourceIcon from '@mui/icons-material/Source';
import MenuBookIcon from '@mui/icons-material/MenuBook';

import useSensorStore from '../../zustand/sensor.store.js';
import useUserStore from '../../zustand/user.store.js';

import { getFirstTwoWords } from '../../lib/utils.js';

export default function SensorPage({ isAdmin, user, family: propFamily, uniprotID: propUniprotID }) {
  
  const urlParams = useParams();
  const family = propFamily || urlParams.family;
  const uniprotID = propUniprotID || urlParams.uniprotID;
  
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // access data from zustand store
  const setSensorData = useSensorStore((context) => context.setSensorData);
  const sensorData = useSensorStore((context) => context.sensorData[uniprotID]);
  const currentUser = useUserStore((context) => context.user);

  const isAdminPath = location.pathname.startsWith('/admin');
  const [activeTab, setActiveTab] = useState(0);
  const [isNightingaleLoaded, setIsNightingaleLoaded] = useState(false);
  const [isTabView, setIsTabView] = useState(false);

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  const placement = {
    ligMT: 0,
    ligMB: 0,
  };

  useEffect(() => {
    // Only fetch if the data isn't already loaded in the zustand store



    if (sensorData === undefined) {
      if (family && uniprotID) {
        fetch(
          isAdmin
            ? `https://api.groov.bio/getProcessedTemp?family=${family?.toUpperCase()}&sensorID=${uniprotID}`
            : `https://groov-api.com/sensors/${family.toLowerCase()}/${uniprotID.toUpperCase()}.json`,
          {
            headers: {
              Accept: 'application/json',
              Authorization: isAdmin
                ? user.cognitoUser.getSignInUserSession().getIdToken().getJwtToken()
                : null,
            },
          }
        )
          .then((res) => res.json())
          .then((data) => {
            setSensorData(data.uniprotID, data);
          });
      }
    }
  }, [uniprotID]);

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

  const MetadataChip = ({ label, value, link, id }) => {
    const content = (
      <Chip
        label={`${label}: ${value}`}
        variant="outlined"
        size="medium"
        id={id}
        sx={{ 
          m: 0.5, 
          cursor: link ? 'pointer' : 'default',
          '&:hover': link ? { backgroundColor: 'action.hover' } : {}
        }}
      />
    );
    
    return link ? (
      <Box component="a" href={link.url} target="_blank" rel="noopener" sx={{ textDecoration: 'none' }}>
        {content}
      </Box>
    ) : content;
  };

  const TabPanel = ({ children, value, index }) => {
    return (
      <div hidden={value !== index}>
        {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
      </div>
    );
  };

  if (sensorData === undefined) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
            </Grid>
          </Grid>
        </Stack>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 3 }}>
      <Stack spacing={3}>
        {/* Header Section */}
        <Paper sx={{ p: 3, borderRadius: 2, background: 'linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.05) 100%)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
                  fontWeight: 500,
                  mb: 1,
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                }}
              >
                {sensorData.alias}
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ mb: 2, lineHeight: 1.6 }}
                id="sensor-about"
              >
                {sensorData.about}
              </Typography>
              
              {/* Quick Metadata Chips */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                <MetadataChip 
                  label="Family" 
                  value={family?.toUpperCase()} 
                  id={'sensor-metadata-family'}
                />
                {/* <MetadataChip 
                  label="Type" 
                  value={sensorData.regulationType || 'Unknown'} 
                  id="sensor-metadata-type"
                />
                <MetadataChip 
                  label="Organism" 
                  value={getFirstTwoWords(sensorData.organism)} 
                  link={{
                    url: `https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?lvl=0&id=${sensorData.organismID}`
                  }}
                  id="sensor-metadata-organism"
                /> */}
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isTabView}
                    onChange={(e) => setIsTabView(e.target.checked)}
                    color="primary"
                  />
                }
                label={isTabView ? "Tab View" : "Single Page"}
                sx={{ m: 0 }}
              />
              
              {!isAdminPath && (
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<EditIcon />}
                  onClick={() =>
                    navigate(
                      currentUser
                        ? `/editSensor/${family}/${uniprotID}`
                        : '/account?reason=editSensor'
                    )
                  }
                  sx={{ borderRadius: 2 }}
                >
                  Edit Sensor
                </Button>
              )}
            </Box>

            <Grid >

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

          </Grid>



          </Box>
        </Paper>

        {/* Conditional View Rendering */}
        {isTabView ? (
          <Paper sx={{ borderRadius: 2 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant={isMobile ? 'scrollable' : 'fullWidth'}
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab icon={<DnaIcon />} label="Structure & Ligands" id="sensor-ligands-tab"/>
              <Tab icon={<SourceIcon />} label="Sequence & Operators" id="sensor-operators-tab"/>
              <Tab icon={<AccountTreeIcon />} label="Genome Context" id="sensor-genomes-tab"/>
              <Tab icon={<MenuBookIcon />} label="References" id="sensor-refs-tab"/>
            </Tabs>
          
          
          {/* Tab 1: Structure & Ligands */}
          <TabPanel value={activeTab} index={0}>
            <Container sx={{ py: 3 }}>
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, lg: 6 }}>
                  {sensorData.ligands ? (
                    <SectionCard title="Ligands" icon={<InfoIcon color="primary" />}>
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
                  <SectionCard title="Protein Structure" icon={<DnaIcon color="primary" />}>
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
            </Container>
          </TabPanel>
          
          {/* Tab 2: Sequence & Operators */}
          <TabPanel value={activeTab} index={1}>
            <Container sx={{ py: 3 }}>
              <Stack spacing={4}>
                <SectionCard title="Protein Sequence" icon={<DnaIcon color="primary" />}>
                  <SeqViewer sequence={sensorData.sequence} />
                </SectionCard>
                
                {sensorData.operators ? (
                  <SectionCard title="DNA Binding Operators" icon={<AccountTreeIcon color="primary" />}>
                    <DNAbinding operator_data={sensorData.operators} />
                  </SectionCard>
                ) : (
                  <MissingDataComponent
                    title="DNA Binding Operators"
                    message="No operators submitted"
                  />
                )}
              </Stack>
            </Container>
          </TabPanel>
          
          {/* Tab 3: Genome Context */}
          <TabPanel value={activeTab} index={2}>
            <Container sx={{ py: 3 }}>
              <SectionCard title="Genome Context" icon={<AccountTreeIcon color="primary" />}>
                <GenomeContext
                  sensor={sensorData}
                  key={new Date().getTime()}
                  alias={sensorData.alias}
                />
              </SectionCard>
            </Container>
          </TabPanel>
          
          {/* Tab 4: References */}
          <TabPanel value={activeTab} index={3}>
            <Container sx={{ py: 3 }}>
              <SectionCard title="References" icon={<SourceIcon color="primary" />}>
                <ReferenceViewer
                  references={sensorData.fullReferences}
                  key={new Date().getTime()}
                />
              </SectionCard>
            </Container>
          </TabPanel>
          </Paper>
        ) : (
          <SinglePageView
            sensorData={sensorData}
            family={family}
            isNightingaleLoaded={isNightingaleLoaded}
            setIsNightingaleLoaded={setIsNightingaleLoaded}
            placement={placement}
          />
        )}

      </Stack>
    </Container>
  );
}
