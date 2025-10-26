import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
} from '@mui/material';

import Pin from '../assets/pin.png';
import Pinsuccess from '../assets/pinsuccess.png';

export default function AddFriend() {
  const navigate = useNavigate();

  const [nfcid, setnfcid] = useState("");
  const [isAdded, setIsAdded] = useState(false);

  const handleSubmit = async () => {
    if (!isAdded) {
      try {
        const authToken = localStorage.getItem('siwe_jwt') || localStorage.getItem('authToken');
        
        if (!authToken) {
          console.error('Authentication token not found. Please log in.');
        }

        const response = await fetch(`${import.meta.env.VITE_SERVERURL}/api/friends/scan-nfc`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({
            "nfcId": nfcid
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to scan nfc');
        }
        console.log('NFC found:', data);
        setIsAdded(true);
      } catch (err) {
        console.error(err);
      }
    }
    else {
       navigate("/profile");
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FFFFFF' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          bgcolor: '#FFFFFF',
        }}
      >
        <Container maxWidth="sm" sx={{ pb: 4 }}>
          {isAdded ? (
            <div className="text-center mt-[100px] mb-[60px]">
              <img className="mx-auto" src={Pinsuccess} alt="Pin" />
              <Typography variant="h5" fontWeight="500" mb={2}>
                Lo lograste
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                ahora tu pin esta conectado
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Acumulaste 100 capi puntos!
              </Typography>
            </div>
          ) : (
            <div className="text-center mt-[100px] mb-5">
              <img className="mx-auto" src={Pin} alt="Pin" />
              <Typography variant="h5" fontWeight="500" mb={2}>
                Acerca tu pin al Celu
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                toma su tiempo tené paciencia
              </Typography>
            </div>
          )}

          <Box sx={{ p: 3 }}>
            <Box>
              <TextField
                fullWidth
                label="NFC ID"
                value={nfcid.name}
                onChange={(e) => setnfcid(e.target.value)}
                margin="normal"
                variant="outlined"
              />
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ p: 2, bgcolor: 'white' }}>
            <Button
              onClick={handleSubmit}
              fullWidth
              variant="contained"
              size="large"
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                py: 1.5,
                fontSize: 16
              }}
            >
              {isAdded ? 'Ver mis puntos' :  'Conectar'}
            </Button>
          </Box>

        </Container>
      </Box>
    </Box>
  );
}
