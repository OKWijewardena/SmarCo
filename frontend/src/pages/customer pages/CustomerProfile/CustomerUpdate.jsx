import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Toolbar, TextField, IconButton, Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LogoutIcon from '@mui/icons-material/Logout';

export default function CustomerUpdate() {

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
  const [password, setPassword] = useState('');
  const [civil_id, setCivil_id] = useState('');
  const [nationality, setNationality] = useState('');
  const [mobile, setMobile] = useState('');
  const [whatsapp_no, setWhatsapp_no] = useState('');
  const [telephone_no, setTelephone_no] = useState('');
  const [address, setAddress] = useState('');
  const [paci_number, setPaci_number] = useState('');

  // Check if the user object exists and then access the email property
  if (user) {
    const email = user.email;
    console.log('Email:', email); // You can use the email as needed
  } else {
    console.log('No user data found in session storage');
  }

  useEffect(() => {
    fetchCustomers();
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

  // const fetchCustomer = async () => {
  //   try {
  //     const res = await axios.get(`http://podsaas.online/api/customer/${user.email}`);
  //     setCustomer(res.data);
  //   } catch (error) {
  //     console.error('Error fetching customer:', error);
  //   }
  // };
  function fetchCustomers() {
    let mounted = true;
    fetch(`http://podsaas.online/api/customer/${user.email}`)
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        if (mounted) {
            setName(result.name);
            setEmail(result.email);
            setPassword(result.password);
            setCivil_id(result.civil_id);
            setNationality(result.nationality);
            setMobile(result.mobile);
            setWhatsapp_no(result.whatsapp_no);
            setTelephone_no(result.telephone_no);
            setAddress(result.address);
            setPaci_number(result.paci_number);
        }
      });
    return () => (mounted = false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const UpdatedCustomer = {
      name,
      email,
      password,
      civil_id,
      nationality,
      mobile,
      whatsapp_no,
      telephone_no,
      address,
      paci_number
    };

    try {
      await axios.put(`http://podsaas.online/api/customer/${email}`, UpdatedCustomer);
      alert("New Customer updated successfully");
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
      
        <Box component="form" sx={{ mt: 1, alignItems: 'center' }} onSubmit={handleSubmit}>
        <Typography component="h1"  gutterBottom sx={{ fontFamily: 'Public Sans, sans-serif', fontWeight: 'bold', color:"#637381" }}>
          Update Your Details
        </Typography>
          <TextField margin="normal" required fullWidth label="User Name" value={name} InputLabelProps={{ shrink: true }}  onChange={(e) => {
                      setName(e.target.value);
                    }}/>
          <TextField margin="normal" required fullWidth label="E-mail" value={email} InputLabelProps={{ shrink: true }}  onChange={(e) => {
                      setEmail(e.target.value);
                    }}/>
          <TextField margin="normal" required fullWidth label="Mobile Number" value={mobile} InputLabelProps={{ shrink: true }}  onChange={(e) => {
                      setMobile(e.target.value);
                    }}/>
          <TextField margin="normal" required fullWidth label="WhatsApp Number" value={whatsapp_no} InputLabelProps={{ shrink: true }}  onChange={(e) => {
                      setWhatsapp_no(e.target.value);
                    }}/>
          <TextField margin="normal" required fullWidth label="Telephone Number" value={telephone_no} InputLabelProps={{ shrink: true }}  onChange={(e) => {
                      setTelephone_no(e.target.value);
                    }}/>
          <TextField margin="normal" required fullWidth label="Address" value={address} InputLabelProps={{ shrink: true }}  onChange={(e) => {
                      setAddress(e.target.value);
                    }}/>
          <TextField margin="normal" required fullWidth label="Nationality" value={nationality} InputLabelProps={{ shrink: true }}  onChange={(e) => {
                      setNationality(e.target.value);
                    }}/>
          <TextField margin="normal" required fullWidth label="Civil ID" value={civil_id} InputLabelProps={{ shrink: true }}  onChange={(e) => {
                      setCivil_id(e.target.value);
                    }}/>
          <TextField margin="normal" required fullWidth label="Paci Number" value={paci_number} InputLabelProps={{ shrink: true }}  onChange={(e) => {
                      setPaci_number(e.target.value);
                    }}/>
          <TextField sx={{ display: 'none' }} margin="normal" required fullWidth label="Password" type="password" value={password} InputLabelProps={{ shrink: true }}  onChange={(e) => {
                      setPassword(e.target.value);
                    }}/>
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
    </Container>
  );
}
