import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Grid, Skeleton, Link as MuiLink } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import useSensorStore from '../../zustand/sensor.store.js';
import { getFirstTwoWords } from '../../lib/utils.js';

const COLUMNS = [
  {
    field: 'id',
    headerName: 'ID',
    width: 130,
    renderCell: (params) => (
      <MuiLink component={Link} to={`/sensor/${params.value}`}>
        {params.value}
      </MuiLink>
    ),
  },
  { field: 'alias', headerName: 'Alias', width: 110 },
  {
    field: 'uniprot_id',
    headerName: 'UniProt',
    width: 110,
    renderCell: (params) => (
      <MuiLink
        href={`https://www.uniprot.org/uniprot/${params.value}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {params.value}
      </MuiLink>
    ),
  },
  { field: 'organism_name', headerName: 'Organism', width: 200 },
  { field: 'ligands', headerName: 'Ligands', width: 200 },
];

export default function SensorTableV2({ family }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const isAllSensors = family === 'all';
  const storeKey = isAllSensors ? 'all' : family.toLowerCase();

  const setV2SensorTable = useSensorStore((s) => s.setV2SensorTable);
  const v2SensorTable = useSensorStore((s) => s.v2SensorTable[storeKey]);

  useEffect(() => {
    if (v2SensorTable?.length > 0) return;

    setLoading(true);
    const url = isAllSensors
      ? 'https://groov-api.com/v2/index.json'
      : `https://groov-api.com/v2/indexes/${family.toLowerCase()}.json`;

    fetch(url, { headers: { Accept: 'application/json' } })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setV2SensorTable(storeKey, data['data']))
      .catch(() => console.error('Error fetching v2 sensor data'))
      .finally(() => setLoading(false));
  }, [family, isAllSensors]);

  useEffect(() => {
    if (!v2SensorTable?.length) return;

    setRows(
      v2SensorTable.map((sensor) => ({
        id: sensor.id,
        alias: sensor.alias,
        uniprot_id: sensor.uniprot_id,
        organism_name: getFirstTwoWords(sensor.organism_name),
        ligands: sensor.ligands?.join(', ') || 'None submitted',
      }))
    );
  }, [v2SensorTable]);

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      sx={{ mt: 4 }}
    >
      <Box
        sx={{
          height: { xs: 500, md: 600 },
          width: { xs: '95%', sm: '75%', md: '60%' },
        }}
      >
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={400} animation="pulse" />
        ) : (
          <DataGrid
            key={isAllSensors ? 'v2-all-sensors' : `v2-${family}`}
            rows={rows}
            columns={COLUMNS}
            getRowId={(row) => row.id}
            pageSizeOptions={[10, 20, 30]}
            density="compact"
            sx={{ fontSize: { xs: 12, sm: 14 }, paddingLeft: 2 }}
            disableRowSelectionOnClick
            initialState={{
              pagination: { paginationModel: { pageSize: 20 } },
            }}
            showToolbar
            slotProps={{
              toolbar: {
                printOptions: { disableToolbarButton: true },
                csvOptions: { disableToolbarButton: true },
              },
            }}
          />
        )}
      </Box>
    </Grid>
  );
}
