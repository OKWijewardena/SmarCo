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
import { mainListItems, secondaryListItems } from '../listItems';
import React, { useEffect,useState } from 'react';
import {
  TextField, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { Link, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';



import 'bootstrap/dist/css/bootstrap.min.css';


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
const PaymentList = () => {

  const navigate = useNavigate();

    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1; // JavaScript months are 0-based counting
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const [originalData, setOriginalData] = useState([]);
    const [data, setData] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [civilID, setCivilID] = useState('');
    const [deviceName, setDeviceName] = useState('');
    const [price, setPrice] = useState('');
    const [paymentDateFrom, setPaymentDateFrom] = useState(null);
    const [paymentDateTo, setPaymentDateTo] = useState(null);
 
    useEffect(() => {
        fetch('http://podsaas.online/payment/getPayment/', {
            method: 'GET'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            setOriginalData(data);
            setData(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }, []);

    const handleLogout = () => {
      // Remove user details from session storage
      sessionStorage.removeItem('user');
      console.log('User details cleared from session storage');
      navigate('/');
    };
    
    const downloadPDF = () => {
      fetch('http://podsaas.online/convertPDF', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data) // Send current data to the backend
      })
      .then(response => {
          if (response.ok) {
              return response.blob(); // If the response is OK, get the PDF blob
          } else {
              throw new Error('Error converting to PDF');
          }
      })
      .then(blob => {
        // Create a blob URL
        const url = window.URL.createObjectURL(blob);
        // Create a link element
        const link = document.createElement('a');
        link.href = url;
        let formattedDateTime = `${day}/${month}/${year}, ${hours}:${minutes}`;

        link.download = `Payment Report - ${formattedDateTime}.pdf`;
        // Append the link to the body
        document.body.appendChild(link);
        // Simulate click
        link.click();
        // Remove the link when done
        document.body.removeChild(link);
    })
    .catch(error => alert(error));
};

  

    const resetTable = () => {
      
        fetch('http://podsaas.online/payment/getPayment/', {
            method: 'GET'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => setData(data))
        .catch(error => {
            console.error('Error fetching data:', error);
            // Handle error accordingly
        });
        
    };

// Update your handleFetch function to also filter based on the search term
const handleFetch = () => {
        let filteredData = originalData.filter(item => {
            const itemPaymentDate = new Date(item.date);
            return (deviceName === '' || item.deviceName.includes(deviceName)) &&
                (customerName === '' || item.customerName.includes(customerName)) &&
                (civilID === '' || item.civilID.includes(civilID)) &&
                (price === '' || item.price.includes(price)) &&
                (!paymentDateFrom || itemPaymentDate >= paymentDateFrom) && 
                (!paymentDateTo || itemPaymentDate <= paymentDateTo ) 
        });

        setData(filteredData);
        // Clear all fields after fetch
        setDeviceName('');
        setCustomerName('');
        setCivilID('');
        setPrice('');
        setPaymentDateFrom(null); // Set to null to clear the date picker
        setPaymentDateTo(null); // Set to null to clear the date picker
    };
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  return (
    <div>
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
  <Container>
  <Box
sx={{
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: 4,
  padding: 3,
  backgroundColor: '#fff',
  borderRadius: 1,
  boxShadow: 3,
  maxWidth: 1000, // Adjust the maxWidth as needed
  width: '100%',
  mx: 'auto', // Center the box
}}>
<Typography component="h1" variant="h5" gutterBottom sx={{ fontFamily: 'Public Sans, sans-serif', fontWeight: 'bold', color:"#637381" }}>
  Device List
</Typography>
<Box component="form" sx={{ mt: 1 }}>
  <Grid container spacing={2}>
    <Grid item xs={12} sm={3}>
    <TextField margin="normal" fullWidth label="Device Name" value={deviceName} onChange={e => setDeviceName(e.target.value)} />
    </Grid>
    <Grid item xs={12} sm={3}>
      <TextField margin="normal"  fullWidth label="Customer Name" value={customerName} onChange={e => setCustomerName(e.target.value)}  />
    </Grid>
    <Grid item xs={12} sm={3}>
      <TextField margin="normal"  fullWidth label="civilID" value={civilID} onChange={e => setCivilID(e.target.value)}  />
    </Grid>
    <Grid item xs={12} sm={3}>
      <TextField margin="normal"  fullWidth label="price" value={price} onChange={e => setPrice(e.target.value)} />
    </Grid>
    <Grid item xs={12} sm={3}style={{ marginTop: '16px' }} >
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DatePicker
            fullWidth
            label="Payment Date From"
            value={paymentDateFrom}
            onChange={(date) => setPaymentDateFrom(date)} 
            style={{ marginTop: '20px' }}
        />
    </LocalizationProvider>
    </Grid>
    <Grid item xs={12} sm={3}style={{ marginTop: '16px' }} >
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DatePicker
            fullWidth
            label="Payment Date To"
            value={paymentDateTo}
            onChange={(date) => setPaymentDateTo(date)}
            style={{ marginTop: '20px' }}
        />
    </LocalizationProvider>
    </Grid>
    
  </Grid>
 
  <Grid container spacing={2} direction="row" justifyContent="space-between">
    <Grid item xs={12} sm={4}>
      <Button
        
        onClick={handleFetch}
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
        Fetch
      </Button>
    </Grid>
    <Grid item xs={12} sm={4}>
      <Button
       
        onClick={resetTable}
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
        Reset
      </Button>
    </Grid>
    <Grid item xs={12} sm={4}>
      <Button
      
    
        onClick={downloadPDF}
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
        Download PDF
      </Button>
    </Grid>
  </Grid>
</Box>
</Box>
</Container>

<Grid container>
  <Grid item xs={12}>
    <Box sx={{ 
       mt: 6,
       display: 'flex',
       flexDirection: 'column',
       alignItems: 'center',
       marginTop: 4,
       padding: 3,
       backgroundColor: '#fff',
       borderRadius: 1,
       boxShadow: 3,
       maxWidth: 1500, // Adjust this value as needed
       flexGrow: 1,
       mx: 'auto',  
    }}>
      <TableContainer component={Paper}sx={{ width: '100%',overflowX: 'auto'  }} >
        <Table>
          <TableHead>
            <TableRow>
            <TableCell style={{ backgroundColor: '#752888', color: 'white' }}>Device Name</TableCell>
            <TableCell style={{ backgroundColor: '#752888', color: 'white' }}>Customer Name </TableCell>
            <TableCell style={{ backgroundColor: '#752888', color: 'white' }}>Civil Id</TableCell>
            <TableCell style={{ backgroundColor: '#752888', color: 'white' }}>Price</TableCell>
            <TableCell style={{ backgroundColor: '#752888', color: 'white' }}>Payment Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {data.length > 0 && data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.deviceName}</TableCell>
                <TableCell>{item.customerName}</TableCell>
                <TableCell>{item.civilID}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>{item.date}</TableCell>
            
              </TableRow>
          ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  </Grid>
</Grid>

 
</Box>
</Box>
</ThemeProvider>
</div>
  )
}
export default PaymentList
