import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useSearchStore from '../zustand/search.store.js';
import { withCacheBust } from '../lib/utils.js';

import {
  Autocomplete,
  CircularProgress,
  InputAdornment,
  Box,
  TextField,
  useTheme,
  useMediaQuery,
  createFilterOptions,
} from '@mui/material';

import '../css/App.css';

export default function Search() {
  //Capture screen size
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  //Autocomplete
  const filterOptions = createFilterOptions();
  const [searchInputValue, setSearchInputValue] = useState('');
  const [openOptions, setOpenOptions] = useState(true);

  //Update stats in zustand store
  const setStats = useSearchStore((context) => context.setStats);
  const setData = useSearchStore((context) => context.setData);
  //State used to hold labels for dropdown
  const labels = useSearchStore((context) => context.data);

  // The V2 sensor page lives at /sensor/:id (GRV id); search links point there.
  // Fetch the V2 index once on initial load.
  useEffect(() => {
    // Only fetch if the data isn't already loaded in the zustand store
    if (labels.length > 0) return;

    fetch(withCacheBust('https://groov-api.com/v2/index.json'), {
      headers: { Accept: 'application/json' },
    })
      .then((res) => res.json())
      .then((indexData) => {
        setData(generateV2Labels(indexData.sensors || []));
        setStats(indexData.stats);
      });
  }, [labels.length, setData, setStats]);

  // Build Autocomplete labels from the V2 index shape ({ stats, sensors: [...] }).
  // Each sensor carries its GRV id, so links target the V2 route /sensor/:id.
  const generateV2Labels = (sensors) => {
    let tempLabels = [];

    sensors.forEach((sensor) => {
      const ligands = Array.isArray(sensor.ligands) ? sensor.ligands : [];
      const link = `/sensor/${sensor.id}`;

      // Show the GRV id in each row so an id search visibly matches its
      // results (and so the default filter matches on the id text too).
      ligands.forEach((ligand) => {
        tempLabels.push({
          label: `${sensor.id} — ${ligand} (${sensor.alias}/${sensor.category})`,
          link,
        });
      });

      // Keep ligand-less sensors reachable (e.g. by GRV id or regulator name).
      if (ligands.length === 0) {
        tempLabels.push({
          label: `${sensor.id} — ${sensor.alias} (${sensor.category})`,
          link,
        });
      }
    });

    return tempLabels;
  };

  /**
   * This places a limit on the number of displayed results at 10
   * Can be adjusted depending on application needs
   */
  const filterResults = (options, state) => {
    return filterOptions(options, state).slice(0, 8);
  };

  return (
    <Box component="form" noValidate autoComplete="off" justify="center">
      {
        <Autocomplete
          disablePortal={true}
          id="search-box"
          disabled={labels.length ? false : true}
          options={labels}
          sx={{ width: '100%' }}
          filterOptions={filterResults}
          //These three options below allow us to render the autocomplete after user input
          //This is more "intuitive" and works better with so many options now
          inputValue={searchInputValue}
          onInputChange={(e) => setSearchInputValue(e.target.value)}
          open={searchInputValue.length > 0}
          onClose={() => setSearchInputValue('')}
          renderInput={(
            params //Personalize input so that it displays loading indicator when API has not returned yet
          ) => {
            return (
              <TextField
                {...params}
                label={
                  labels.length ? 'Regulator or Ligand Name' : 'Loading...'
                }
                variant="outlined"
                placeholder="Enter text (e.g., RbsR)"
                // size={"small"}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <InputAdornment position="end">
                      {/* Show loading or div if not loading - the div (Box) is important to render the dropdown*/}
                      {labels.length ? <Box /> : <CircularProgress size={20} />}
                    </InputAdornment>
                  ),
                }}
              />
            );
          }}
          renderOption={(props, option) => {
            //Personalize dropdown children to be links to that sensor
            return (
              <Link
                {...props}
                style={{ textDecoration: 'none' }}
                key={option.label}
                to={option.link}
              >
                {option.label}
              </Link>
            );
          }}
        />
      }
    </Box>
  );
}
