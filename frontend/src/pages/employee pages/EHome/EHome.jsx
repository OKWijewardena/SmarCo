import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { mainListItems } from '../listItems';
import { Paper, Button } from '@mui/material';
import image1 from '../../../images/1.png';
import image2 from '../../../images/2.png';
import image3 from '../../../images/3.png';
import image4 from '../../../images/4.png';
import image5 from '../../../images/5.png';
import image from '../../../images/image.png';
import { Link , useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const mdTheme = createTheme();

function DashboardContent() {

  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem('user'));

  if (user) {
    const role = user.role;
    console.log('Role:', role);
    
  } else {
    console.log('No user data found in session storage');
  }

  // Check if the user's role is "admin or employee"
  if (!user || user.role !== "admin" && user.role !== "employee") {
    navigate('/not-authorized');
  }

  const [open, setOpen] = React.useState(true);
  const [payments, setPayments] = useState([]);
  const [soldDevicesCount, setSoldDevicesCount] = useState(0);
  const [unsoldDevicesCount, setUnSoldDevicesCount] = useState(0);
  const [monthlyInstallments, setMonthlyInstallments] = useState(0)

  useEffect(() => {
    fetchPayments();
    fetchSelinngDetails();
    fetchDeviceDetails();
    fetchMonthlySellingDetails();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get('http://localhost:8000/payment/getPayment');
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const fetchSelinngDetails = async () => {
    try {
      const response = await axios.get('http://localhost:8000/selling/getSelling');
      setSoldDevicesCount(response.data.length); // Assuming each device represents a sold device
    } catch (error) {
      console.error('Error fetching device details:', error);
    }
  };

  const fetchDeviceDetails = async () => {
    try {
      const response = await axios.get('http://localhost:8000/device/getDevice');
      setUnSoldDevicesCount(response.data.length); // Assuming each device represents a sold device
    } catch (error) {
      console.error('Error fetching device details:', error);
    }
  };

  const fetchMonthlySellingDetails = async () => {
    try {
      const response = await axios.get('http://localhost:8000/selling/getSelling');
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const currentMonthSellings = response.data.filter(selling => {
        const sellingDate = new Date(selling.date);
        return sellingDate.getMonth() === currentMonth && sellingDate.getFullYear() === currentYear;
      });

      setMonthlyInstallments(currentMonthSellings.length);
    } catch (error) {
      console.error('Error fetching selling details:', error);
    }
  };


  const calculateDailyIncome = () => {
    const today = new Date().toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
    const totalDailyIncome = payments.reduce((total, payment) => {
      const paymentDate = new Date(payment.date).toISOString().split('T')[0];
      if (paymentDate === today) {
        return total + parseFloat(payment.price);
      }
      return total;
    }, 0);
    return totalDailyIncome;
  };
  
  const calculateMonthlyIncome = () => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // Months are 0-based, so add 1
    const currentYear = today.getFullYear();
    const totalMonthlyIncome = payments.reduce((total, payment) => {
      const paymentDate = new Date(payment.date);
      const paymentMonth = paymentDate.getMonth() + 1;
      const paymentYear = paymentDate.getFullYear();
      if (paymentMonth === currentMonth && paymentYear === currentYear) {
        return total + parseFloat(payment.price);
      }
      return total;
    }, 0);
    return totalMonthlyIncome;
  };
  
  const dailyIncome = calculateDailyIncome();
  const monthlyIncome = calculateMonthlyIncome();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar sx={{backgroundColor: 'white', color: '#637381'}}position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
            component="h1"
            variant="h6"
            noWrap
            sx={{ 
              flexGrow: 1, 
              background: 'linear-gradient(90deg, #C63DE7, #752888)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: 'Public Sans, sans-serif',
              fontWeight: 'bold',
            }}
          >
            SMARTCO
          </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="" sx={{ mt: 4, mb: 4 }}>
          <Box sx={{ flexGrow: 1, p: 2 }}>
          <Grid container spacing={3}>
        {/* Welcome Card */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              background: 'linear-gradient(90deg, rgba(198, 61, 231, 0.2), rgba(117, 40, 136, 0.2))',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#752888', fontFamily: 'Public Sans, sans-serif',
              fontWeight: 'bold', }}>
                Welcome back 👋
              </Typography>
              <Typography variant="h6" component="h3" gutterBottom sx={{ color: '#752888', fontFamily: 'Public Sans, sans-serif',
              fontWeight: 'bold', }}>
                Admin or Employee
              </Typography>
              <Typography variant="body1" component="p" gutterBottom sx={{ color: '#752888', fontFamily: 'Public Sans, sans-serif' }}>
              As a Admin or Employee, you can manage customers, employees, devices, sales, payments.
              </Typography>
            </Box>
            <Box
              component="img"
              sx={{ height: '100%', width: 'auto', maxHeight: '150px', ml: 3 }}
              src={image}
              alt="Welcome Illustration"
            />
          </Paper>
        </Grid>
        {/* Daily Income */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 2 }}>
            <Box>
              <Typography variant="body1" component="p" gutterBottom>
              Daily Income
              </Typography>
              <Typography variant="h4" component="p">
              {dailyIncome}
              </Typography>
            </Box>
            <Box>
              <img src={image1} alt="Chart" style={{ height: '50px' }} />
            </Box>
          </Paper>
        </Grid>
        {/* Monthly Income */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 2 }}>
            <Box>
              <Typography variant="body1" component="p" gutterBottom>
                Monthly Income
              </Typography>
              <Typography variant="h4" component="p">
              {monthlyIncome}
              </Typography>
            </Box>
            <Box>
              <img src={image2} alt="Chart" style={{ height: '50px' }} />
            </Box>
          </Paper>
        </Grid>
        {/* Sold Devices */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 2 }}>
            <Box>
              <Typography variant="body1" component="p" gutterBottom>
              Sold Devices
              </Typography>
              <Typography variant="h4" component="p">
              {soldDevicesCount}
              </Typography>
            </Box>
            <Box>
              <img src={image3} alt="Chart" style={{ height: '50px' }} />
            </Box>
          </Paper>
        </Grid>
        {/* Unsold Devices */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 2 }}>
            <Box>
              <Typography variant="body1" component="p" gutterBottom>
              Unsold Devices
              </Typography>
              <Typography variant="h4" component="p">
              {unsoldDevicesCount}
              </Typography>
            </Box>
            <Box>
              <img src={image4} alt="Chart" style={{ height: '50px' }} />
            </Box>
          </Paper>
        </Grid>
        {/* Monthly Installments */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 2 }}>
            <Box>
              <Typography variant="body1" component="p" gutterBottom>
              Monthly Installments
              </Typography>
              <Typography variant="h4" component="p">
                {monthlyInstallments}
              </Typography>
            </Box>
            <Box>
              <img src={image5} alt="Chart" style={{ height: '50px' }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Home() {
  return <DashboardContent />;
}
