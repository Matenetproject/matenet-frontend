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

import Pin from '../assets/pin.png';
import Footer from '../components/Footer';
import FriendRequests from '../components/FriendRequests';

export default function Profile() {
  const navigate = useNavigate();

  const [pins] = useState(0);
  const [nearby] = useState(4);
  const [profileData, setProfileData] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    getUserProfile();
    getFriendRequests();
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

  async function getFriendRequests() {
    try {
      // Get token from parameter or localStorage
      const authToken = localStorage.getItem('siwe_jwt') || localStorage.getItem('authToken');
      
      if (!authToken) {
        console.error('Authentication token not found. Please log in.');
      }

      const response = await fetch(`${import.meta.env.VITE_SERVERURL}/api/friends/requests`, {
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
        throw new Error(data.error || data.message || 'Failed to fetch friend requests');
      }

      console.log(data.requests);
      setFriendRequests(data.requests);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#e8f4f8' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          bgcolor: '#e8f4f8',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton>
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" fontWeight="bold">
            Profile
          </Typography>
        </Box>
        <Typography variant="h6" fontWeight="500">
          {profileData?.points} P
        </Typography>
      </Box>

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
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <IconButton>
                <Settings />
              </IconButton>
            </Box>

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

        {/* Tus pines */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, px: 1 }}>
          Tus pines
        </Typography>
        <Grid container spacing={2}>
          {profileData?.nfcId ? (
            <Grid item size={6}>
              <Card
                sx={{
                  borderRadius: 4,
                  mb: 3,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  py: 1,
                }}
              >
                <IconButton aria-label="delete" size="large" style={{ float: "right" }}>
                  <AddCircleOutlineOutlined />
                </IconButton>

                <img className="mx-auto w-[150px]" src={Pin} alt="Pin" />
              </Card>
            </Grid>
          ) : (
            <Grid item size={6}>
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  py: 4,
                  height: '100%',
                }}
              >
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: '#e0e0e0',
                    borderRadius: '50%',
                    mb: 3,
                  }}
                />
                <Button
                  onClick={() => navigate("/addpin")}
                  variant="contained"
                  size="large"
                  sx={{
                    borderRadius: 10,
                    px: 5,
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    bgcolor: '#1e90ff',
                    '&:hover': {
                      bgcolor: '#1c7ed6',
                    },
                  }}
                >
                  Activar
                </Button>
              </Card>
            </Grid>
          )}
        </Grid>

        {/* Buscar pines */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, px: 1 }}>
          Buscar pines
        </Typography>
        <Card
          sx={{
            borderRadius: 4,
            mb: 3,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: '#4caf50',
                    borderRadius: '50%',
                    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                  }}
                />
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: '#2196f3',
                    borderRadius: '10%',
                  }}
                />
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: '#f44336',
                    borderRadius: '50%',
                  }}
                />
              </Box>
              <Typography variant="h6" fontWeight="bold">
                {nearby} cerca
              </Typography>
              <Button
                onClick={() => navigate("/addfriend")}
                variant="contained"
                sx={{
                  borderRadius: 10,
                  px: 4,
                  py: 1,
                  textTransform: 'none',
                  fontSize: '1rem',
                  bgcolor: '#1e90ff',
                  '&:hover': {
                    bgcolor: '#1c7ed6',
                  },
                }}
              >
                Buscar
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Links */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, px: 1 }}>
          Links
        </Typography>
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '70px'
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', gap: 2 }}>
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
              <IconButton onClick={() => navigate("/sociallinks")}>
                <Edit />
              </IconButton>
            </Box>
          </CardContent>
        </Card>

        <Typography variant="h6" fontWeight="bold" sx={{ px: 1 }}>
          Solicitudes de amistad
        </Typography>
        <FriendRequests friendRequests={friendRequests} />

      </Container>
      <Footer />
    </Box>
  );
}