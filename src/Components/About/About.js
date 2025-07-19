import {
  Box,
  Grid,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import React from 'react';

import AboutGroovDB from './AboutGroovDB.js';
import Contact from './Contact.js';
import ChangeLog from './ChangeLog.js';
import Cite from './Cite.js';
import Contribute from './Contribute.js';
import FAQ_Tutorial from './FAQ_Tutorial.js';
import ProgrammaticAccess from './ProgrammaticAccess.js';

import { Route, Routes, Link } from 'react-router-dom';

export default function About() {
  const theme = useTheme();
  const isNotSmallScreen = useMediaQuery(theme.breakpoints.up('sm'));

  const topics = [
    {
      id: 1,
      label: 'About groovDB',
      path: 'about-groovdb',
      component: <AboutGroovDB />,
    },
    { id: 2, label: 'Citing groovDB', path: 'cite', component: <Cite /> },
    {
      id: 3,
      label: 'Contributing',
      path: 'contributing',
      component: <Contribute />,
    },
    { id: 4, label: 'Contact', path: 'contact', component: <Contact /> },
    {
      id: 5,
      label: 'Change log',
      path: 'change-log',
      component: <ChangeLog />,
    },
    {
      id: 6,
      label: 'FAQ',
      path: 'faq',
      component: <FAQ_Tutorial />,
    },
    {
      id: 7,
      label: 'Programmatic access',
      path: 'programmatic-access',
      component: <ProgrammaticAccess />,
    },
  ];

  return (
    <Box>
      <Grid
        container
        spacing={4}
        columns={12}
        alignItems="center"
        justifyContent="center"
      >
        {isNotSmallScreen ? (
          <Drawer
            variant="permanent"
            sx={{
              width: 240,
              zIndex: 1,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: {
                width: { sm: 200, md: 240 },
                boxSizing: 'border-box',
              },
            }}
          >
            <List sx={{ marginTop: 15 }}>
              {topics.map((topic) => (
                <ListItem
                  button
                  style={{ marginLeft: '10px' }}
                  key={topic.id}
                  component={Link}
                  to={topic.path}
                >
                  <ListItemText primary={topic.label} />
                </ListItem>
              ))}
            </List>
          </Drawer>
        ) : null}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: 'background.default',
            p: 3,
            ml: 0,
            mt: 10,
          }}
        >
          <Routes>
            {/* Default About section */}
            <Route path="/about-groovdb" element={<AboutGroovDB />} />

            {topics.map((topic) => (
              <Route
                key={topic.id}
                path={topic.path}
                element={topic.component}
              />
            ))}
          </Routes>
        </Box>
      </Grid>
    </Box>
  );
}
