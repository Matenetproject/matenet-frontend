import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  IconButton,
  MenuItem,
  LinearProgress,
  Paper,
  Container
} from '@mui/material';
import {
  SignalCellularAlt,
  Wifi,
  BatteryFull,
  ArrowBack,
  MoreVert,
  Edit as EditIcon
} from '@mui/icons-material';
import { useAccount } from 'wagmi';

const countries = [
  { value: 'ar', label: 'Argentina' },
  { value: 'mx', label: 'México' },
  { value: 'es', label: 'España' },
  { value: 'us', label: 'United States' }
];

export default function Register() {
  const navigate = useNavigate();
  const { address } = useAccount();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    country: 'ar',
    email: '',
    username: '',
    bio: '',
    photo: null,
    photoPreview: null
  });

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          photo: file,
          photoPreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = async () => {
    if (step === 1) {
      try {
        const authToken = localStorage.getItem('siwe_jwt') || localStorage.getItem('authToken');
        
        if (!authToken) {
          console.error('Authentication token not found. Please log in.');
        }

        const response = await fetch(`${import.meta.env.VITE_SERVERURL}/api/users`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({
            "walletAddress": address,
            "fullName": formData.name,
            "username": formData.username,
            "email": formData.email,
            "bio": formData.bio
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to create user');
        }
        console.log('User created:', data.user);
        setStep(step + 1);
      } catch (err) {
        console.error(err);
      }
    }
    else if (step === 2) {
      try {
        // Validate file
        if (!formData.photo) {
           console.error('No file provided');
        }

        // Validate file type (optional but recommended)
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(formData.photo.type)) {
          console.error('Invalid file type. Please upload an image (JPEG, PNG, GIF, or WebP)');
        }

        // Validate file size (optional, e.g., max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (formData.photo.size > maxSize) {
          console.error('File size too large. Maximum size is 5MB');
        }

        // Get token from parameter or localStorage
        const authToken = localStorage.getItem('siwe_jwt') || localStorage.getItem('authToken');
        
        if (!authToken) {
          console.error('Authentication token not found. Please log in.');
        }

        // Create FormData and append the file
        const uploadPhoto = new FormData();
        uploadPhoto.append('file', formData.photo);

        // Make the API call
        const response = await fetch(`${import.meta.env.VITE_SERVERURL}/api/users/profile-picture`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`
            // Note: Do NOT set Content-Type header when sending FormData
            // The browser will set it automatically with the correct boundary
          },
          body: uploadPhoto
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || data.message || 'Failed to upload profile picture');
        }

        console.log("success", data.profilePictureUrl);
        setStep(step + 1);
      } catch (error) {
        console.error(error);
      }
    }
    else if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleSave = () => {
    console.log('Form submitted:', formData);
    navigate("/profile");
  };

  const progress = (step / 3) * 100;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 2 }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden' }}>
          {/* Progress Bar */}
          <LinearProgress variant="determinate" value={progress} sx={{ height: 3 }} />

          {/* Content */}
          <Box sx={{ p: 3, minHeight: 500 }}>
            {step === 1 && (
              <Box>
                <Typography variant="h5" fontWeight="600" mb={0.5}>
                  Crear cuenta
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Contanos un poco sobre vos
                </Typography>

                <TextField
                  fullWidth
                  label="Tu nombre"
                  value={formData.name}
                  onChange={handleChange('name')}
                  margin="normal"
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  label="Tu email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  margin="normal"
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  label="@username"
                  value={formData.username}
                  onChange={handleChange('username')}
                  margin="normal"
                  variant="outlined"
                  helperText="Escribe un username para identificar a tu cuenta"
                />

                <TextField
                  fullWidth
                  label="Bio"
                  multiline
                  rows={3}
                  value={formData.bio}
                  onChange={handleChange('bio')}
                  margin="normal"
                  variant="outlined"
                  helperText={`${formData.bio.length}/160 caracteres`}
                  inputProps={{ maxLength: 160 }}
                />
              </Box>
            )}

            {step === 2 && (
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="600" mb={0.5}>
                  Elegí una foto
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={4}>
                  Selecciona una imagen
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                  <Box sx={{ position: 'relative' }}>
                    <Avatar
                      sx={{
                        width: 150,
                        height: 150,
                        bgcolor: '#e3f2fd',
                        fontSize: 48,
                        fontWeight: 600,
                        color: 'black'
                      }}
                      src={formData.photoPreview}
                    >
                      {!formData.photoPreview && 'A'}
                    </Avatar>
                  </Box>
                </Box>

                <Typography variant="h6" fontWeight="500" mb={1}>
                  Argentina
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Sube imágenes de hasta 5MB
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" mb={3}>
                  Tu foto se va a mostrar cuando interactúes.
                </Typography>

                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="photo-upload"
                  type="file"
                  onChange={handlePhotoUpload}
                />
                <label htmlFor="photo-upload">
                  <Button variant="text" component="span" sx={{ textTransform: 'none' }}>
                    Seleccionar imagen
                  </Button>
                </label>
              </Box>
            )}

            {step === 3 && (
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="600" mb={4} sx={{ textAlign: 'right' }}>
                  Bienvenida!
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                  <Box sx={{ position: 'relative' }}>
                    <Avatar
                      sx={{
                        width: 150,
                        height: 150,
                        bgcolor: '#333'
                      }}
                      src={formData.photoPreview}
                    >
                      {!formData.photoPreview && formData.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bgcolor: 'white',
                        boxShadow: 2,
                        '&:hover': { bgcolor: 'white' }
                      }}
                      size="small"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="h6" fontWeight="500" mb={1}>
                  {formData.country === 'ar' ? 'Argentina' : countries.find(c => c.value === formData.country)?.label}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Tu imagen ha sido subida con éxito
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Tu imagen se guardó en tu perfil, podés modificarla desde los ajustes del perfil.
                </Typography>
              </Box>
            )}
          </Box>

          {/* Bottom Button */}
          <Box sx={{ p: 2, bgcolor: 'white' }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={step === 3 ? handleSave : handleContinue}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                py: 1.5,
                fontSize: 16
              }}
            >
              {step === 3 ? 'Guardar' : 'Continuar'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}