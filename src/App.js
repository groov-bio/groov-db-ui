import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import NavigationBar from './Components/NavigationBar.js';
import AddSensor from './Components/addSensor/AddSensor.js';
import EditSensor from './Components/EditSensor.js';
import Home from './Components/Home.js';
import RegFamilyTiles from './Components/RegFamilyTiles.js';
import SensorPage from './Components/Sensor_Components/SensorPage.js';
import Account from './Components/About/Account/Account.js';
import Admin from './Components/About/Admin/Admin.js';
import About from './Components/About/About.js';
import Tools from './Components/Tools.js';
import { Routes, Route } from 'react-router-dom';
import './css/App.css';
import { useMediaQuery, useTheme } from '@mui/material';
import { CustomThemeProvider } from './contexts/ThemeContext';
import { RequireAuth } from './Components/Auth/RequireAuth';
import { RequireAdminAuth } from './Components/Auth/RequireAdminAuth';
import { Amplify } from 'aws-amplify';
import useUserStore from './zustand/user.store';
import awsConfig from './aws-exports.js';
import { checkAuthStatus } from './utils/auth.js';

Amplify.configure(awsConfig);

const queryClient = new QueryClient();

export default function App() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const setUser = useUserStore((context) => context.setUser);

  // Check for authenticated user on app initialization
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await checkAuthStatus(setUser);
      } catch (err) {
        return;
      }
    };

    checkAuth();
  }, [setUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <CustomThemeProvider>
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridTemplateRows={isSmallScreen ? `56px` : `64px`}
          gridAutoRows="auto"
          sx={{ height: '100%' }}
        >
          <Box gridColumn="span 12">
            <NavigationBar />
          </Box>
          <Box gridColumn="span 12">
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/" element={<Home />} />
              <Route path="/database/*" element={<RegFamilyTiles />} />
              <Route path="/entry/:family/:uniprotID" element={<SensorPage />} />
              <Route path="/account" element={<Account />} />
              <Route path="/account/" element={<Account />} />
              <Route
                path="/admin"
                element={
                  <RequireAdminAuth>
                    <Admin />
                  </RequireAdminAuth>
                }
              />
              <Route path="/about/*" element={<About />} />
              <Route path="/tools" element={<Tools />} />
              <Route
                path="/addSensor"
                element={
                  <RequireAuth>
                    <AddSensor />
                  </RequireAuth>
                }
              />
              <Route
                path="/editSensor/:family/:sensorID"
                element={
                  <RequireAuth>
                    <EditSensor />
                  </RequireAuth>
                }
              />
            </Routes>
          </Box>
        </Box>
      </CustomThemeProvider>
    </QueryClientProvider>
  );
}
