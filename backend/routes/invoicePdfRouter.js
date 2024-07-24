const express = require("express");
const router = express.Router();
const {
  convertToPDF,
  convertToPaymentInvoicePDF,
  convertToOverAllPaymentInvoicePDF,
} = require("../controllers/invoicePdfController");

router.post("/convertPDF", convertToPDF);
router.post("/convertToPaymentInvoicePDF", convertToPaymentInvoicePDF);
router.post(
  "/convertToOverAllPaymentInvoicePDF",
  convertToOverAllPaymentInvoicePDF
);

module.exports = router;
