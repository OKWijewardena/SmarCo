import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Toolbar, IconButton, Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LogoutIcon from '@mui/icons-material/Logout';

export default function CustomerProfile() {

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

  // Check if the user object exists and then access the email property
  if (user) {
    const email = user.email;
    console.log('Email:', email); // You can use the email as needed
  } else {
    console.log('No user data found in session storage');
  }

  useEffect(() => {
    fetchCustomer();
  }, []);

  const updatePasswordButton = () => {
    navigate('/customerpassword');
  }

  const updateCustomerButton = () => {
    navigate('/customerupdate');
  }

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

  const fetchCustomer = async () => {
    try {
      const res = await axios.get(`http://podsaas.online/api/customer/${user.email}`);
      setCustomer(res.data);
    } catch (error) {
      console.error('Error fetching customer:', error);
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
      <TableContainer component={Paper} sx={{ marginTop: '20px' }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell>{customer.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>E-mail</TableCell>
              <TableCell>{customer.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Mobile</TableCell>
              <TableCell>{customer.mobile}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Whatsapp Number</TableCell>
              <TableCell>{customer.whatsapp_no}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Telephone Number</TableCell>
              <TableCell>{customer.telephone_no}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Address</TableCell>
              <TableCell>{customer.address}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Nationality</TableCell>
              <TableCell>{customer.nationality}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Civil ID</TableCell>
              <TableCell>{customer.civil_id}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Paci Number</TableCell>
              <TableCell>{customer.paci_number}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ textAlign: 'center', mt: 2, marginTop: '20px' }}>
      <Button
          variant="contained"
          sx={{
            backgroundColor: '#752888',
            '&:hover': {
              backgroundColor: '#C63DE7',
            },
          }}
          onClick={updatePasswordButton}
        >
          Update Password
        </Button>
        
      </Box>
      <Box sx={{ textAlign: 'center', mt: 2, marginTop: '20px' }}>
      <Button
          variant="contained"
          sx={{
            backgroundColor: '#752888',
            '&:hover': {
              backgroundColor: '#C63DE7',
            }
          }}
          onClick={updateCustomerButton}
        >
          Update Profile
        </Button>
      </Box>
    </Container>
  );
}
