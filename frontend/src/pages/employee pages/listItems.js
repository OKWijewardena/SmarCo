import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';

import DevicesOtherIcon from '@mui/icons-material/DevicesOther';
import SellIcon from '@mui/icons-material/Sell';
import PaidIcon from '@mui/icons-material/Paid';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { Link } from 'react-router-dom';

export const mainListItems = (
  <React.Fragment>
    <Link to="/ehome" style={{textDecoration: 'none', color:"black"}}>
    <ListItemButton>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    </Link>
    <Link to="/edevice" style={{textDecoration: 'none', color:"black"}}>
    <ListItemButton>
      <ListItemIcon>
        <DevicesOtherIcon />
      </ListItemIcon>
      <ListItemText primary="Devices" />
    </ListItemButton>
    </Link>
    <Link to="/eselling" style={{textDecoration: 'none', color:"black"}}>
    <ListItemButton>
      <ListItemIcon>
        <SellIcon />
      </ListItemIcon>
      <ListItemText primary="Selling" />
    </ListItemButton>
    </Link>
    <Link to="/epayment" style={{textDecoration: 'none', color:"black"}}>
    <ListItemButton>
      <ListItemIcon>
        <PaidIcon />
      </ListItemIcon>
      <ListItemText primary="Payments" />
    </ListItemButton>
    </Link>
  </React.Fragment>
);