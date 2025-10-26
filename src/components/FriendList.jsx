import { useEffect, useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';
import { Visibility } from '@mui/icons-material';

import Pin from '../assets/pin.png';

export default function FriendList({ friendIds = [] }) {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ bgcolor: '#e8f4f8', minHeight: '100vh' }}>
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        {/* Tabs */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            bgcolor: 'transparent',
            px: 2,
            pt: 2,
            '& .MuiTabs-indicator': {
              backgroundColor: '#1e90ff',
              height: 3,
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#555',
              bgcolor: '#d1e7f5',
              borderRadius: '8px 8px 0 0',
              mr: 1,
              '&.Mui-selected': {
                color: '#000',
                bgcolor: 'white',
              },
              '&:last-child': {
                mr: 0,
              },
            },
          }}
        >
          <Tab label="Pines Amigos" />
          <Tab label="Colección de Pines" />
        </Tabs>

        {/* Content Area */}
        <Box sx={{ bgcolor: 'white', minHeight: '70vh', p: 2 }}>
          {/* Tab 0 - Pines Amigos */}
          {tabValue === 0 && (
            <List sx={{ width: '100%' }}>
              {friendIds.map((id) => (
                <Friend id={id} />
              ))}
            </List>
          )}

          {/* Tab 1 - Colección de Pines */}
          {tabValue === 1 && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 400,
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <img
                  src={Pin}
                  alt="Pin Collection"
                  style={{ width: 150, height: 150 }}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

function Friend({ id }) {
  const [friendData, setFriendData] = useState(null);

  useEffect(() => {
    getUserProfile();
  }, [])

  async function getUserProfile() {
    try {
      console.log(id)
      // Get token from parameter or localStorage
      const authToken = localStorage.getItem('siwe_jwt') || localStorage.getItem('authToken');
      
      if (!authToken) {
        console.error('Authentication token not found. Please log in.');
      }

      const response = await fetch(`${import.meta.env.VITE_SERVERURL}/api/users/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific status codes
        if (response.status === 404) {
          throw new Error('User not found');
        }
        throw new Error(data.error || data.message || 'Failed to fetch user profile');
      }

      console.log(data.user);
      setFriendData(data.user);
    } catch (error) {
      console.error(error);
    }
  }
  

  return (
    <Paper
      key={friendData?._id}
      elevation={1}
      sx={{
        mb: 2,
        borderRadius: 3,
        bgcolor: 'white',
        overflow: 'hidden',
        border: '1px solid #f0f0f0',
      }}
    >
      <ListItem
        sx={{
          py: 1.5,
          px: 2,
        }}
        secondaryAction={
          <IconButton edge="end" aria-label="view">
            <Visibility sx={{ fontSize: 24 }} />
          </IconButton>
        }
      >
        <ListItemAvatar>
          <Avatar
            src={friendData?.profilePictureUrl}
            alt={friendData?.name}
            sx={{
              width: 48,
              height: 48,
              bgcolor: '#f5f5f5',
            }}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography variant="body1" fontWeight="600">
              {friendData?.fullName}
            </Typography>
          }
          secondary={
            <Typography variant="body2" color="text.secondary">
              {friendData?.username}
            </Typography>
          }
          sx={{ ml: 1.5 }}
        />
      </ListItem>
    </Paper>
  )
} 