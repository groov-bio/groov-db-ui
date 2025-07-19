import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState } from 'react';
import Signin from './Signin';
import Signup from './Signup';

// Tabs navigation from -> https://mui.com/material-ui/react-tabs/

export default function Login() {
  const [value, setValue] = useState(0);

  const handleTabChange = (e, val) => {
    setValue(val);
  };

  const TabPanel = (props) => {
    const { children, value, index } = props;
    return value === index ? children : null;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mx: {
          xs: 4,
          sm: 0,
        },
      }}
    >
      <Tabs
        value={value}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          width: {
            xs: '100%',
            sm: '33%',
          },
          mt: 4,
        }}
      >
        <Tab label="Sign In" />
        <Tab label="Sign Up" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Signin />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Signup />
      </TabPanel>
    </Box>
  );
}
