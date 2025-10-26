import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
} from '@mui/material';
import {
  ArrowBack,
  Settings,
  Instagram,
  Facebook,
  LinkedIn,
  WhatsApp,
  Edit,
  AddCircleOutlineOutlined
} from '@mui/icons-material';

import Footer from '../components/Footer';
import FriendList from '../components/FriendList';

export default function Home() {
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    getUserProfile();
  }, [])
  
  async function getUserProfile() {
    try {
      // Get token from parameter or localStorage
      const authToken = localStorage.getItem('siwe_jwt') || localStorage.getItem('authToken');
      
      if (!authToken) {
        console.error('Authentication token not found. Please log in.');
      }

      const response = await fetch(`${import.meta.env.VITE_SERVERURL}/api/users/profile`, {
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
      setProfileData(data.user);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#e8f4f8' }}>
      <Container maxWidth="sm" sx={{ pb: 4 }}>
        {/* Profile Card */}
        <Card
          sx={{
            borderRadius: 4,
            mb: 3,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 3 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  border: '3px solid #fff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
                src={profileData?.profilePictureUrl}
                alt="Profile"
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight="500" gutterBottom>
                  @{profileData?.username}
                </Typography>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {profileData?.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {profileData?.email}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Bio
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {profileData?.bio}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Links */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: 2, my: '10px' }}>
          <IconButton
            sx={{
              bgcolor: '#0095f6',
              color: 'white',
              '&:hover': { bgcolor: '#0081d6' },
            }}
          >
            <Instagram />
          </IconButton>
          <IconButton
            sx={{
              bgcolor: '#1877f2',
              color: 'white',
              '&:hover': { bgcolor: '#1664d9' },
            }}
          >
            <Facebook />
          </IconButton>
          <IconButton
            sx={{
              bgcolor: '#0a66c2',
              color: 'white',
              '&:hover': { bgcolor: '#0956a8' },
            }}
          >
            <LinkedIn />
          </IconButton>
          <IconButton
            sx={{
              bgcolor: '#25d366',
              color: 'white',
              '&:hover': { bgcolor: '#20ba5a' },
            }}
          >
            <WhatsApp />
          </IconButton>
        </Box>
        
        <FriendList friendIds={profileData?.friends} />
      </Container>
      <Footer />
    </Box>
  );
}