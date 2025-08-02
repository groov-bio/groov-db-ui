import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useSearchStore from '../zustand/search.store.js';

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
  const setRawData = useSearchStore((context) => context.setRawData);
  //State used to hold labels for dropdown
  const labels = useSearchStore((context) => context.data);

  // Fetch data on initial load
  useEffect(() => {
    // Only fetch if the data isn't already loaded in the zustand store
    if (labels.length === 0) {
      fetch(
        'https://groov-api.com/index.json',

        {
          headers: {
            Accept: 'application/json',
          },
        }
      )
        .then((res) => res.json())
        .then((indexData) => {
          const processedData = processIndexData(indexData);
          setData(generateLabels(processedData));
          setRawData(processedData);
          setStats(processedData.stats);
        });
    }
  }, []);

  // Process raw index data to match the old API format
  const processIndexData = (indexData) => {
    try {
      if (!indexData || typeof indexData !== 'object') {
        throw new Error('Invalid index data format.');
      }

      const uniqueLigandsSet = new Set();
      const uniqueRegulatorsSet = new Set();
      const result = {};

      Object.entries(indexData).forEach(([sensorId, sensor]) => {
        if (typeof sensor !== 'object' || !sensor.alias) {
          return;
        }

        if (sensor.alias) {
          uniqueRegulatorsSet.add(sensor.alias);
        }

        if (sensor.ligands && Array.isArray(sensor.ligands)) {
          sensor.ligands.forEach((ligand) => uniqueLigandsSet.add(ligand));
        }

        result[sensorId] = {
          uniprot: sensorId || '',
          alias: sensor.alias || '',
          family: sensor.family || '',
          ligands: sensor.ligands || [],
          ligandCount: sensor.ligandCount || 0,
        };
      });

      result['stats'] = {
        ligands: uniqueLigandsSet.size,
        regulators: uniqueRegulatorsSet.size,
        sensorCount: Object.keys(result).length,
      };

      return result;
    } catch (err) {
      console.error('Data processing error:', err);
      return { stats: { ligands: 0, regulators: 0, sensorCount: 0 } };
    }
  };

  //Function to create labels which are used by Autocomplete component
  //Generating these in a particular Array format based on what the component expects
  //Returns Array
  const generateLabels = (data) => {
    let tempLabels = [];

    Object.entries(data).map(([key, value]) => {
      if (key !== 'stats') {
        for (let i = 0; i < value.ligands.length; i++) {
          let temp = `${value.ligands[i]} (${value.alias}/${value.family})`;
          tempLabels.push({
            label: temp,
            link: `/entry/${value.family}/${value.uniprot}`,
          });
        }
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
