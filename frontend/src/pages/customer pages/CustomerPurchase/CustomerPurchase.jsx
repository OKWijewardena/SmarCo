import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { json, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Toolbar,
  IconButton,
  Container,
  Grid,
  Badge,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

export default function CustomerPurchase() {
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("user"));
  // Check if the user object exists and then access the email property
  const civil_id = user.civil_id;
  if (user) {
    const civil_id = user.civil_id;
    console.log("civil id:", civil_id); // You can use the email as needed
  } else {
    console.log("No user data found in session storage");
  }

  const backward = () => {
    navigate("/customerHome");
  };

  const handleLogout = () => {
    // Remove user details from session storage
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    console.log("User details cleared from session storage");
    navigate("/");
  };

  const { id } = useParams();

  const [sellings, setSellings] = useState([]);
  const [data, setData] = useState([]);
  const [civilID, setCivilID] = useState(""); 
  const [emiNumber, setemiNumber] = useState("");

  const fetchSellings = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://podsaas.online/selling/getOneSellingID/${id}`
      );
      console.log(id);
      setSellings(response.data);
      const CIVILID = response.data.civilID;
      const EMINUMBER = response.data.emiNumber;

      const Newpayments = { civilID: CIVILID, emiNumber: EMINUMBER };

      const res = await axios.post(
        "http://podsaas.online/payment/getOnePayment",
        Newpayments
      );
      setData(res.data);
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchSellings();
  }, []);

  const downloadPDF = (rowData) => {
    // Modify the function to accept rowData
    fetch("http://podsaas.online/convertToCustomerPaymentInvoicePDF", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rowData), // Send rowData to the backend
    })
      .then((response) => {
        if (response.ok) {
          return response.blob(); // If the response is OK, get the PDF blob
        } else {
          throw new Error("Error converting to PDF");
        }
      })
      .then((blob) => {
        // Create a blob URL
        const url = window.URL.createObjectURL(blob);
        // Create a link element
        const link = document.createElement("a");
        link.href = url;
        // The downloaded file name
        link.download = "output.pdf";
        // Append the link to the body
        document.body.appendChild(link);
        // Simulate click
        link.click();
        // Remove the link when done
        document.body.removeChild(link);
      })
      .catch((error) => alert(error));
  };

  const downloadOverallPDF = () => {
    console.log(id, user.civil_id);

    fetch("http://podsaas.online/convertToOverAllPaymentInvoicePDF", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        civil_id: user.civil_id,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.blob(); // If the response is OK, get the PDF blob
        } else {
          throw new Error("Error converting to PDF");
        }
      })
      .then((blob) => {
        // Create a blob URL
        const url = window.URL.createObjectURL(blob);
        // Create a link element
        const link = document.createElement("a");
        link.href = url;
        // The downloaded file name
        link.download = "Over_All_Bill.pdf";
        // Append the link to the body
        document.body.appendChild(link);
        // Simulate click
        link.click();
        // Remove the link when done
        document.body.removeChild(link);
      })
      .catch((error) => alert(error));
  };

  return (
    <Container>
      <Toolbar
        sx={{
          pr: "24px",
          marginTop: "20px", // keep right padding when drawer closed
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <IconButton
            color="inherit"
            sx={{ marginRight: "auto" }}
            onClick={backward}
          >
            <Box
              sx={{
                background:
                  "linear-gradient(90deg, rgba(198, 61, 231, 0.2), rgba(117, 40, 136, 0.2))",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
              }}
            >
              <ArrowBackIcon />
            </Box>
          </IconButton>

          <Typography
            component="h1"
            variant="h6"
            noWrap
            sx={{
              flexGrow: 1,
              textAlign: "center",
              background: "linear-gradient(90deg, #C63DE7, #752888)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily: "Public Sans, sans-serif",
              fontWeight: "bold",
            }}
          >
            SMARTCO
          </Typography>

          <IconButton onClick={handleLogout} sx={{ marginLeft: "auto" }}>
            <Box
              sx={{
                background:
                  "linear-gradient(90deg, rgba(198, 61, 231, 0.2), rgba(117, 40, 136, 0.2))",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
              }}
            >
              <LogoutIcon />
            </Box>
          </IconButton>
        </Box>
      </Toolbar>
      <Box sx={{ p: 2, maxWidth: 600, mx: "auto" }}>
        <Typography variant="h5" align="center" sx={{ mb: 2 }}>
          {sellings.deviceName}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <img
            src={`${sellings.imageName}`}
            alt="device"
            style={{ width: "100%", maxWidth: 300 }}
          />
        </Box>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Payment Plan
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sellings.customArray &&
                    sellings.customArray.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.price}/=</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color={item.status === "paid" ? "success" : "error"}
                            size="small"
                          >
                            {item.status.charAt(0).toUpperCase() +
                              item.status.slice(1)}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box
              sx={{ mt: 2, p: 2, backgroundColor: "#e2cae7", borderRadius: 1 }}
            >
              <Typography variant="body1" align="right">
                Device price: {sellings.price}/=
              </Typography>
            </Box>
            <Box
              sx={{ mt: 2, p: 2, backgroundColor: "#e2cae7", borderRadius: 1 }}
            >
              <Typography variant="body1" align="right">
                Advance: {sellings.advance}/=
              </Typography>
            </Box>
            <Box
              sx={{ mt: 2, p: 2, backgroundColor: "#a53db5", borderRadius: 1 }}
            >
              <Typography
                variant="body1"
                align="right"
                color="white"
                sx={{ fontWeight: "bold" }}
              >
                Remaining Balance: {sellings.balance}/=
              </Typography>
            </Box>
            <Box
              sx={{ mt: 2, p: 2, backgroundColor: "#a53db5", borderRadius: 1 }}
            >
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item>
                  <Typography
                    variant="body1"
                    color="white"
                    sx={{ fontWeight: "bold" }}
                  >
                    Generate Overall Bill
                  </Typography>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => downloadOverallPDF()}
                  >
                    Generate Bill
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Payment History
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Device Name</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.length > 0 &&
                    data.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.deviceName}</TableCell>
                        <TableCell>{item.price}/=</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => downloadPDF(item)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
