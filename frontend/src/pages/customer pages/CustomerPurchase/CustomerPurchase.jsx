import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { json, useParams } from "react-router-dom";
import { Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';

export default function CustomerPurchase() {

  const user = JSON.parse(sessionStorage.getItem('user'));
  // Check if the user object exists and then access the email property
  const civil_id = user.civil_id;
if (user) {
  const civil_id = user.civil_id;
  console.log('civil id:', civil_id); // You can use the email as needed
  
} else {
  console.log('No user data found in session storage');
}



    const { id } = useParams();

    
    const [sellings, setSellings] = useState([]);
    const [data, setData] = useState([]);

    const fetchSellings = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:8000/selling/getOneSellingID/${id}`);
          console.log(id);
         

            setSellings(response.data);
        } catch (error) {
            console.error('Error fetching devices:', error);
        }
    }, [id]);
    
    useEffect(() => {
        fetchSellings();

        fetch(`http://localhost:8000/payment/getOnePayment/${civil_id}`, {
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
        fetch('http://localhost:8000/convertToPaymentInvoicePDF', {
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
        <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h4" align="center" sx={{ mb: 2, flexGrow: 1, 
                background: 'linear-gradient(90deg, #C63DE7, #752888)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: 'Public Sans, sans-serif',
                fontWeight: 'bold',
                marginTop:'20px' }}>
                SMART CO
            </Typography>
            <Typography variant="h5" align="center" sx={{ mb: 2 }}>
                iPhone 11
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <img src={`/images/deviceImages/${sellings.imageName}`} alt="iPhone 11" style={{ width: '100%', maxWidth: 300 }} />
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
                                       
                                        <TableCell>{item._id}</TableCell>
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
    );
}