import React, { useState } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Paper,
  Box,
  Drawer,
  Button
} from '@mui/material';
import {
  ArrowBack,
  Search,
  DragIndicator,
  Instagram,
  Facebook,
  LinkedIn,
  Link as LinkIcon,
  Edit
} from '@mui/icons-material';

import Footer from '../components/Footer';

export default function SocialLinks() {
  const [links, setLinks] = useState([
    { id: 1, name: 'Instagram', handle: '', icon: Instagram, enabled: false },
    { id: 2, name: 'Facebook', handle: '', icon: Facebook, enabled: false },
    { id: 3, name: 'LinkedIn', handle: '', icon: LinkedIn, enabled: false },
    { id: 4, name: 'Link personal', handle: '', icon: LinkIcon, enabled: true }
  ]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [linkInput, setLinkInput] = useState('');

  const handleToggle = (id) => {
    setLinks(links.map(link => 
      link.id === id ? { ...link, enabled: !link.enabled } : link
    ));
  };

  const handleEditClick = (link) => {
    setSelectedLink(link);
    setLinkInput(link.handle);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedLink(null);
    setLinkInput('');
  };

  const handleAgregar = () => {
    if (selectedLink && linkInput.trim()) {
      setLinks(links.map(link => 
        link.id === selectedLink.id ? { ...link, handle: linkInput.trim() } : link
      ));
    }
    handleDrawerClose();
  };

  const handleEliminar = () => {
    if (selectedLink) {
      setLinks(links.map(link => 
        link.id === selectedLink.id ? { ...link, handle: '', enabled: false } : link
      ));
    }
    handleDrawerClose();
  };

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ bgcolor: 'white', color: 'black', boxShadow: 'none', borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar>
          <IconButton edge="start" sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 500 }}>
            Agrega tus links
          </Typography>
          <Typography variant="body1" sx={{ color: '#666' }}>
            0 P
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 3 }}>
        <Typography variant="body1" sx={{ mb: 3, color: '#333' }}>
          Agrega tus redes sociales y otros links más para compartir con tus pines amigos.
        </Typography>

        <TextField
          fullWidth
          placeholder="Busca una red social"
          variant="outlined"
          sx={{ 
            mb: 3,
            bgcolor: 'white',
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px'
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search sx={{ color: '#666' }} />
              </InputAdornment>
            ),
          }}
        />

        <List sx={{ p: 0, gap: 2, display: 'flex', flexDirection: 'column' }}>
          {links.map((link) => {
            const IconComponent = link.icon;
            return (
              <Paper
                key={link.id}
                elevation={0}
                sx={{
                  borderRadius: '12px',
                  border: link.enabled ? '2px solid #1976d2' : '1px solid #e0e0e0',
                  bgcolor: 'white'
                }}
              >
                <ListItem
                  sx={{
                    py: 2,
                    px: 2
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <DragIndicator sx={{ color: '#999' }} />
                  </ListItemIcon>
                  <ListItemIcon sx={{ minWidth: 48 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        border: '2px solid #333',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <IconComponent sx={{ fontSize: 24 }} />
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={link.name}
                    secondary={link.handle}
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: '1rem'
                    }}
                    secondaryTypographyProps={{
                      color: '#666'
                    }}
                  />
                  <IconButton sx={{ mr: 1 }} onClick={() => handleEditClick(link)}>
                    <Edit sx={{ color: '#666' }} />
                  </IconButton>
                  <Switch
                    checked={link.enabled}
                    onChange={() => handleToggle(link.id)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#1976d2',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#1976d2',
                      },
                    }}
                  />
                </ListItem>
              </Paper>
            );
          })}
        </List>
      </Container>

      {/* Drawer for editing link */}
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: {
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            pb: 2
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconButton edge="start" onClick={handleDrawerClose} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Agrega un link
            </Typography>
          </Box>

          <TextField
            fullWidth
            placeholder="Copia o pega un link"
            variant="outlined"
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px'
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search sx={{ color: '#666' }} />
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleAgregar}
            sx={{
              mb: 1.5,
              py: 1.5,
              borderRadius: '25px',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              bgcolor: '#9e9e9e',
              '&:hover': {
                bgcolor: '#757575'
              }
            }}
          >
            Agregar
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={handleEliminar}
            sx={{
              py: 1.5,
              borderRadius: '25px',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              borderColor: '#e0e0e0',
              color: '#9e9e9e',
              '&:hover': {
                borderColor: '#bdbdbd',
                bgcolor: 'transparent'
              }
            }}
          >
            Eliminar
          </Button>
        </Box>
      </Drawer>
      <Footer />
    </Box>
  );
}
