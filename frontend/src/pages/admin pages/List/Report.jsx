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
import { mainListItems, secondaryListItems } from '../listItems';
import { Paper, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
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

function ReportContent() {

  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove user details from session storage
    sessionStorage.removeItem('user');
sessionStorage.removeItem('token');
    console.log('User details cleared from session storage');
    navigate('/');
  };

  const [open, setOpen] = React.useState(true);

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
      
        <Grid item xs={12} md={4}>
        <Link to={'/CustomerList'} style={{textDecoration: 'none'}}>
          <Paper sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 2 }}>
            <Box>
              <Typography variant="body1" component="p" gutterBottom>
              Customer Report
              </Typography>
            </Box> 
          </Paper>
          </Link>
        </Grid>
        
        
        <Grid item xs={12} md={4}>
        <Link to={'/DeviceList'} style={{textDecoration: 'none'}}>
          <Paper sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 2 }}>
            <Box>
              <Typography variant="body1" component="p" gutterBottom>
                Device Report
              </Typography>
            </Box>
          </Paper>
          </Link>
        </Grid>
        
        <Grid item xs={12} md={4}>
        <Link to={'/EmployeeList'} style={{textDecoration: 'none'}}>
          <Paper sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 2 }}>
            <Box>
              <Typography variant="body1" component="p" gutterBottom>
              Employee Report
              </Typography>
            </Box>
          </Paper>
          </Link>
        </Grid>
        
        <Grid item xs={12} md={4}>
        <Link to={'/PaymentList'} style={{textDecoration: 'none'}}>
          <Paper sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 2 }}>
            <Box>
              <Typography variant="body1" component="p" gutterBottom>
              Payments Report
              </Typography>
            </Box>
          </Paper>
          </Link>
        </Grid>

        <Grid item xs={12} md={4}>
        <Link to={'/saleList'} style={{textDecoration: 'none'}}>
          <Paper sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 2 }}>
            <Box>
              <Typography variant="body1" component="p" gutterBottom>
              Sales Report
              </Typography>
            </Box>
          </Paper>
          </Link>
        </Grid>

      </Grid>
    </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Report() {
  return <ReportContent />;
}
