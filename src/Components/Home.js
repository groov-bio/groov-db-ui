import Search from './Search.js';
import AdvancedSearch from './AdvancedSearch.js';
import Stats from './Stats.js';

import { Box, Paper, Grid, Typography, styled, Tabs, Tab } from '@mui/material';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { useState } from 'react';

export default function Home() {
  const [searchTab, setSearchTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSearchTab(newValue);
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  return (
    <Grid
      container
      spacing={0}
      alignItems="center"
      sx={{ minHeight: '100%' }}
      style={{
        background: 'linear-gradient(to right bottom, #91baff, #ffffff)',
      }}
    >
      <Grid
        item
        xs={12}
        sm={12}
        md={6}
        sx={{ position: { xs: 'absolute', sm: 'absolute', md: 'relative' } }}
      >
        <Box
          component="img"
          sx={{
            width: { xs: '100%', sm: '100%', md: '90%' },
            opacity: { xs: '40%', sm: '40%', md: '100%' },
            marginTop: { xs: '200px', sm: '200px', md: 0 },
          }}
          src={'/Biosensor_structure.png'}
          alt="Biosensor structure"
          mb={4}
        />
      </Grid>

      {/* Spacer for mobile format */}
      <Grid item xs={1} sx={{ display: { sm: 'block', md: 'none' } }}></Grid>

      {/* Text and search bar */}
      <Grid item xs={10} sm={10} md={4}>
        <Typography
          sx={{
            fontSize: { xs: 40, md: 50 },
            mb: 1,
            mt: { xs: '-50%', sm: '-50%', md: '0%' },
            fontWeight: 300,
          }}
          component="div"
          textAlign="center"
        >
          Find your sensor
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={searchTab} onChange={handleTabChange} centered>
            <Tab label="Text Search" />
            <Tab label="Ligand Search" />
          </Tabs>
        </Box>

        {searchTab === 0 ? <Search width="100%" /> : <AdvancedSearch />}

        <Stats />
      </Grid>
    </Grid>
  );
}
