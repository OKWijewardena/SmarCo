const express = require("express");
const connectionDb = require("./config/dbconnection");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const cors = require("cors");
const path = require('path');

connectionDb();
const app = express();

app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Define the path to the images folder
const imagesPath = path.join(__dirname, 'frontend/src/images/deviceImages');

// Serve static files from the images directory
app.use('/images/deviceImages', express.static(imagesPath));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

const deviceExcelRoutes = require('./routes/deviceExcelRoute');
const customerExcelRotes=require('./routes/customerExcelRoute');
const employeeandAdminExcel=require('./routes/adminandemployeeExcelRoute');
const paymentExcel=require('./routes/paymentExcelRoute');
const salesExcel=require('./routes/salesExcelRoute');
const dealendExcel = require("./routes/dealendExcelRoute");

// Define API routes
app.use("/api/device", require("./routes/deviceRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/employee&admin", require("./routes/employee&adminRoutes"));
app.use("/api/customer", require("./routes/customerRoutes"));
app.use("/device", require("./routes/deviceRoutes"));
app.use("/selling", require("./routes/sellingRoutes"));
app.use("/dealend", require("./routes/dealendRoutes"));
app.use("/payment", require("./routes/paymentRoutes"));
app.use("/api/invoice", require("./routes/invoiceRote"));
app.use("/api", require("./routes/forgetPassword"));
app.use("/", require("./routes/invoicePdfRouter"));
app.use("/api/devicepdf",require("./routes/devicePdfRoutes"));
app.use("/api/dealendpdf", require("./routes/dealendpdfRoutes"));
app.use("/api/salespdf",require("./routes/salespdfRoutes"));
app.use("/", require("./routes/customerpdfRoutes"));
app.use("/", require("./routes/employeeAndAdminPdfRoutes"));

app.use('/api/excel', deviceExcelRoutes);
app.use("/api/dealendexcel", dealendExcel);
app.use('/api/customer', customerExcelRotes);
app.use('/api/employee', employeeandAdminExcel);
app.use('/api/paymentExcel', paymentExcel);
app.use('/api/salesExcel', salesExcel);

// Error handler middleware
app.use(errorHandler);

// The "catchall" handler: for any request that doesn't match one above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Assign into localhost ports
const PORT = process.env.PORT || 8000;

// Run on port
app.listen(PORT, () => {
  console.log(`Server is up and running on port number: ${PORT}`);
});
