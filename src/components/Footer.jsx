import React from 'react';
import { Box, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Home, Person, PushPin, EmojiEvents } from '@mui/icons-material';

export default function Footer() {
  const [value, setValue] = React.useState(1); // 1 = Profile is active

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: 'background.paper',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
        zIndex: 1000,
      }}
    >
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        showLabels
        sx={{
          height: 80,
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '8px 12px',
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.875rem',
            fontWeight: 500,
            marginTop: '4px',
          },
          '& .Mui-selected': {
            color: '#1e90ff',
          },
        }}
      >
        <BottomNavigationAction
          label="Home"
          icon={<Home sx={{ fontSize: 28 }} />}
        />
        <BottomNavigationAction
          label="Profile"
          icon={<Person sx={{ fontSize: 28 }} />}
        />
        <BottomNavigationAction
          label="Pin"
          icon={<PushPin sx={{ fontSize: 28 }} />}
        />
        <BottomNavigationAction
          label="Rewards"
          icon={<EmojiEvents sx={{ fontSize: 28 }} />}
        />
      </BottomNavigation>
    </Box>
  );
}
