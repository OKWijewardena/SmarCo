import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link , useNavigate } from 'react-router-dom';
import { Toolbar, IconButton,Container, Badge, Grid, Typography, Box, Button, Card, CardContent, CardMedia } from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutIcon from '@mui/icons-material/Logout';

export default function CustomerHome() {

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

    const [sellings, setSellings] = useState([]);
    const [civilID, setCivilID] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [devices,setDevices] = useState([]);
    const [eminumbers,setEminumbers] = useState();
    const [unsoldDevicesCount, setUnSoldDevicesCount] = useState(0);

// Check if the user object exists and then access the email property
if (user) {
  const email = user.email;
  console.log('Email:', email); // You can use the email as needed
  
} else {
  console.log('No user data found in session storage');
}



    useEffect(() => {
        fetchSellings();
        fetchDeviceDetails();
    }, []);

    const NavProfile = () => {
      navigate('/customerprofile');
    }

    const handleLogout = () => {
      // Remove user details from session storage
      sessionStorage.removeItem('user');
  sessionStorage.removeItem('token');
      console.log('User details cleared from session storage');
      navigate('/');
    };

    const fetchSellings = async () => {
        try {
          const res = await axios.get(`http://podsaas.online/api/customer/${user.email}`);
    
          // Log the response to check its structure
          console.log('Response data:', res.data);
      
          // Since res.data is an object, update the state accordingly
          setCustomers([res.data]);  // Store it in an array to maintain consistency if needed
          setCivilID([res.data.civil_id]);  // Set civil_id from the object
          const CIVILID = res.data.civil_id;
      
          console.log('Civil ID:', CIVILID);

            const response = await axios.get(`http://podsaas.online/selling/getOneSelling/${CIVILID}`);
            setSellings(response.data);
            const emiNumbers = response.data.map(selling => selling.emiNumber);
            setEminumbers(emiNumbers);
            console.log(emiNumbers);
        } catch (error) {
            console.error('Error fetching devices:', error);
        }
    };

    const fetchDeviceDetails = async () => {
      try {
        const response = await axios.get('http://podsaas.online/device/getDevice');
        setUnSoldDevicesCount(response.data.length); // Assuming each device represents a sold device
      } catch (error) {
        console.error('Error fetching device details:', error);
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
  <IconButton sx={{ marginRight: 'auto' }} onClick={NavProfile} >
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
    <AccountCircleOutlinedIcon 
    />
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

      <Box textAlign="center" mb={4}>
          <Box bgcolor="secondary.light" p={4} borderRadius={2} textAlign="center" sx={{ background: 'linear-gradient(90deg, rgba(198, 61, 231, 0.2), rgba(117, 40, 136, 0.2))', marginTop: "20px", position: 'relative' }}>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item xs={12} md={8}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'black', fontFamily: 'Public Sans, sans-serif', fontWeight: 'bold' }}>
            Number of devices you can buy from us
          </Typography>
          <Typography variant="h3" color="secondary" gutterBottom>
          {unsoldDevicesCount}
          </Typography>
          <Link to="/customerdevice" style={{textDecoration: 'none', color:"black"}}>
          <Button variant="contained" sx={{ backgroundColor: '#752888','&:hover': {
                        backgroundColor: '#C63DE7',
                      }, mt: 2 }}>
            Find your device
          </Button>
          </Link>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box component="img" src="../../../images/customerImage.png" alt="Illustration" sx={{ width: '100%', maxWidth: '200px', height: 'auto' }} />
        </Grid>
      </Grid>
    </Box>
      </Box>

      <Typography variant="h5" gutterBottom>
        Your Devices
      </Typography>
      <Grid container spacing={3}>
        {sellings.map((selling) => (
          <Grid item xs={12} sm={6} md={4} key={selling._id}>
            <Link to={`/customerpurchase/${selling._id}`} style={{textDecoration: 'none', color:"black"}}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={`/images/deviceImages/${selling.imageName}`}
                alt={selling.emiNumber}               
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {selling.deviceName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Purchase Date: {selling.date}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Remaining Balance: {selling.balance}
                </Typography>
              </CardContent>
            </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
