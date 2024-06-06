const express = require("express");
const connectionDb = require("./config/dbconnection");
const errorHandler = require("./middleware/errorHandler");
const dotenv=require("dotenv").config();
const cors = require("cors"); 
const puppeteer = require('puppeteer');
const path = require('path');

connectionDb();
const app=express();
app.use(cors());
//Assign into localhost ports
const PORT = process.env.PORT || 8000;

//app.use =middeleware
app.use(express.json());

// Define the path to the images folder
const imagesPath = path.join(__dirname, 'frontend/src/images/deviceImages');

// Serve static files from the images directory
app.use('/images/deviceImages', express.static(imagesPath));

app.use("/api/device", require("./routes/deviceRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/employee&admin",require("./routes/employee&adminRoutes"));
app.use("/api/customer",require("./routes/customerRoutes"));
app.use("/device",require("./routes/deviceRoutes"));
app.use("/selling",require("./routes/sellingRoutes"));
app.use("/payment",require("./routes/paymentRoutes"));
app.use("/api/invoice",require("./routes/invoiceRote"));
app.use(errorHandler);
app.use("/", require("./routes/invoicePdfRouter"));
app.use("/",require("./routes/devicePdfRoutes"));
app.use("/",require("./routes/customerpdfRoutes"));
app.use("/",require("./routes/employeeAndAdminPdfRoutes"));
app.use("/api",require("./routes/forgetPassword"));
//Run on port
app.listen(PORT, () => {
  console.log(`Server is up and running on port number : ${PORT}`);
});



