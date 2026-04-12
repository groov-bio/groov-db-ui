import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Box, Grid, Skeleton, Link as MuiLink } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import useV2SensorTableStore from '../../zustand/v2SensorTable.store.js';
import { getFirstTwoWords } from '../../lib/utils.js';

const UNIPROT_COLUMN = {
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
};

const BASE_COLUMNS = [
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
  { field: 'organism_name', headerName: 'Organism', width: 200 },
  { field: 'ligands', headerName: 'Ligands', width: 200 },
];

const ALL_COLUMNS = [...BASE_COLUMNS.slice(0, 2), UNIPROT_COLUMN, ...BASE_COLUMNS.slice(2)];

export default function SensorTableV2({ family }) {
  const isAllSensors = family === 'all';
  const storeKey = isAllSensors ? 'all' : family.toLowerCase();

  const fetchTable = useV2SensorTableStore((s) => s.fetchTable);
  const tableData = useV2SensorTableStore((s) => s.tables[storeKey]);
  const loading = useV2SensorTableStore((s) => s.loading[storeKey]);

  useEffect(() => {
    const url = isAllSensors
      ? 'https://groov-api.com/v2/index.json'
      : `https://groov-api.com/v2/indexes/${family.toLowerCase()}.json`;
    fetchTable(storeKey, url);
  }, [storeKey, isAllSensors, fetchTable]);

  const rows = useMemo(() => {
    if (!tableData?.length) return [];
    return tableData.map((sensor) => ({
      id: sensor.id,
      alias: sensor.alias,
      uniprot_id: sensor.uniprot_id,
      organism_name: getFirstTwoWords(sensor.organism_name),
      ligands: sensor.ligands?.join(', ') || 'None submitted',
    }));
  }, [tableData]);

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
            key={storeKey}
            rows={rows}
            columns={isAllSensors ? BASE_COLUMNS : ALL_COLUMNS}
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
