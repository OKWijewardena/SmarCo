const express = require('express');
const router = express.Router();
const { convertToPDF ,convertToPaymentInvoicePDF} = require("../controllers/invoicePdfController");



router.post("/convertPDF", convertToPDF);
router.post("/convertToPaymentInvoicePDF",convertToPaymentInvoicePDF)

module.exports = router;
 