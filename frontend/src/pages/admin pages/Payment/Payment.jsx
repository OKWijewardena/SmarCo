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
import NotificationsIcon from "@mui/icons-material/Notifications";
import { mainListItems, secondaryListItems } from "../listItems";

import { Link, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";

import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

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

export default function Payment() {
  const navigate = useNavigate();

  const [searchCivilID, setSearchCivilID] = useState("");
  const [selling, setSelling] = useState([]);

  const [open, setOpen] = useState(true);
  const [payments, setPayments] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [civilID, setCivilID] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [emiNumber, setEmiNumber] = useState("");
  const [price, setPrice] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [date, setDate] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [oneSelling, setOneSelling] = useState([]);
  const [id, setId] = useState("");

  const [customer, setCustomer] = useState([]);

  useEffect(() => {
    fetchPayments();
    fetchCustomers();
  }, []);

  const handleLogout = () => {
    // Remove user details from session storage
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    console.log("User details cleared from session storage");
    navigate("/");
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleOpenDialog = (event) => {
    event.preventDefault();
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("https://app.smartco.live/api/customer/");
      setCustomer(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await axios.get(
        "https://app.smartco.live/payment/getPayment"
      );
      setPayments(response.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const handleDelete = async (id,civilID,emiNumber,price,date) => {
    const deletePayment = {
      civilID,
      emiNumber,
      date,
      payment: price,
    }
    try {
      await axios.post(
        "https://app.smartco.live/selling/deletepaymentHistory",
        deletePayment
      );
      await axios.delete(`https://app.smartco.live/payment/deletePayment/${id}`);
      alert("Selling record deleted successfully");
      fetchPayments(); // Refresh the selling list after deletion
    } catch (error) {
      console.error("Error deleting selling:", error);
      alert("An error occurred while deleting the selling record.");
    }
  };

  const fetchSellingDetails = async (civilID) => {
    try {
      const response = await axios.get(
        `https://app.smartco.live/selling/getOneSelling/${civilID}`
      );
      setSelling(response.data);
    } catch (error) {
      console.error("Error fetching selling details:", error);
    }
  };

  let sellingArray = [];
  const fetchOneSellingDetails = async (civilID,emiNumber) => {
    try {
      const response = await axios.get(
        `https://app.smartco.live/selling/getbyCIDEMI/${civilID}/${emiNumber}`
      );
      sellingArray.push(response.data.customArray);
      setOneSelling(response.data.customArray);
      console.log(oneSelling);
    } catch (error) {
      console.error("Error fetching selling details:", error);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetchSellingDetails(searchCivilID);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!price || !paymentDate) {
      alert("Please select a price and payment date.");
      return;
    }

    const NewPayment = {
      customerName,
      civilID,
      deviceName,
      emiNumber,
      price,
      date,
    };

    const UpdatePayment = {
      civilID,
      emiNumber,
      date,
      paymentDate,
      payment: price,
    };

    try {
      await axios.post(
        "https://app.smartco.live/selling/paymentHistory",
        UpdatePayment
      );
      await axios.post("https://app.smartco.live/payment/addPayment", NewPayment);
      handleCloseDialog();
      alert("New payment added successfully");
      fetchPayments();
    } catch (error) {
      alert("CivilID and Emi Number not match");
      console.error("Error adding payment:", error);
    }
  };

  const handleSelect = (row) => {
    setCustomerName(row.customerName);
    setCivilID(row.civilID);
    setDeviceName(row.deviceName);
    setEmiNumber(row.emiNumber);
    fetchOneSellingDetails(row.civilID,row.emiNumber);
  };

  const handlePriceSelect = (row) => {
    setPrice(row.price);
    setPaymentDate(row.date);
  }

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
                  marginTop: 4,
                  padding: 3,
                  backgroundColor: "#fff",
                  borderRadius: 1,
                  boxShadow: 3,
                  maxWidth: 800,
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
                  Search Selling Details
                </Typography>
                <Box component="form" sx={{ mt: 1 }} onSubmit={handleSearch}>
                  <TextField
                    margin="normal"
                    fullWidth
                    label="Search by Civil ID"
                    name="searchCivilID"
                    value={searchCivilID}
                    onChange={(e) => setSearchCivilID(e.target.value)}
                  />
                  <Button
                    type="submit"
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
                    Search
                  </Button>
                </Box>
              </Box>

              {selling.length > 0 && (
                <TableContainer component={Paper} sx={{ mt: 4 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Customer Name</TableCell>
                        <TableCell>Civil ID</TableCell>
                        <TableCell>Device</TableCell>
                        <TableCell>EMI Number</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Device Image</TableCell>

                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selling.map((row) => (
                        <TableRow>
                          <TableCell>{row.customerName}</TableCell>
                          <TableCell>{row.civilID}</TableCell>
                          <TableCell>{row.deviceName}</TableCell>
                          <TableCell>{row.emiNumber}</TableCell>
                          <TableCell>{row.price}</TableCell>
                          <TableCell>{row.date}</TableCell>
                          <TableCell>
                            <img
                              src={`${row.imageName}`}
                              style={{ width: "100px", height: "100px" }}
                            />
                          </TableCell>

                          <TableCell>
                            <Button
                              sx={{
                                mt: 3,
                                mb: 2,
                                backgroundColor: "#752888",
                                "&:hover": {
                                  backgroundColor: "#C63DE7",
                                },
                                color: "white",
                                fontFamily: "Public Sans, sans-serif",
                                fontWeight: "bold",
                              }}
                              onClick={() => handleSelect(row)}
                            >
                              Select
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

{oneSelling.length > 0 && (
                <TableContainer component={Paper} sx={{ mt: 4 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Status</TableCell>

                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {oneSelling.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.date}</TableCell>
                          <TableCell>{row.price}</TableCell>
                          <TableCell><Button
                            variant="contained"
                            color={row.status === "paid" ? "success" : "error"}
                            size="small"
                          >{row.status}</Button></TableCell>

                          <TableCell>
                            <Button
                              sx={{
                                mt: 3,
                                mb: 2,
                                backgroundColor: "#752888",
                                "&:hover": {
                                  backgroundColor: "#C63DE7",
                                },
                                color: "white",
                                fontFamily: "Public Sans, sans-serif",
                                fontWeight: "bold",
                              }}
                              onClick={() => handlePriceSelect(row)}
                            >
                              Select
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                )}
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
                  Payment Details
                </Typography>
                <Box
                  component="form"
                  sx={{ mt: 1 }}
                  onSubmit={handleOpenDialog}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Customer Name"
                    name="customerName"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                    }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Civil ID"
                    name="civilID"
                    value={civilID}
                    onChange={(e) => {
                      setCivilID(e.target.value);
                    }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Device Name"
                    name="deviceName"
                    value={deviceName}
                    onChange={(e) => {
                      setDeviceName(e.target.value);
                    }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="EMI Number"
                    name="emiNumber"
                    value={emiNumber}
                    onChange={(e) => {
                      setEmiNumber(e.target.value);
                    }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Amount"
                    name="price"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value);
                    }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Date"
                    type="date"
                    name="date"
                    onChange={(e) => {
                      setDate(e.target.value);
                    }}
                    InputLabelProps={{ shrink: true }}
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
                      // Disable the button if price or paymentDate is not set
                      disabled: !price || !paymentDate,
                    }}
                  >
                    Submit
                  </Button>
                </Box>
              </Box>

              <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Confirm Payment</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Please confirm the payment details below:
                  </DialogContentText>
                  <Typography variant="body1">
                    <strong>Customer Name:</strong> {customerName}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Civil ID:</strong> {civilID}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Device Name:</strong> {deviceName}
                  </Typography>
                  <Typography variant="body1">
                    <strong>EMI Number:</strong> {emiNumber}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Price:</strong> {price}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Date:</strong> {date}
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={handleCloseDialog}
                    color="primary"
                    sx={{
                      mt: 3,
                      mb: 2,
                      backgroundColor: "#FF2727",
                      "&:hover": {
                        backgroundColor: "#FF4646",
                      },
                      fontFamily: "Public Sans, sans-serif",
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    color="primary"
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
                    Confirm
                  </Button>
                </DialogActions>
              </Dialog>

              {/* Table Section */}
              <Box
                sx={{
                  mt: 6,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: 4,
                  padding: 3,
                  backgroundColor: "#fff",
                  borderRadius: 1,
                  boxShadow: 3,
                  maxWidth: 1500, // Adjust this value as needed
                  flexGrow: 1,
                  mx: "auto",
                }}
              >
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          style={{ backgroundColor: "#752888", color: "white" }}
                        >
                          Customer Name
                        </TableCell>
                        <TableCell
                          style={{ backgroundColor: "#752888", color: "white" }}
                        >
                          Civil ID
                        </TableCell>
                        <TableCell
                          style={{ backgroundColor: "#752888", color: "white" }}
                        >
                          Device Name
                        </TableCell>
                        <TableCell
                          style={{ backgroundColor: "#752888", color: "white" }}
                        >
                          Price
                        </TableCell>
                        <TableCell
                          style={{ backgroundColor: "#752888", color: "white" }}
                        >
                          Date
                        </TableCell>
                        <TableCell
                          style={{ backgroundColor: "#752888", color: "white" }}
                        >
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {payments
                        .slice()
                        .reverse()
                        .map((payment) => (
                          <TableRow key={payment._id}>
                            <TableCell>{payment.customerName}</TableCell>
                            <TableCell>{payment.civilID}</TableCell>
                            <TableCell>{payment.deviceName}</TableCell>
                            <TableCell>{payment.price}</TableCell>
                            <TableCell>{payment.date}</TableCell>
                            <TableCell>
                              {/* <IconButton color="primary">
                              <EditIcon />
                            </IconButton> */}
                              <IconButton
                                color="secondary"
                                onClick={() => handleDelete(payment._id,payment.civilID,payment.emiNumber,payment.price,payment.date)}
                              >
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
  );
}
