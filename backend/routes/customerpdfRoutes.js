const express = require('express');
const router = express.Router();
const { convertTocustomerPDF } = require("../controllers/customerPdfController");


router.post('/convertcustomerPDF', convertTocustomerPDF);


module.exports = router;