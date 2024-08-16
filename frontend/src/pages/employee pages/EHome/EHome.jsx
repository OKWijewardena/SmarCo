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
import { mainListItems, secondaryListItems } from "../listItems";
import { Paper, Button } from '@mui/material';
import image1 from '../../../images/1.png';
import image2 from '../../../images/2.png';
import image3 from '../../../images/3.png';
import image4 from '../../../images/4.png';
import image5 from '../../../images/5.png';
import image from '../../../images/image.png';
import { Link , useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

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

  const [open, setOpen] = React.useState(true);
  const [payments, setPayments] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selling, setSelling] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [soldDevicesCount, setSoldDevicesCount] = useState(0);
  const [unsoldDevicesCount, setUnSoldDevicesCount] = useState(0);
  const [monthlyInstallments, setMonthlyInstallments] = useState(0)

  useEffect(() => {
    fetchPayments();
    fetchSelinngDetails();
    fetchDeviceDetails();
    fetchMonthlySellingDetails();
    fetchInventory();
  }, []);

  const handleLogout = () => {
    // Remove user details from session storage
    sessionStorage.removeItem('user');
sessionStorage.removeItem('token');
    console.log('User details cleared from session storage');
    navigate('/');
  };

  const fetchPayments = async () => {
    try {
      const response = await axios.get('http://app.smartco.live/payment/getPayment');
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await axios.get('http://app.smartco.live/inventory/getInventory');
      setInventory(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const fetchSelinngDetails = async () => {
    try {
      const response = await axios.get('http://app.smartco.live/selling/getSelling');
      setSoldDevicesCount(response.data.length); // Assuming each device represents a sold device
      setSelling(response.data);
    } catch (error) {
      console.error('Error fetching device details:', error);
    }
  };

  const fetchDeviceDetails = async () => {
    try {
      const response = await axios.get('http://app.smartco.live/device/getDevice');
      setUnSoldDevicesCount(response.data.length); // Assuming each device represents a sold device
      setDevices(response.data);
    } catch (error) {
      console.error('Error fetching device details:', error);
    }
  };

  const fetchMonthlySellingDetails = async () => {
    try {
      const response = await axios.get('http://app.smartco.live/selling/getSelling');
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


  const calculateDailyPaymentIncome = () => {
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

  const calculateDailySellingIncome = () => {
    const today = new Date().toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
    const totalDailyIncome = selling.reduce((total, selling) => {
      const sellingDate = new Date(selling.date).toISOString().split('T')[0];
      if (sellingDate === today) {
        return total + parseFloat(selling.advance);
      }
      return total;
    }, 0);
    return totalDailyIncome;
  }

  const calculateDailyExpence = () => {
    const today = new Date().toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
    const totalDailyExpence = devices.reduce((total, device) => {
      const paymentDate = new Date(device.purchaseDate).toISOString().split('T')[0];
      if (paymentDate === today) {
        return total + parseFloat(device.price);
      }
      return total;

    }, 0);
    return totalDailyExpence;
  }

  
  const calculateMonthlyPaymentIncome = () => {
    const today = new Date();
    const currentMonth = today.getMonth(); // Months are 0-based, so add 1
    const currentYear = today.getFullYear();
    const totalMonthlyIncome = payments.reduce((total, payment) => {
      const paymentDate = new Date(payment.date);
      const paymentMonth = paymentDate.getMonth();
      const paymentYear = paymentDate.getFullYear();
      if (paymentMonth === currentMonth && paymentYear === currentYear) {
        return total + parseFloat(payment.price);      
      }
      return total;
    }, 0);
    return totalMonthlyIncome;
  };

  const calculateMonthlySellingIncome = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const totalMonthlyIncome = selling.reduce((total, selling) => {
      const sellingDate = new Date(selling.date);
      const sellingMonth = sellingDate.getMonth();
      const sellingYear = sellingDate.getFullYear();
      if (sellingMonth === currentMonth && sellingYear === currentYear) {
        return total + parseFloat(selling.advance);
      }
      return total;
    }, 0);
    return totalMonthlyIncome;
  }

  const calculateMonthlyExpence = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const totalMonthlyExpence = devices.reduce((total, device) => {
      const paymentDate = new Date(device.purchaseDate);
      const paymentMonth = paymentDate.getMonth();
      const paymentYear = paymentDate.getFullYear();
      if (paymentMonth === currentMonth && paymentYear === currentYear) {
        return total + parseFloat(device.price);
      }
      return total;
    }, 0);
    return totalMonthlyExpence;
  }

  const calculateMonthlyAdvance = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const totalMonthlyAdvance = selling.reduce((total, selling) => {
      const paymentDate = new Date(selling.date);
      const paymentMonth = paymentDate.getMonth();
      const paymentYear = paymentDate.getFullYear();
      if (paymentMonth === currentMonth && paymentYear === currentYear) {
        return total + parseFloat(selling.advance);
      }
      return total;
    }, 0);
    return totalMonthlyAdvance;
  }

  const calculateMonthlyReseve = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const totalMonthlyReseve = selling.reduce((total, selling) => {
      const paymentDate = new Date(selling.date);
      const paymentMonth = paymentDate.getMonth();
      const paymentYear = paymentDate.getFullYear();
      if (paymentMonth === currentMonth && paymentYear === currentYear) {
        const month = selling.months;
        const customArray = selling.customArray;
        for(let i = 0; i < month; i++) {
          if(customArray[i].status === "paid"){
            total += parseFloat(customArray[i].price);
          }
        }
      }
      return total;
    },0)
    return totalMonthlyReseve;
  }

  const calculateMonthlyRemaining = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const totalMonthlyRemaining = selling.reduce((total, selling) => {
      const paymentDate = new Date(selling.date);
      const paymentMonth = paymentDate.getMonth();
      const paymentYear = paymentDate.getFullYear();
      if (paymentMonth === currentMonth && paymentYear === currentYear) {
        const month = selling.months;
        const customArray = selling.customArray;
        for(let i = 0; i < month; i++) {
          if(customArray[i].status === "unpaid"){
            total += parseFloat(customArray[i].price);
          }
        }
      }
      return total;
    },0)
    return totalMonthlyRemaining;
  }

  const calculateInventoryPrice = () => {
    const totalInventoryPrice = inventory.reduce((total, inventory) => {
        return total + parseFloat(inventory.price);
    }, 0);
    return totalInventoryPrice;
  }

  const calculateDevicePrice = () => {
    const totalDevicePrice = devices.reduce((total, device) => {
      return total + parseFloat(device.price);
    }, 0);
    return totalDevicePrice;
    }

  const calculateSellingPrice = () => {
    const totalSellingPrice = selling.reduce((total, selling) => {
        return total + parseFloat(selling.price);
    }, 0);
    return totalSellingPrice;
  }
  
  const dailyPaymentIncome = calculateDailyPaymentIncome();
  const dailySellingIncome = calculateDailySellingIncome();
  const dailyIncome = parseFloat(dailyPaymentIncome) + parseFloat(dailySellingIncome);
  const dailyExpence = calculateDailyExpence();
  const dailyProfit = parseFloat(dailyIncome) - parseFloat(dailyExpence);

  const monthlyPamentIncome = calculateMonthlyPaymentIncome();
  const monthlySellingIncome = calculateMonthlySellingIncome();
  const monthlyIncome = parseFloat(monthlyPamentIncome) + parseFloat(monthlySellingIncome);
  const monthlyExpence = calculateMonthlyExpence();
  const monthlyProfit = parseFloat(monthlyIncome) - parseFloat(monthlyExpence);

  const InventoryPrice = calculateInventoryPrice();
  const devicePrice = calculateDevicePrice();
  const SellingPrice = calculateSellingPrice();
  const purchaseCost = parseFloat(InventoryPrice) - parseFloat(devicePrice);

  const monthlyAdvance = calculateMonthlyAdvance();
  const monthlyReseve = calculateMonthlyReseve();
  const monthlyFullReseve = parseFloat(monthlyAdvance) + parseFloat(monthlyReseve);
  const monthlyRemaining = calculateMonthlyRemaining();

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
            <IconButton color="inherit" onClick={handleLogout}>
              <Badge color="secondary">
                <LogoutIcon />
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
            {secondaryListItems}
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
        {/* Daily Summary */}
<Grid item xs={12} md={4}>
<Typography variant="h5" component="p" gutterBottom>
              Daily Income Summary
              </Typography>
  <Paper
    sx={{
      p: 3,
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      justifyContent: 'space-around',
      alignItems: 'center',
      borderRadius: 2,
      boxShadow: '9px 9px 18px #d9d9d9, -9px -9px 18px #ffffff',
    }}
  >
    <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 0 } }}>
      <Typography variant="body1" component="p" gutterBottom>
        Daily Income
      </Typography>
      <Typography variant="h6" component="p" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
        {dailyIncome.toFixed(2)}
      </Typography>
    </Box>
    <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 0 } }}>
      <Typography variant="body1" component="p" gutterBottom>
        Daily Expenses
      </Typography>
      <Typography variant="h6" component="p" sx={{ fontWeight: 'bold', color: '#f44336' }}>
        {dailyExpence.toFixed(2)}
      </Typography>
    </Box>
    <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 0 } }}>
      <Typography variant="body1" component="p" gutterBottom>
        Daily Profit
      </Typography>
      <Typography variant="h6" component="p" sx={{ fontWeight: 'bold', color: '#752888' }}>
        {dailyProfit.toFixed(2)}
      </Typography>
    </Box>
    <Box>
      <img src={image1} alt="Chart" style={{ height: '80px', marginLeft: '16px' }} />
    </Box>
  </Paper>
</Grid>



        {/* Monthly Income */}
        <Grid item xs={12} md={4}>
        <Typography variant="h5" component="p" gutterBottom>
              Monthly Income Summary
              </Typography>
  <Paper
    sx={{
      p: 3,
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      justifyContent: 'space-around',
      alignItems: 'center',
      borderRadius: 2,
      boxShadow: '9px 9px 18px #d9d9d9, -9px -9px 18px #ffffff',
    }}
  >
    <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 0 } }}>
      <Typography variant="body1" component="p" gutterBottom>
        Monthly Income
      </Typography>
      <Typography variant="h6" component="p" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
        {monthlyIncome.toFixed(2)}
      </Typography>
    </Box>
    <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 0 } }}>
      <Typography variant="body1" component="p" gutterBottom>
        Monthly Expenses
      </Typography>
      <Typography variant="h6" component="p" sx={{ fontWeight: 'bold', color: '#f44336' }}>
        {monthlyExpence.toFixed(2)}
      </Typography>
    </Box>
    <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 0 } }}>
      <Typography variant="body1" component="p" gutterBottom>
        monthly Profit
      </Typography>
      <Typography variant="h6" component="p" sx={{ fontWeight: 'bold', color: '#752888' }}>
        {monthlyProfit.toFixed(2)}
      </Typography>
    </Box>
    <Box>
      <img src={image2} alt="Chart" style={{ height: '80px', marginLeft: '16px' }} />
    </Box>
  </Paper>
</Grid>
        {/* Sold Devices */}
        <Grid item xs={12} md={4}>
        <Typography variant="h5" component="p" gutterBottom>
              Sold Devices Summary
              </Typography>
  <Paper
    sx={{
      p: 3,
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      justifyContent: 'space-around',
      alignItems: 'center',
      borderRadius: 2,
      boxShadow: '9px 9px 18px #d9d9d9, -9px -9px 18px #ffffff',
    }}
  >
    <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 0 } }}>
      <Typography variant="body1" component="p" gutterBottom>
        Sold Devices
      </Typography>
      <Typography variant="h6" component="p" sx={{ fontWeight: 'bold', color: '#752888' }}>
        {soldDevicesCount}
      </Typography>
    </Box>
    <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 0 } }}>
      <Typography variant="body1" component="p" gutterBottom>
        Purchase Cost
      </Typography>
      <Typography variant="h6" component="p" sx={{ fontWeight: 'bold', color: '#f44336' }}>
        {purchaseCost.toFixed(2)}
      </Typography>
    </Box>
    <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 0 } }}>
      <Typography variant="body1" component="p" gutterBottom>
        Selling Income
      </Typography>
      <Typography variant="h6" component="p" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
        {SellingPrice.toFixed(2)}
      </Typography>
    </Box>
    <Box>
      <img src={image3} alt="Chart" style={{ height: '80px', marginLeft: '16px' }} />
    </Box>
  </Paper>
</Grid>
        {/* Unsold Devices */}
        <Grid item xs={12} md={4}>
        <Typography variant="h5" component="p" gutterBottom>
              Unsold Devices Summary
              </Typography>
  <Paper
    sx={{
      p: 3,
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      justifyContent: 'space-around',
      alignItems: 'center',
      borderRadius: 2,
      boxShadow: '9px 9px 18px #d9d9d9, -9px -9px 18px #ffffff',
    }}
  >
    <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 0 } }}>
      <Typography variant="body1" component="p" gutterBottom>
        Unsold Devices
      </Typography>
      <Typography variant="h6" component="p" sx={{ fontWeight: 'bold', color: '#752888' }}>
        {unsoldDevicesCount}
      </Typography>
    </Box>
    <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 0 } }}>
      <Typography variant="body1" component="p" gutterBottom>
        Purchase Cost
      </Typography>
      <Typography variant="h6" component="p" sx={{ fontWeight: 'bold', color: '#f44336' }}>
        {devicePrice.toFixed(2)}
      </Typography>
    </Box>
    <Box>
      <img src={image4} alt="Chart" style={{ height: '80px', marginLeft: '16px' }} />
    </Box>
  </Paper>
</Grid>
        {/* Monthly Installments */}
        <Grid item xs={12} md={4}>
        <Typography variant="h5" component="p" gutterBottom>
              Monthly Installments Summary
              </Typography>
  <Paper
    sx={{
      p: 3,
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      justifyContent: 'space-around',
      alignItems: 'center',
      borderRadius: 2,
      boxShadow: '9px 9px 18px #d9d9d9, -9px -9px 18px #ffffff',
    }}
  >
    <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 0 } }}>
      <Typography variant="body1" component="p" gutterBottom>
        Monthly Installments
      </Typography>
      <Typography variant="h6" component="p" sx={{ fontWeight: 'bold', color: '#752888' }}>
        {monthlyInstallments}
      </Typography>
    </Box>
    <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 0 } }}>
      <Typography variant="body1" component="p" gutterBottom>
        Recevied Payments
      </Typography>
      <Typography variant="h6" component="p" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
        {monthlyFullReseve.toFixed(2)}
      </Typography>
    </Box>
    <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 0 } }}>
      <Typography variant="body1" component="p" gutterBottom>
        Remaining Payments
      </Typography>
      <Typography variant="h6" component="p" sx={{ fontWeight: 'bold', color: '#f44336' }}>
        {monthlyRemaining.toFixed(2)}
      </Typography>
    </Box>
    <Box>
      <img src={image4} alt="Chart" style={{ height: '80px', marginLeft: '16px' }} />
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
