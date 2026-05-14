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

  // V2 form: protein lives at values.proteins[proteinIndex] with flat fields
  // (alias, uniProtID, accession). Mechanism lives on values.sensor.
  // V1 form: those fields live under values.about. Detect and normalize so the
  // preview works for both.
  const isV2 = proteinIndex !== null;
  const proteinData = isV2 ? values.proteins?.[proteinIndex] : values;

  if (!proteinData) {
    return (
      <Box mb={5}>
        <MetadataTable tableData={{}} sx={{ gridColumn: 'span 12' }} />
      </Box>
    );
  }

  const about = isV2 ? proteinData : proteinData.about || {};
  const alias = about.alias || '';
  const uniProtID = about.uniProtID || '';
  const accession = about.accession || '';
  const mechanism = isV2
    ? values.sensor?.mechanism || ''
    : about.mechanism || '';
  const family = isV2 ? proteinData.family || '' : about.family || '';

  return (
    <Box mb={5}>
      <MetadataTable
        tableData={{
          Alias: { name: alias },
          ...(family && { Family: { name: family } }),
          'Uniprot ID': {
            name: uniProtID,
            link: { url: `https://www.uniprot.org/uniprot/${uniProtID}` },
          },
          'NCBI Accession': {
            name: accession,
            link: { url: `https://www.ncbi.nlm.nih.gov/protein/${accession}` },
          },
          Mechanism: { name: mechanism },
        }}
        sx={{ gridColumn: 'span 12' }}
      />
      {proteinData.ligands?.length > 0 && (
        <LigandViewer
          sx={{ mt: '50px' }}
          ligand={proteinData.ligands}
          key={new Date().getTime()}
          placement={placement}
        />
      )}
      {proteinData.operators?.length > 0 && (
        <OperatorViewer
          uniprotID={uniProtID}
          operators={proteinData.operators}
        />
      )}
    </Box>
  );
}
