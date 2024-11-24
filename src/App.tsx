import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Home from './Home';
import History from './History';
import { styled } from '@mui/material/styles';

const CustomBottomNavigationAction = styled(BottomNavigationAction)({
  outline: 'none',
  border: 'none',
  color: 'white',
});

export default function App() {
  const [value, setValue] = React.useState(0);

  return (
    <Box sx={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden' }}>
      {value === 0 && <Home />}
      {value === 1 && <History />}
      <BottomNavigation
        showLabels
        value={value}
        sx={{backgroundColor: '#333333'}}
        onChange={(_, newValue) => {
          setValue(newValue);
        }}
      >
        <CustomBottomNavigationAction label="Home" icon={<RestoreIcon />} />
        <CustomBottomNavigationAction label="History" icon={<FavoriteIcon />} />
      </BottomNavigation>
    </Box>
  );
}