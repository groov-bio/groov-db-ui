import React from 'react';

import { Link, Route, Routes } from 'react-router-dom';

import SensorTable from './SensorTable.js';
import DownloadAllSensors from './About/DownloadAllSensors.js';

import { Box, Grid, Typography, Button, Card, CardActionArea, useTheme, useMediaQuery } from '@mui/material';

export default function RegFamilyTiles() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  /* adjusts information displayed in table based on screen size width */
  const [dimensions, setDimensions] = React.useState({
    width: window.innerWidth,
  });

  React.useEffect(() => {
    function handleResize() {
      setDimensions({
        width: window.innerWidth,
      });
    }

    window.addEventListener('resize', handleResize);

    return (_) => {
      window.removeEventListener('resize', handleResize);
    };
  });

  const torender = [
    { image: '/TetR-family.png', family: 'TetR' },
    { image: '/LysR-family.png', family: 'LysR' },
    { image: '/AraC-family.png', family: 'AraC' },
    { image: '/MarR-family.png', family: 'MarR' },
    { image: '/LacI-family.png', family: 'LacI' },
    { image: '/GntR-family.png', family: 'GntR' },
    { image: '/LuxR-family.png', family: 'LuxR' },
    { image: '/IclR-family.png', family: 'IclR' },
    { image: '/Other-family.png', family: 'Other' },
  ];

  const MainContent = ({ family = "all" }) => {
    return (
      <Box sx={{ 
        flex: 1, 
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, md: 3 }
      }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ 
              fontSize: { xs: 24, sm: 28, md: 32 }, 
              fontWeight: 300,
              mb: 3 
            }}
          >
            {family === "all" ? "Sensor Database" : `${family} Family Sensors`}
          </Typography>
          <Typography
            variant="body1"
            sx={{ 
              fontSize: { xs: 16, md: 18 }, 
              mb: 3,
              color: 'text.secondary'
            }}
          >
            {family === "all" 
              ? isMobile 
                ? "Browse all sensors or select a family above" 
                : "Browse all sensors or select a family from the sidebar"
              : `Viewing sensors from the ${family} regulatory family`
            }
          </Typography>

          <Box 
            sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              justifyContent: 'center',
              alignItems: 'center',
              mb: 4
            }}
          >
            <DownloadAllSensors />
            <Button 
              variant="contained" 
              href="/addSensor"
              size={isMobile ? 'medium' : 'large'}
              sx={{ minWidth: { xs: 200, sm: 'auto' } }}
            >
              Add a sensor
            </Button>
          </Box>
        </Box>
        
        <SensorTable family={family} dimensions={dimensions} />
      </Box>
    );
  };

  const FamilySelectionSidebar = () => (
    <Box 
      sx={{ 
        width: { xs: '100%', md: '240px' },
        height: { xs: 'auto', md: 'calc(100vh - 120px)' },
        position: { xs: 'static', md: 'sticky' },
        top: { xs: 'auto', md: 20 },
        overflowY: { xs: 'visible', md: 'auto' },
        px: { xs: 2, md: 2 },
        py: { xs: 2, md: 3 },
        borderRight: { xs: 'none', md: '1px solid' },
        borderColor: { xs: 'transparent', md: 'divider' },
        backgroundColor: { xs: 'transparent', md: 'grey.50' },
      }}
    >
      <Typography
        variant="h6"
        sx={{ 
          textAlign: { xs: 'center', md: 'left' },
          mb: 3,
          fontSize: { xs: 18, md: 16 },
          fontWeight: 600,
          display: { xs: 'block', md: 'block' }
        }}
      >
        Regulatory Families
      </Typography>
      
      {/* Mobile: Horizontal grid */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <Grid container spacing={2} justifyContent="center">
          {torender.map((item) => (
            <Grid item xs={6} sm={4} key={item.family}>
              <Card 
                elevation={2}
                sx={{ 
                  transition: 'all 0.2s ease',
                  '&:hover': { elevation: 4 },
                }}
              >
                <CardActionArea 
                  component={Link} 
                  to={`/database/${item.family}`}
                  sx={{ p: 1.5 }}
                >
                  <Box
                    component="img"
                    src={item.image}
                    alt={`${item.family} family`}
                    sx={{
                      width: '100%',
                      height: 80,
                      objectFit: 'contain',
                    }}
                  />
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Desktop: Vertical stack */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', gap: 3 }}>
        {torender.map((item) => (
          <Card 
            key={item.family}
            elevation={2}
            sx={{ 
              transition: 'all 0.2s ease',
              backgroundColor: 'white',
              border: '1px solid',
              borderColor: 'grey.200',
              '&:hover': { 
                elevation: 4,
                transform: 'translateX(4px)',
                borderColor: 'primary.main',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              },
            }}
          >
            <CardActionArea 
              component={Link} 
              to={`/database/${item.family}`}
              sx={{ p: 2 }}
            >
              <Box
                component="img"
                src={item.image}
                alt={`${item.family} family`}
                sx={{
                  width: '100%',
                  height: 90,
                  objectFit: 'contain',
                  filter: 'contrast(1.1) brightness(1.05)',
                }}
              />
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      minHeight: 'calc(100vh - 64px)',
      gap: { xs: 0, md: 0 }
    }}>
      <FamilySelectionSidebar />
      
      <Routes>
        <Route path="/" element={<MainContent family="all" />} />
        {torender.map((item) => (
          <Route
            key={item.family}
            path={item.family + '/*'}
            element={<MainContent family={item.family} />}
          />
        ))}
      </Routes>
    </Box>
  );
}
