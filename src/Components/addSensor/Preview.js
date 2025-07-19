import { Alert, Box, Snackbar, Button } from '@mui/material';
import MetadataTable from '../Sensor_Components/MetadataTable';
import { useAddSensorStore } from './../../zustand/addSensor.store';
import { useEffect, useState } from 'react';
import LigandViewer from '../Sensor_Components/LigandViewer';
import OperatorViewer from '../Sensor_Components/OperatorViewer';
import { useSnackbar } from 'notistack';
import { useFormikContext } from 'formik';

export default function Preview() {
  const { values } = useFormikContext();
  // TODO
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  // useEffect(() => {
  //   if (stateData.insertFormApi.status === 'success') {
  //     enqueueSnackbar(
  //       'Thank you for submitting your sensor! We will reach out to you with any questions.',
  //       { variant: 'success', preventDuplicate: true }
  //     );
  //   } else if (stateData.insertFormApi.status === 'error') {
  //     enqueueSnackbar(stateData.insertFormApi.message, {
  //       variant: 'error',
  //       preventDuplicate: true,
  //     });
  //   }
  // }, [stateData.insertFormApi]);

  const placement = {
    ligMT: 4,
    ligMB: 5,
  };

  return (
    <Box mb={5}>
      <MetadataTable
        tableData={{
          Alias: { name: values.about.alias },
          Family: { name: values.about.family },
          'Uniprot ID': {
            name: values.about.uniProtID,
            link: {
              url: `https://www.uniprot.org/uniprot/$${values.about.uniProtID}`,
            },
          },
          'NCBI Accession': {
            name: values.about.accession,
            link: {
              url: `https://www.ncbi.nlm.nih.gov/protein/${values.about.accession}`,
            },
          },
          Mechanism: { name: values.about.mechanism },
        }}
        sx={{ gridColumn: 'span 12' }}
      />
      <LigandViewer
        sx={{ mt: '50px' }}
        ligand={values.ligands}
        key={new Date().getTime()}
        placement={placement}
      />
      <OperatorViewer
        uniprotID={values.about.uniProtID}
        operators={values.operators}
      />
    </Box>
  );
}
