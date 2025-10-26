import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';
import { Add } from '@mui/icons-material';

export default function FriendRequests({ friendRequests }) {
  const handleView = (userId) => {
    console.log('View user:', userId);
  };

  return (
    <Box sx={{ bgcolor: '#e8f4f8', mb: '20px', p: 2 }}>
      <List sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
        {friendRequests.map((user) => (
          <Paper
            key={user._id}
            elevation={2}
            sx={{
              mb: 2,
              borderRadius: 3,
              bgcolor: 'white',
              overflow: 'hidden',
              transition: 'all 0.2s',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            <ListItem
              sx={{
                py: 2,
                px: 2.5,
              }}
              secondaryAction={
                <IconButton 
                  edge="end" 
                  aria-label="view"
                  onClick={() => handleView(user.senderId)}
                  sx={{
                    '&:hover': {
                      bgcolor: 'rgba(30, 144, 255, 0.1)',
                    },
                  }}
                >
                  <Add sx={{ fontSize: 28, color: '#555' }} />
                </IconButton>
              }
            >
              <ListItemText
                primary={
                  <Typography variant="h6" fontWeight="600" sx={{ mb: 0.5 }}>
                    {user.senderId}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {user.createdAt}
                  </Typography>
                }
                sx={{ ml: 2 }}
              />
            </ListItem>
          </Paper>
        ))}
      </List>
    </Box>
  );
}