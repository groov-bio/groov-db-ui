import { Alert, Box, Snackbar, Button } from '@mui/material';
import MetadataTable from '../Sensor_Components/MetadataTable';
import { useAddSensorStore } from './../../zustand/addSensor.store';
import { useEffect, useState } from 'react';
import LigandViewer from '../Sensor_Components/LigandViewer';
import OperatorViewer from '../Sensor_Components/OperatorViewer';
import { useSnackbar } from 'notistack';
import { useFormikContext } from 'formik';

export default function Preview({ proteinIndex = null }) {
  const { values } = useFormikContext();

  const placement = {
    ligMT: 4,
    ligMB: 5,
  };

  // V2 form: Get data from specific protein index
  // V1 form: Get data from root values
  const proteinData = proteinIndex !== null ? values.proteins?.[proteinIndex] : values;

  if (!proteinData) {
    return (
      <Box mb={5}>
        <MetadataTable
          tableData={{}}
          sx={{ gridColumn: 'span 12' }}
        />
      </Box>
    );
  }

  return (
    <Box mb={5}>
      <MetadataTable
        tableData={{
          Alias: { name: proteinData.about?.alias || '' },
          Family: { name: proteinData.about?.family || '' },
          'Uniprot ID': {
            name: proteinData.about?.uniProtID || '',
            link: {
              url: `https://www.uniprot.org/uniprot/$${proteinData.about?.uniProtID || ''}`,
            },
          },
          'NCBI Accession': {
            name: proteinData.about?.accession || '',
            link: {
              url: `https://www.ncbi.nlm.nih.gov/protein/${proteinData.about?.accession || ''}`,
            },
          },
          Mechanism: { name: proteinData.about?.mechanism || '' },
        }}
        sx={{ gridColumn: 'span 12' }}
      />
      <LigandViewer
        sx={{ mt: '50px' }}
        ligand={proteinData.ligands || []}
        key={new Date().getTime()}
        placement={placement}
      />
      <OperatorViewer
        uniprotID={proteinData.about?.uniProtID || ''}
        operators={proteinData.operators || []}
      />
    </Box>
  );
}
