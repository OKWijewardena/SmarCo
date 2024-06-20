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
import { Link, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

import {
  TextField, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

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

export default function EDevice(){

    const navigate = useNavigate();

    const [open, setOpen] = React.useState(true);
    const [devices, setDevices] = useState([]);
    const [form, setForm] = useState({
        deviceName: '',
        price: '',
        color: '',
        shopName: '',
        modelNumber: '',
        storage: '',
        ram:'',
        warrenty: '',
        emiNumber: '',
        purchaseDate: '',
        imageName: ''
    });

    const handleDelete = async (id) => {
        try {
          await axios.delete(`http://podsaas.online/device/deleteDevice/${id}`);
          alert("Dervice record deleted successfully");
          fetchDevices();// Refresh the selling list after deletion
        } catch (error) {
          console.error('Error deleting selling:', error);
          alert("An error occurred while deleting the selling record.");
        }
      };

    useEffect(() => {
        fetchDevices();
    }, []);

    const handleLogout = () => {
        // Remove user details from session storage
        sessionStorage.removeItem('user');
sessionStorage.removeItem('token');
        console.log('User details cleared from session storage');
        navigate('/');
      };

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const fetchDevices = async () => {
        try {
            const response = await axios.get('http://podsaas.online/device/getDevice');
            setDevices(response.data);
        } catch (error) {
            console.error('Error fetching devices:', error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setForm({ ...form, [name]: value });
    };

    const handleFileChange = (event) => {
        setForm({ ...form, imageName: event.target.files[0] });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        Object.keys(form).forEach(key => {
            formData.append(key, form[key]);
        });
        try {
            await axios.post('http://podsaas.online/device/addDevice', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setForm({
                deviceName: '',
                price: '',
                color: '',
                shopName: '',
                modelNumber: '',
                storage: '',
                ram:'',
                warrenty: '',
                emiNumber: '',
                purchaseDate: '',
                imageName: ''
            });
            fetchDevices();
        } catch (error) {
            console.error('Error adding devices:', error);
        }
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
                                    Device Details
                                </Typography>
                                <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit}>
                                    <TextField margin="normal"
                                        required
                                        fullWidth
                                        label="Device Name"
                                        name="deviceName"
                                        value={form.deviceName}
                                        onChange={handleInputChange} />
                                    <TextField margin="normal"
                                        required
                                        fullWidth
                                        label="Price"
                                        name="price"
                                        value={form.price}
                                        onChange={handleInputChange} />
                                    <TextField margin="normal"
                                        required
                                        fullWidth
                                        label="Colour"
                                        name="color"
                                        value={form.color}
                                        onChange={handleInputChange} />
                                    <TextField margin="normal"
                                        required
                                        fullWidth
                                        label="Shop Name"
                                        name="shopName"
                                        value={form.shopName}
                                        onChange={handleInputChange} />
                                    <TextField margin="normal"
                                        required
                                        fullWidth
                                        label="Model Number"
                                        name="modelNumber"
                                        value={form.modelNumber}
                                        onChange={handleInputChange} />
                                    <TextField margin="normal"
                                        required
                                        fullWidth
                                        label="Storage"
                                        name="storage"
                                        value={form.storage}
                                        onChange={handleInputChange} />
                                    <TextField margin="normal"
                                        required
                                        fullWidth
                                        label="Ram"
                                        name="ram"
                                        value={form.ram}
                                        onChange={handleInputChange} />
                                    <TextField margin="normal"
                                        required
                                        fullWidth
                                        label="Warrenty"
                                        name="warrenty"
                                        value={form.warrenty}
                                        onChange={handleInputChange} />
                                    <TextField margin="normal"
                                        required
                                        fullWidth
                                        label="EMI Number"
                                        name="emiNumber"
                                        value={form.emiNumber}
                                        onChange={handleInputChange} />
                                    <TextField margin="normal"
                                        required
                                        fullWidth
                                        label="Purchase Date"
                                        type="date"
                                        name="purchaseDate"
                                        value={form.purchaseDate}
                                        onChange={handleInputChange} />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        type="file"
                                        name="imageName"
                                        onChange={handleFileChange}
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
                            </Box>
                            {/* Table Section */}
                            <Box sx={{ mt: 4 }}>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Device Name</TableCell>
                                                <TableCell>Price</TableCell>
                                                <TableCell>Colour</TableCell>
                                                <TableCell>Shop Name</TableCell>
                                                <TableCell>Model Number</TableCell>
                                                <TableCell>Storage</TableCell>
                                                <TableCell>Ram</TableCell>
                                                <TableCell>Warrenty</TableCell>
                                                <TableCell>Emi Number</TableCell>
                                                <TableCell>Purchase Date</TableCell>
                                                <TableCell>Image Name</TableCell>
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {devices.slice().reverse().map((device) => (
                                                <TableRow key={device._id}>
                                                    <TableCell>{device.deviceName}</TableCell>
                                                    <TableCell>{device.price}</TableCell>
                                                    <TableCell>{device.color}</TableCell>
                                                    <TableCell>{device.shopName}</TableCell>
                                                    <TableCell>{device.modelNumber}</TableCell>
                                                    <TableCell>{device.storage}</TableCell>
                                                    <TableCell>{device.ram}</TableCell>
                                                    <TableCell>{device.warrenty}</TableCell>
                                                    <TableCell>{device.emiNumber}</TableCell>
                                                    <TableCell>{device.purchaseDate}</TableCell>
                                                    <TableCell>
        {device.imageName && (
          <img
            src={`/images/deviceImages/${device.imageName}`}
            alt={device.deviceName}
            style={{ width: '100px', height: '100px' }}
          />
        )}
      </TableCell>
                                                    <TableCell>
                                                        <Link to={`updatedevice/${device.emiNumber}`}>
                                                        <IconButton color="primary">
                                                            <EditIcon />
                                                        </IconButton>
                                                        </Link>
                                                        <IconButton color="secondary" onClick={() => handleDelete(device._id)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </Container>
                    </Box>
                </Box>
            </ThemeProvider>
        </div>
    )
}
