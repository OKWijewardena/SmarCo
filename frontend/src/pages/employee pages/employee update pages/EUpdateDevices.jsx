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
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { mainListItems } from '../listItems';
import { useParams, useNavigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';

import {
  TextField, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';

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

export default function EUpdateDevices(){

  const navigate = useNavigate();

  const { id } = useParams();

  const [open, setOpen] = React.useState(true);
  const [deviceID, setDeviceID] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [price, setPrice] = useState('');
  const [color, setColor] = useState('');
  const [shopName, setShopName] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [storage, setStorage] = useState('');
  const [ram, setRam] = useState('');
  const [warrenty, setWarrenty] = useState('');
  const [emiNumber, setEmiNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [imageName, setImageName] = useState('');

  const toggleDrawer = () => {
      setOpen(!open);
  };

  useEffect(() => {
      fetchDevices();
    }, []);

    const handleLogout = () => {
      // Remove user details from session storage
      sessionStorage.removeItem('user');
      console.log('User details cleared from session storage');
      navigate('/');
    };

  function fetchDevices() {

      let mounted = true;
  fetch(`http://podsaas.online/device/getOneDevice/${id}`)
    .then((res) => res.json())
    .then((result) => {
      console.log(result);
      if (mounted) {
          setDeviceID(result[0]._id);
          setDeviceName(result[0].deviceName);
          setPrice(result[0].price);
          setColor(result[0].color);
          setShopName(result[0].shopName);
          setModelNumber(result[0].modelNumber);
          setStorage(result[0].storage);
          setRam(result[0].ram);
          setWarrenty(result[0].warrenty);
          setEmiNumber(result[0].emiNumber);
          setPurchaseDate(result[0].purchaseDate);
          setImageName(result[0].imageName);
      }
    });
  return () => (mounted = false);
  };

  const handleFileChange = (event) => {
      setImageName(event.target.files[0]);
  };

  const handleSubmit = async (event) => {

      event.preventDefault();

      const UpdatedDevice = {
          deviceName: deviceName,
          price: price,
          color: color,
          shopName: shopName,
          modelNumber: modelNumber,
          storage: storage,
          ram: ram,
          warrenty: warrenty,
          emiNumber: emiNumber,
          purchaseDate: purchaseDate,
          imageName: imageName
        };

        axios
          .put(`http://podsaas.online/device/updateDevice/${deviceID}`, UpdatedDevice)
          .then(() => {
              alert('Device updated successfully!');
            navigate('/device');
          })
          .catch((err) => {
            alert(err);
            console.log(err);
          });
      
  };

    return(
        <div>
            <ThemeProvider theme={mdTheme}>
                <Box sx={{ display: 'flex' }}>
                    <CssBaseline />
                    <AppBar sx={{backgroundColor: 'white', color: '#637381'}} position="absolute" open={open}>
                        <Toolbar sx={{ pr: '24px' }}>
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
                        <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: [1], }}>
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
                                    maxWidth: 500,
                                    width: '100%',
                                    mx: 'auto',
                                }}
                            >
                                <Typography component="h1" variant="h5" gutterBottom sx={{ fontFamily: 'Public Sans, sans-serif', fontWeight: 'bold', color:"#637381" }}>
                                    Update Device Details
                                </Typography>
                                <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit}>
                                    <TextField margin="normal"
                                        required
                                        fullWidth
                                        label="Device Name"
                                        name="deviceName"
                                        value={deviceName}
                                        onChange={(e) => {
                                            setDeviceName(e.target.value);
                                          }} />
                                    <TextField margin="normal"
                                        required
                                        fullWidth
                                        label="Price"
                                        name="price"
                                        value={price}
                                        onChange={(e) => {
                                            setPrice(e.target.value);
                                          }} />
                                    <TextField margin="normal"
                                        required
                                        fullWidth
                                        label="Colour"
                                        name="color"
                                        value={color}
                                        onChange={(e) => {
                                            setColor(e.target.value);
                                          }} />
                                    <TextField margin="normal"
                                        required
                                        fullWidth
                                        label="Shop Name"
                                        name="shopName"
                                        value={shopName}
                                        onChange={(e) => {
                                            setShopName(e.target.value);
                                          }} />
                                    <TextField margin="normal"
                                        required
                                        fullWidth
                                        label="Model Number"
                                        name="modelNumber"
                                        value={modelNumber}
                                        onChange={(e) => {
                                            setModelNumber(e.target.value);
                                          }} />
                                    <TextField margin="normal"
                                        required
                                        fullWidth
                                        label="Storage"
                                        name="storage"
                                        value={storage}
                                        onChange={(e) => {
                                            setStorage(e.target.value);
                                          }} />
                                          <TextField margin="normal"
                                        required
                                        fullWidth
                                        label="Ram"
                                        name="ram"
                                        value={ram}
                                        onChange={(e) => {
                                            setRam(e.target.value);
                                          }} />
                                    <TextField margin="normal"
                                        required
                                        fullWidth
                                        label="Warrenty"
                                        name="warrenty"
                                        value={warrenty}
                                        onChange={(e) => {
                                            setWarrenty(e.target.value);
                                          }} />
                                    <TextField margin="normal"
                                        required
                                        fullWidth
                                        label="EMI Number"
                                        name="emiNumber"
                                        value={emiNumber}
                                        onChange={(e) => {
                                            setEmiNumber(e.target.value);
                                          }} />
                                    <TextField margin="normal"
                                        required
                                        fullWidth
                                        label="Purchase Date"
                                        type="date"
                                        name="purchaseDate"
                                        value={purchaseDate}
                                        onChange={(e) => {
                                            setPurchaseDate(e.target.value);
                                          }} />
                                    {/* <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        type="file"
                                        name="imageName"
                                        onChange={handleFileChange}
                                    /> */}
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
                            </Box>
                        </Container>
                    </Box>
                </Box>
            </ThemeProvider>
        </div>
    )
}
