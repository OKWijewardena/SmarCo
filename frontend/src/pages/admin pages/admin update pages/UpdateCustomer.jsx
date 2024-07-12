import React, { useState, useEffect } from "react";
import axios from "axios";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LogoutIcon from "@mui/icons-material/Logout";
import { mainListItems, secondaryListItems } from "../listItems";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme();

export default function UpdateCustomer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [open, setOpen] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [civil_id, setCivil_id] = useState("");
  const [nationality, setNationality] = useState("");
  const [mobile, setMobile] = useState("");
  const [whatsapp_no, setWhatsapp_no] = useState("");
  const [telephone_no, setTelephone_no] = useState("");
  const [address, setAddress] = useState("");
  const [paci_number, setPaci_number] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  useEffect(() => {
    fetchCustomer();
  }, []);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    console.log("User details cleared from session storage");
    navigate("/");
  };

  function fetchCustomer() {
    let mounted = true;
    fetch(`http://podsaas.online/api/customer/${id}`)
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
          setCustomerEmail(result.email);
        }
      });
    return () => (mounted = false);
  }

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
      paci_number,
    };

    try {
      await axios.put(
        `http://podsaas.online/api/customer/${customerEmail}`,
        UpdatedCustomer
      );
      alert("Customer updated successfully");
      navigate("/customer");
    } catch (error) {
      console.error("Error updating customer:", error);
      alert(
        `Error updating customer: ${
          error.response ? error.response.data.message : error.message
        }`
      );
    }
  };

  return (
    <div>
      <ThemeProvider theme={mdTheme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar
            sx={{ backgroundColor: "white", color: "#637381" }}
            position="absolute"
            open={open}
          >
            <Toolbar sx={{ pr: "24px" }}>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginRight: "36px",
                  ...(open && { display: "none" }),
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
                  background: "linear-gradient(90deg, #C63DE7, #752888)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontFamily: "Public Sans, sans-serif",
                  fontWeight: "bold",
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
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
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
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <Toolbar />
            <Container>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: 4,
                  padding: 3,
                  backgroundColor: "#fff",
                  borderRadius: 1,
                  boxShadow: 3,
                  maxWidth: 500,
                  width: "100%",
                  mx: "auto",
                }}
              >
                <Typography
                  component="h1"
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontFamily: "Public Sans, sans-serif",
                    fontWeight: "bold",
                    color: "#637381",
                  }}
                >
                  Update Customer Details
                </Typography>
                <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="User Name"
                    value={name}
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="E-mail"
                    value={email}
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Mobile Number"
                    value={mobile}
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="WhatsApp Number"
                    value={whatsapp_no}
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => setWhatsapp_no(e.target.value)}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Telephone Number"
                    value={telephone_no}
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => setTelephone_no(e.target.value)}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Address"
                    value={address}
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Nationality"
                    value={nationality}
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => setNationality(e.target.value)}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Civil ID"
                    value={civil_id}
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => setCivil_id(e.target.value)}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Paci Number"
                    value={paci_number}
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => setPaci_number(e.target.value)}
                  />
                  <TextField
                    sx={{ display: "none" }}
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    value={password}
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      mb: 2,
                      backgroundColor: "#752888",
                      "&:hover": {
                        backgroundColor: "#C63DE7",
                      },
                      fontFamily: "Public Sans, sans-serif",
                      fontWeight: "bold",
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
  );
}
