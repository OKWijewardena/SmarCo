import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';

export default function CustomerDevice() {
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = async () => {
        try {
            const response = await axios.get('http://localhost:8000/device/getDevice');
            setDevices(response.data);
        } catch (error) {
            console.error('Error fetching devices:', error);
        }
    };

  return (
    <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" align="center" sx={{ mb: 2, flexGrow: 1, 
              background: 'linear-gradient(90deg, #C63DE7, #752888)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: 'Public Sans, sans-serif',
              fontWeight: 'bold',
              marginTop:'20px' }}>
        SMART CO
      </Typography>
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
                <img src={`/images/deviceImages/${device.imageName}`}
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
  );
}

