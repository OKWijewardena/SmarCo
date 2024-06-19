import React, { useState, useEffect } from 'react';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { useNavigate } from 'react-router-dom';
import { Toolbar, TextField, IconButton, Container, Typography, Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LogoutIcon from '@mui/icons-material/Logout';

export default function CustomerPassword() {
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem('user'));

  if (user) {
    const role = user.role;
    console.log('Role:', role);
  } else {
    console.log('No user data found in session storage');
  }

  // Check if the user's role is "customer"
  if (!user || user.role !== "customer") {
    navigate('/not-authorized');
  }

  const [customer, setCustomer] = useState({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    fetchCustomer();
  }, []);

  const backward = () => {
    navigate('/customerprofile');
  };

  const handleLogout = () => {
    // Remove user details from session storage
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    console.log('User details cleared from session storage');
    navigate('/');
  };

  const fetchCustomer = async () => {
    try {
      const res = await axios.get(`http://podsaas.online/api/users/${user.email}`);
      setCustomer(res.data);
      setName(res.data.name);
      setEmail(res.data.email);
    } catch (error) {
      console.error('Error fetching customer:', error);
    }
  };

  const handleVerify = async () => {
    const isMatch = await bcrypt.compare(oldPassword, customer.password);
    if (isMatch) {
      setIsVerified(true);
      alert('Old password verified successfully');
    } else {
      alert('Old password is incorrect');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isVerified) {
      alert('Please verify your old password first');
      return;
    }

    const UpdatedUser = {
      name,
      email,
      password: newPassword,
    };

    try {
      await axios.put(`http://podsaas.online/api/users/${email}`, UpdatedUser);
      alert("New Password updated successfully");
      navigate('/customerprofile');
    } catch (error) {
      console.error('Error updating customer:', error);
      alert(`Error adding customer: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  return (
    <Container>
      <Toolbar sx={{ pr: '24px', marginTop: '20px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <IconButton color="inherit" sx={{ marginRight: 'auto' }} onClick={backward}>
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

      <Box sx={{ mt: 1, alignItems: 'center' }}>
        <Typography component="h1" gutterBottom sx={{ fontFamily: 'Public Sans, sans-serif', fontWeight: 'bold', color:"#637381" }}>
          Add your old password
        </Typography>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Old Password"
          type="password"
          value={oldPassword}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <Button
          onClick={handleVerify}
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            mb: 2,
            backgroundColor: '#752888',
            '&:hover': {
              backgroundColor: '#C63DE7',
            },
            fontFamily: 'Public Sans, sans-serif',
            fontWeight: 'bold',
          }}
        >
          Verify
        </Button>
      </Box>

      {isVerified && (
        <Box component="form" sx={{ mt: 1, alignItems: 'center' }} onSubmit={handleSubmit}>
          <Typography component="h1" gutterBottom sx={{ fontFamily: 'Public Sans, sans-serif', fontWeight: 'bold', color:"#637381" }}>
            Update Your New Password
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: '#752888',
              '&:hover': {
                backgroundColor: '#C63DE7',
              },
              fontFamily: 'Public Sans, sans-serif',
              fontWeight: 'bold',
            }}
          >
            Submit
          </Button>
        </Box>
      )}
    </Container>
  );
}
