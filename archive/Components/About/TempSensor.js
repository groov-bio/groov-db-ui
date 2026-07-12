import React from 'react';

import {
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  Box,
} from '@mui/material';

import LigandViewer from '../Sensor_Components/LigandViewer';
import OperatorViewer from '../Sensor_Components/OperatorViewer';

export default function TempSensor(props) {
  const { data } = props;

  const about = data.about;
  const { accession, alias, mechanism } = about;
  const description = about?.about;
  const family = data.family;
  const uniprotID = data.uniProtID;
  const ligands = data?.ligands?.data;
  const operators = data?.operator?.data;

  const placement = {
    ligMT: 0,
    ligMB: 0,
  };

  return (
    <Grid container spacing={4} columns={12} mt={1} justifyContent="center">
      <Grid size={10} mb={1}>
        <TableContainer component={Paper} elevation={3}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Alias</TableCell>
                <TableCell>Family</TableCell>
                <TableCell>UniprotID</TableCell>
                <TableCell>NCBI Accession</TableCell>
                <TableCell>Mechanism</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow
                key={props.accession}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {alias}
                </TableCell>
                <TableCell>{family}</TableCell>
                <TableCell>
                  <Link
                    href={'https://www.uniprot.org/uniprot/' + uniprotID}
                    target="_blank"
                  >
                    {uniprotID}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={'https://www.ncbi.nlm.nih.gov/protein/' + accession}
                    target="_blank"
                  >
                    {accession}
                  </Link>
                </TableCell>
                <TableCell>
                  {mechanism.length ? mechanism : 'Not submitted'}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Grid size={10} mt={4}>
          <Typography variant="div" sx={{ display: 'block' }}>
            <b>About</b>
          </Typography>
          <Typography variant="div">
            {description ? description : 'No description provided'}
          </Typography>
        </Grid>
      </Grid>

      <Grid size={{xs:12, sm:6}} mb={3}>
        {ligands ? (
          <LigandViewer
            ligand={ligands}
            placement={placement}
            key={new Date().getTime()}
          />
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            <Typography>No ligands submitted</Typography>
          </Box>
        )}
      </Grid>

      <Grid size={{xs:12, sm:6}} mb={3}>
        {operators ? (
          <OperatorViewer
            uniprotID={uniprotID}
            operators={operators}
            key={new Date().getTime()}
          />
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            <Typography>No operators submitted</Typography>
          </Box>
        )}
      </Grid>
    </Grid>
  );
}
