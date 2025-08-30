import React, { useState, useEffect } from 'react';

import {
  AppBar,
  Box,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Fade,
  useMediaQuery,
  useTheme,
  Avatar,
} from '@mui/material';

import { Link } from 'react-router-dom';

import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Person from '@mui/icons-material/Person';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import { Auth } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';

import useUserStore from '../zustand/user.store';
import { checkAuthStatus, signOutUser, signIn } from '../utils/auth';
import { useThemeMode } from '../contexts/ThemeContext';

const navItems = ['Browse', 'Tools', 'About'];
const linkItems = ['/database', '/tools', '/about/about-groovdb'];

// TODO: These shouldn't be listed here AND in the About.js component.
// only one place.
const aboutTitles = [
  'About groovDB',
  'Citing',
  'Contributing',
  'Contact',
  'Change Log',
  'Programmatic Access',
  'FAQ',
];
const aboutLinks = [
  '/about/about-groovdb',
  '/about/cite',
  '/about/contributing',
  '/about/contact',
  '/about/change-log',
  '/about/programmatic-access',
  '/about/faq',
];
const indexes = [0, 1, 2];

export default function NavigationBar(props) {
  // State that defines whether or not the top left button was clicked
  const [mobileOpen, setMobileOpen] = useState(false);

  // State to manage the open/close status of the "About" dropdown
  const [aboutOpen, setAboutOpen] = useState(false);

  //To detect size of screen
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Open or close side bar menu in mobile format.
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleAboutToggle = () => {
    setAboutOpen(!aboutOpen);
  };

  const [avatarAnchorEl, setAvatarAnchorEl] = useState(null);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const handleAvatarClick = (event) => {
    setAvatarAnchorEl(event.currentTarget);
    setAvatarOpen(!avatarOpen);
  };
  const handleAvatarClose = () => {
    setAvatarAnchorEl(null);
  };

  const user = useUserStore((context) => context.user);
  const setUser = useUserStore((context) => context.setUser);
  const { isDarkMode, toggleTheme } = useThemeMode();

  // Check authentication status on component mount
  useEffect(() => {
    // Only check if we don't already have a user
    if (!user) {
      checkAuthStatus(setUser);
    }
  }, [user, setUser]);

  const handleSignOut = async () => {
    await signOutUser(setUser);
    setAvatarOpen(false);
  };

  const handleSignIn = async () => {
    await signIn();
    setAvatarOpen(false);
  };

  const determineAvatarIcon = () => {
    if (user) {
      if (user.firstName) {
        return user.firstName[0];
      } else if (user.name) {
        return user.name[0];
      }
    }
    return <Person />;
  };

  return (
    <>
      <AppBar
        component="nav"
        sx={{
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#000' : '#000',
          alignItems: { xs: 'left', sm: 'center' },
        }}
        id="top_menu_bar"
      >
        {/* Home section */}

        {/* groovDB logo that links to Home */}
        <Box
          sx={{ display: { xs: 'none', sm: 'block' } }}
          style={{ position: 'absolute', left: 0 }}
        >
          <Button sx={{ marginLeft: { sm: 1, md: 5 } }}>
            <Link to={'/home'}>
              <Box
                component="img"
                sx={{ height: '50px' }}
                src={theme.palette.mode === 'dark' ? '/groovDB_Icon_dark.png' : '/groovDB_Icon.png'}
                alt="groovDB_icon"
              />
            </Link>
          </Button>
        </Box>

        <Toolbar>
          {/* show only in mobile format */}
          {/* three little slits icon */}
          <IconButton
            disableRipple
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            {mobileOpen ? (
              <CloseIcon onClick={handleDrawerToggle} sx={{ width: 70 }} />
            ) : (
              <MenuIcon onClick={handleDrawerToggle} sx={{ width: 70 }} />
            )}
          </IconButton>

          <Box sx={{ display: { xs: 'flex', sm: 'none' }, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            <Link to="/home">
              <Box
                component="img"
                sx={{ height: '30px' }}
                src="/groovDB_icon_mobile.png"
                alt="groovDB_icon"
              />
            </Link>
          </Box>

          <Box
            sx={{ display: { xs: 'none', sm: 'block' } }}
            style={{ alignItems: 'center' }}
          >
            {/* Browse sections */}
            {indexes.map((index) => (
              <Button
                key={index}
                sx={{
                  color: '#fff',
                  marginLeft: 5,
                  marginRight: { sm: 2, md: 5 },
                }}
              >
                <Link
                  to={linkItems[index]}
                  id={navItems[index]}
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    textTransform: 'none',
                    fontSize: 20,
                    fontWeight: 300,
                  }}
                >
                  {navItems[index]}
                </Link>
              </Button>
            ))}
          </Box>
        </Toolbar>

        {/* Dark mode toggle for desktop */}
        <IconButton
          onClick={toggleTheme}
          sx={{ 
            position: 'absolute', 
            top: '50%',
            transform: 'translateY(-50%)',
            right: '80px',
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>

        <IconButton
          onClick={handleAvatarClick}
          sx={{ 
            position: 'absolute', 
            top: '50%',
            transform: 'translateY(-50%)',
            right: '10px' 
          }}
        >
          <Avatar>
            {/* Conditionally render either the first initial or person icon */}
            {determineAvatarIcon()}
            <Menu
              id="avatar-menu"
              anchorEl={avatarAnchorEl}
              open={avatarOpen}
              onClose={handleAvatarClose}
              TransitionComponent={Fade}
            >
              {user ? (
                <Box>
                  {/* user is logged in */}
                  <Link
                    key={'account'}
                    to={'/account'}
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    <MenuItem>Account</MenuItem>
                  </Link>
                  {/* Stay on the same screen by setting to="#" */}
                  <Link
                    key={'signout'}
                    to="#"
                    style={{ color: 'inherit', textDecoration: 'none' }}
                    onClick={handleSignOut}
                  >
                    <MenuItem>Sign Out</MenuItem>
                  </Link>
                </Box>
              ) : (
                <Box>
                  {/* user is not logged in */}
                  <Link
                    key={'signIn'}
                    to={'#'}
                    style={{ color: 'inherit', textDecoration: 'none' }}
                    onClick={handleSignIn}
                  >
                    <MenuItem>Sign In</MenuItem>
                  </Link>
                </Box>
              )}
            </Menu>
          </Avatar>
        </IconButton>
      </AppBar>

      {/* This is the white box that flips out from the top */}
      {mobileOpen ? (
        <List
          sx={{
            backgroundColor: 'background.paper',
            position: 'fixed',
            width: '100%',
            paddingTop: '70px',
            zIndex: 1000,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          {indexes.map((index) => (
            <React.Fragment key={index}>
              {navItems[index] === 'About' ? (
                <>
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleAboutToggle}>
                      <Typography
                        style={{
                          fontSize: 20,
                          fontWeight: 300,
                          marginRight: '75%',
                        }}
                      >
                        About
                      </Typography>
                      {aboutOpen ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={aboutOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {aboutTitles.map((title, subIndex) => (
                        <Link
                          to={aboutLinks[subIndex]}
                          onClick={handleDrawerToggle}
                          key={subIndex}
                          style={{
                            color: 'inherit',
                            textDecoration: 'none',
                            textTransform: 'none',
                            width: '100vw',
                            fontSize: 18,
                            fontWeight: 300,
                          }}
                        >
                          <ListItem key={subIndex} disablePadding>
                            <ListItemButton sx={{ pl: 4 }}>
                              {title}
                            </ListItemButton>
                          </ListItem>
                        </Link>
                      ))}
                    </List>
                  </Collapse>
                </>
              ) : (
                <ListItem disablePadding>
                  <Link
                    to={linkItems[index]}
                    onClick={handleDrawerToggle}
                    style={{
                      width: '100%',
                      textDecoration: 'None',
                    }}
                  >
                    <ListItemButton>
                      <ListItemText>
                        <Typography
                          sx={{ fontSize: 20, fontWeight: 300, color: 'text.primary' }}
                        >
                          {navItems[index]}
                        </Typography>
                      </ListItemText>
                    </ListItemButton>
                  </Link>
                </ListItem>
              )}
            </React.Fragment>
          ))}
          
          {/* Dark mode toggle for mobile */}
          <ListItem disablePadding>
            <ListItemButton onClick={toggleTheme}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                <Typography sx={{ fontSize: 20, fontWeight: 300, color: 'text.primary' }}>
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </Typography>
              </Box>
            </ListItemButton>
          </ListItem>
        </List>
      ) : null}
    </>
  );
}
