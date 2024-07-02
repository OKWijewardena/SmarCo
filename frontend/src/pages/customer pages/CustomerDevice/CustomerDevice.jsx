import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, Grid, Toolbar, IconButton,Container, Badge } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

export default function CustomerDevice() {

  const navigate = useNavigate();

    const [devices, setDevices] = useState([]);

    useEffect(() => {
        fetchDevices();
    }, []);

    const backward = () => {
        navigate('/customerHome');
    };

    const handleLogout = () => {
      // Remove user details from session storage
      sessionStorage.removeItem('user');
  sessionStorage.removeItem('token');
      console.log('User details cleared from session storage');
      navigate('/');
    };

    const fetchDevices = async () => {
        try {
            const response = await axios.get('http://podsaas.online/device/getDevice');
            setDevices(response.data);
        } catch (error) {
            console.error('Error fetching devices:', error);
        }
    };

  return (
    <Container>
    <Toolbar
  sx={{
    pr: '24px',
    marginTop: '20px' // keep right padding when drawer closed
  }}
>
  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
    <IconButton color="inherit" sx={{ marginRight: 'auto' }} onClick={backward}
    >
      <Box 
    sx={{
      background: 'linear-gradient(90deg, rgba(198, 61, 231, 0.2), rgba(117, 40, 136, 0.2))',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 40,
      height: 40,
    }}
  >
      <ArrowBackIcon />
      </Box>
    </IconButton>

    <Typography
      component="h1"
      variant="h6"
      noWrap
      sx={{ 
        flexGrow: 1, 
        textAlign: 'center', 
        background: 'linear-gradient(90deg, #C63DE7, #752888)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontFamily: 'Public Sans, sans-serif',
        fontWeight: 'bold'
      }}
    >
      SMARTCO
    </Typography>
    
    <IconButton onClick={handleLogout} sx={{ marginLeft: 'auto' }}>
    <Box 
    sx={{
      background: 'linear-gradient(90deg, rgba(198, 61, 231, 0.2), rgba(117, 40, 136, 0.2))',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 40,
      height: 40,
    }}
  >
        <LogoutIcon />
      </Box>
    </IconButton>
  </Box>
</Toolbar>
    <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" align="center" sx={{ mb: 2 }}>
        Our Devices
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 2 }}>
        If you want to buy any device contact us
        <br />
        our mobile number: 071697433
      </Typography>
      <Grid container spacing={2}>
        {devices.map((device, index) => (
          <Grid item xs={12} key={index}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <img src={`${device.imageName}`}
            alt={device.deviceName} style={{ width: 60, height: 'auto', marginRight: 16 }} />
                <Box>
                  <Typography variant="h6">{device.deviceName}</Typography>
                  <Typography variant="body1">Price: {device.price}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
    </Container>
  );
}

