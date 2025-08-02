import React, { useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

import GenomeContext from './GenomeContext.js';
import LigandViewer from './LigandViewer.js';
import ReferenceViewer from './ReferenceViewer.js';
import SeqViewer from './SeqViewer.js';
import DNAbinding from './DNAbinding.js';
import MetadataTable from './MetadataTable.js';
import ProteinStructure from './ProteinStructure';

import { Box, Grid, Typography, Button, Skeleton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

import useSensorStore from '../../zustand/sensor.store.js';
import useUserStore from '../../zustand/user.store.js';

import { getFirstTwoWords } from '../../lib/utils.js';

export default function SensorPage({ isAdmin, user }) {
  
  const {family, uniprotID } = useParams();
  
  const navigate = useNavigate();
  const location = useLocation();
  // access data from zustand store
  const setSensorData = useSensorStore((context) => context.setSensorData);
  const sensorData = useSensorStore((context) => context.sensorData[uniprotID]);
  const currentUser = useUserStore((context) => context.user);

  const isAdminPath = location.pathname.startsWith('/admin');

  const placement = {
    ligMT: 0,
    ligMB: 0,
  };

  useEffect(() => {
    // Only fetch if the data isn't already loaded in the zustand store



    if (sensorData === undefined) {
      if (family && uniprotID) {
        fetch(
          `https://groov-api.com/sensors/${family.toLowerCase()}/${uniprotID.toUpperCase()}.json`
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        <Typography
          component="div"
          style={{ marginLeft: '5%', fontSize: 28, fontWeight: 300 }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography>{message}</Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid
        container
        spacing={3}
        sx={{ minHeight: '100vh', mt: 5 }}
        justifyContent="center"
      >
        {/* Alias with Edit Button */}
        <Grid item size={12}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <Typography
              component="div"
              gutterBottom
              sx={{
                fontSize: { xs: 30, sm: 55 },
                textAlign: 'center',
                fontWeight: 300,
              }}
            >
              {sensorData === undefined ? (
                <Skeleton
                  variant="text"
                  width={200}
                  height={80}
                  animation="pulse"
                />
              ) : (
                sensorData.alias
              )}
            </Typography>
            {sensorData && !isAdminPath && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                onClick={() =>
                  navigate(
                    currentUser
                      ? `/editSensor/${family}/${uniprotID}`
                      : '/account?reason=editSensor'
                  )
                }
                sx={{
                  ml: 2,
                  display: { xs: 'none', sm: 'flex' },
                }}
              >
                Edit
              </Button>
            )}
          </Box>
          {/* Mobile edit button */}
          {sensorData && !isAdminPath && (
            <Box
              sx={{
                display: { xs: 'flex', sm: 'none' },
                justifyContent: 'center',
                mt: 1,
              }}
            >
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                onClick={() =>
                  navigate(
                    currentUser
                      ? `/editSensor/${family}/${uniprotID}`
                      : '/account?reason=editSensor'
                  )
                }
              >
                Edit
              </Button>
            </Box>
          )}
        </Grid>

        {/* About  */}
        <Grid size={3} />
        <Grid size={{xs:12, sm:6}} alignItems="center" sx={{ mb: {xs:0,sm:2} }}>
          <Typography
            component="div"
            gutterBottom
            sx={{ fontSize: { xs: 14, sm: 18 }, textAlign: 'center',
            pl: {xs:3,sm:0},
            pr: {xs:3,sm:0}
                     }}
          >
            {sensorData === undefined ? (
              <Box sx={{ textAlign: 'center' }}>
                <Skeleton
                  variant="text"
                  width="80%"
                  height={30}
                  sx={{ mx: 'auto', mb: 1 }}
                  animation="pulse"
                />
                <Skeleton
                  variant="text"
                  width="60%"
                  height={30}
                  sx={{ mx: 'auto' }}
                  animation="pulse"
                />
              </Box>
            ) : (
              sensorData.about
            )}
          </Typography>
        </Grid>
        <Grid size={3} />

        {/* Metadata Table */}
        <Grid size={{xs:0, md:3}} />
        <Grid size={{xs:12, md:6}} mb={{xs:0, sm:3}}>
          {sensorData === undefined ? (
            <Box sx={{ width: '100%' }}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 2,
                    p: 1,
                  }}
                >
                  <Skeleton
                    variant="text"
                    width={120}
                    height={30}
                    animation="pulse"
                  />
                  <Skeleton
                    variant="text"
                    width={180}
                    height={30}
                    animation="pulse"
                  />
                </Box>
              ))}
            </Box>
          ) : (
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
              }}
            />
          )}
        </Grid>
        <Grid size={3} />

        {/* Ligands  */}
        <Grid size={{xs:12, sm:10, md:5, lg:4}} mb={5}>
          {sensorData === undefined ? (
            <Box sx={{ textAlign: 'center' }}>
              <Skeleton
                variant="text"
                width={100}
                height={40}
                sx={{ mx: 'auto', mb: 2 }}
                animation="pulse"
              />
              <Skeleton
                variant="rectangular"
                width="100%"
                height={200}
                animation="pulse"
              />
            </Box>
          ) : sensorData.ligands ? (
            <LigandViewer
              ligand={sensorData.ligands}
              key={new Date().getTime()}
              placement={placement}
            />
          ) : (
            <MissingDataComponent
              title="Ligands"
              message="No ligands submitted"
            />
          )}
        </Grid>

        {/* Structure  */}
        <Grid size={{xs:10, sm:10, md:5, lg:4}} mb={5}>
          {sensorData === undefined ? (
            <Box sx={{ textAlign: 'center' }}>
              <Skeleton
                variant="text"
                width={120}
                height={40}
                sx={{ mx: 'auto', mb: 2 }}
                animation="pulse"
              />
              <Skeleton
                variant="rectangular"
                width="100%"
                height={300}
                animation="pulse"
              />
            </Box>
          ) : (
            <ProteinStructure
              key={new Date().getTime()}
              structureIDs={[
                ...(sensorData.structures ? sensorData.structures : []),
                `AF-${sensorData.uniprotID}-F1`,
              ]}
              uniprotID={sensorData.uniprotID}
            />
          )}
        </Grid>

        {/* Sequence  */}
        <Grid size={{xs:12, sm:10, md:10, lg:8}} mb={5}>
          {sensorData === undefined ? (
            <Box>
              <Skeleton
                variant="text"
                width={120}
                height={40}
                sx={{ mb: 2 }}
                animation="pulse"
              />
              <Skeleton
                variant="rectangular"
                width="100%"
                height={150}
                animation="pulse"
              />
            </Box>
          ) : (
            <SeqViewer sequence={sensorData.sequence} />
          )}
        </Grid>

        {/* Operator */}
        <Grid size={{xs:12, sm:10, md:10, lg:8}} mb={5}>
          {sensorData === undefined ? (
            <Box>
              <Skeleton
                variant="text"
                width={120}
                height={40}
                sx={{ mb: 2 }}
                animation="pulse"
              />
              <Skeleton
                variant="rectangular"
                width="100%"
                height={120}
                animation="pulse"
              />
            </Box>
          ) : sensorData.operators ? (
            <DNAbinding operator_data={sensorData.operators} />
          ) : (
            <MissingDataComponent
              title="Operators"
              message="No operators submitted"
            />
          )}
        </Grid>

        {/* Genome Context  */}
        <Grid size={{xs:12, sm:10, md:10, lg:8}} mb={5}>
          {sensorData === undefined ? (
            <Box>
              <Skeleton
                variant="text"
                width={150}
                height={40}
                sx={{ mb: 2 }}
                animation="pulse"
              />
              <Skeleton
                variant="rectangular"
                width="100%"
                height={200}
                animation="pulse"
              />
            </Box>
          ) : (
            <GenomeContext
              sensor={sensorData}
              key={new Date().getTime()}
              alias={sensorData.alias}
            />
          )}
        </Grid>

        {/* References */}
        <Grid size={{xs:12, sm:10, md:10, lg:8}}>
          {sensorData === undefined ? (
            <Box>
              <Skeleton
                variant="text"
                width={120}
                height={40}
                sx={{ mb: 2 }}
                animation="pulse"
              />
              {Array.from({ length: 3 }).map((_, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Skeleton
                    variant="text"
                    width="90%"
                    height={25}
                    animation="pulse"
                  />
                  <Skeleton
                    variant="text"
                    width="70%"
                    height={20}
                    animation="pulse"
                  />
                </Box>
              ))}
            </Box>
          ) : (
            <ReferenceViewer
              references={sensorData.fullReferences}
              key={new Date().getTime()}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
