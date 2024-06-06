const express = require('express');
const router = express.Router();
const { convertToemployeeAndAdminPDF } = require("../controllers/employeeAndAdminPdfController");


router.post('/employeeAndAdminPdf', convertToemployeeAndAdminPDF);


module.exports = router;