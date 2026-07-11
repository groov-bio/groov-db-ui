import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CookieConsent, { Cookies, getCookieConsentValue } from 'react-cookie-consent';
import NavigationBar from './Components/NavigationBar.js';
import AddSensor from './Components/addSensor/AddSensor.js';
import EditSensor from './Components/EditSensor.js';
import EditSensorV2 from './Components/EditSensorV2.js';
import Home from './Components/Home.js';
import RegFamilyTiles from './Components/RegFamilyTiles.js';
import SensorPage from './Components/Sensor_Components/SensorPage.js';
import SensorPageV2 from './Components/Sensor_Components/SensorPageV2.js';
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
import { withCacheBust } from './lib/utils.js';
import { Amplify } from 'aws-amplify';
import useUserStore from './zustand/user.store';
import useFeatureFlagsStore from './zustand/featureFlags.store';
import awsConfig from './aws-exports.js';
import { checkAuthStatus } from './utils/auth.js';

Amplify.configure(awsConfig);

const queryClient = new QueryClient();

const GA_TRACKING_ID = 'G-NRFVY69VS2';

function clearAnalyticsCookies() {
  const gaCookieNames = document.cookie
    .split(';')
    .map((c) => c.trim().split('=')[0])
    .filter((name) => /^_ga/.test(name) || name === '_gid' || name === '_gat');

  const hostname = window.location.hostname;
  const rootDomain = '.' + hostname.split('.').slice(-2).join('.');

  gaCookieNames.forEach((name) => {
    Cookies.remove(name);
    Cookies.remove(name, { domain: hostname });
    Cookies.remove(name, { domain: rootDomain });
  });
}

function loadGoogleAnalytics() {
  if (window.gaLoaded) return;

  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.gtag('js', new Date());
  window.gtag('config', GA_TRACKING_ID);
  window.gaLoaded = true;
}

export default function App() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const setUser = useUserStore((context) => context.setUser);
  const { setFlags, setLoading, setError } = useFeatureFlagsStore();
  const [showBanner, setShowBanner] = useState(
    getCookieConsentValue('groov-cookie-consent') === undefined
  );

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

  // Fetch feature flags on app initialization
  useEffect(() => {
    const fetchFeatureFlags = async () => {
      setLoading(true);
      try {
        // Cache-bust: feature-flags.json is served with no Cache-Control, so a
        // browser that cached an older copy (before a flag like v2_sensor_tables
        // was added) keeps reading stale flags and renders the wrong UI. This is
        // the gate for the whole V2 UI, so it matters most of all the fetches.
        const response = await fetch(withCacheBust('https://groov-api.com/feature-flags.json'));
        if (!response.ok) {
          throw new Error(`Failed to fetch feature flags: ${response.status}`);
        }
        const flags = await response.json();
        setFlags(flags);
      } catch (err) {
        console.error('Error fetching feature flags:', err);
        setError(err.message);
        // Set empty object as fallback so app continues to work
        setFlags({});
      }
    };

    fetchFeatureFlags();
  }, [setFlags, setLoading, setError]);

  useEffect(() => {
    if (getCookieConsentValue('groov-cookie-consent') === 'true') {
      loadGoogleAnalytics();
    } else {
      clearAnalyticsCookies();
    }
  }, []);

  const handleCloseBanner = () => {
    Cookies.set('groov-cookie-consent', 'false', { expires: 365 });
    setShowBanner(false);
  };

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
              <Route path="/sensor/:id" element={<SensorPageV2 />} />
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
                path="/editSensor/v2/:id"
                element={
                  <RequireAuth>
                    <EditSensorV2 />
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
        {showBanner && (
          <CookieConsent
            location="bottom"
            cookieName="groov-cookie-consent"
            enableDeclineButton
            onAccept={loadGoogleAnalytics}
            onDecline={() => setShowBanner(false)}
            buttonText="Accept"
            declineButtonText="Decline"
            style={{
              background: 'black',
              padding: '16px 40px',
              alignItems: 'center',
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 300,
              fontSize: '14px',
              boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
              justifyContent: 'center',
              gap: '20px',
            }}
            contentStyle={{
              flex: '0 1 auto',
              margin: '8px 20px 8px 0',
            }}
            buttonStyle={{
              background: '#fffa91',
              color: 'black',
              fontSize: '14px',
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 500,
              borderRadius: '4px',
              padding: '10px 28px',
              margin: '0 8px',
              border: 'none',
              cursor: 'pointer',
            }}
            declineButtonStyle={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.4)',
              color: '#fff',
              fontSize: '14px',
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 300,
              borderRadius: '4px',
              padding: '10px 28px',
              margin: '0 8px',
              cursor: 'pointer',
            }}
          >
            We use cookies to analyze site traffic.
            <IconButton
              onClick={handleCloseBanner}
              size="small"
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: 'rgba(255,255,255,0.6)',
                '&:hover': { color: 'white' },
              }}
              aria-label="close"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </CookieConsent>
        )}
      </CustomThemeProvider>
    </QueryClientProvider>
  );
}
