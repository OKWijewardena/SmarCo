import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { json, useParams } from "react-router-dom";
import { Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Toolbar, IconButton,Container, Badge } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

export default function CustomerPurchase() {

    const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem('user'));
  // Check if the user object exists and then access the email property
  const civil_id = user.civil_id;
if (user) {
  const civil_id = user.civil_id;
  console.log('civil id:', civil_id); // You can use the email as needed
  
} else {
  console.log('No user data found in session storage');
}

const backward = () => {
    navigate('/customerHome');
};

const handleLogout = () => {
  // Remove user details from session storage
  sessionStorage.removeItem('user');
sessionStorage.removeItem('token');
  console.log('User details cleared from session storage');
  navigate('/');
};



    const { id } = useParams();

    
    const [sellings, setSellings] = useState([]);
    const [data, setData] = useState([]);

    const fetchSellings = useCallback(async () => {
        try {
            const response = await axios.get(`http://podsaas.online/selling/getOneSellingID/${id}`);
          console.log(id);
         

            setSellings(response.data);
        } catch (error) {
            console.error('Error fetching devices:', error);
        }
    }, [id]);
    
    useEffect(() => {
        fetchSellings();

        fetch(`http://podsaas.online/payment/getOnePayment/${civil_id}`, {
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
    }, [fetchSellings]);

    const downloadPDF = (rowData) => { // Modify the function to accept rowData
        fetch('http://podsaas.online/convertToPaymentInvoicePDF', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(rowData) // Send rowData to the backend
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
            // The downloaded file name
            link.download = 'output.pdf';
            // Append the link to the body
            document.body.appendChild(link);
            // Simulate click
            link.click();
            // Remove the link when done
            document.body.removeChild(link);
        })
        .catch(error => alert(error));
    };

    return (
        <Container>
            <Toolbar
  sx={{
    pr: '24px',
    marginTop: '20px' // keep right padding when drawer closed
  }}
>
  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
  <IconButton color="inherit" sx={{ marginRight: 'auto' }} onClick={backward}
    >
      <Box 
    sx={{
      background: 'linear-gradient(90deg, rgba(198, 61, 231, 0.2), rgba(117, 40, 136, 0.2))',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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
        textAlign: 'center', 
        background: 'linear-gradient(90deg, #C63DE7, #752888)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontFamily: 'Public Sans, sans-serif',
        fontWeight: 'bold'
      }}
    >
      SMARTCO
    </Typography>
    
    <IconButton onClick={handleLogout} sx={{ marginLeft: 'auto' }}>
    <Box 
    sx={{
      background: 'linear-gradient(90deg, rgba(198, 61, 231, 0.2), rgba(117, 40, 136, 0.2))',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 40,
      height: 40,
    }}
  >
        <LogoutIcon />
      </Box>
    </IconButton>
  </Box>
</Toolbar>
        <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h5" align="center" sx={{ mb: 2 }}>
            {sellings.deviceName}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <img src={`/images/deviceImages/${sellings.imageName}`} alt="device" style={{ width: '100%', maxWidth: 300 }} />
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
                                {sellings.customArray && sellings.customArray.map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell>{item.date}</TableCell>
                                        <TableCell>{item.price}/=</TableCell>
                                        <TableCell>
                                            <Button variant="contained" color={item.status === 'paid' ? 'success' : 'error'} size="small">
                                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Typography variant="body1" align="right" sx={{ mt: 2 }}>
                        Remaining Balance: {sellings.balance}/=
                    </Typography>
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
                                {data.length > 0 && data.map((item, index) => (
                                    <TableRow key={index}>
                                       
                                        <TableCell>{item.deviceName}</TableCell>
                                        <TableCell>{item.price}/=</TableCell>
                                        <TableCell>{item.date}</TableCell>
                                        <TableCell>
                                            <Button variant="contained" size="small" onClick={() => downloadPDF(item)}>
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