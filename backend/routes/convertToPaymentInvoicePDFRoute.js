const express = require("express");
const router = express.Router();
const {
  convertToPaymentInvoicePDF,
} = require("../controllers/customerPaymentInvoicepdf");

router.post("/convertToCustomerPaymentInvoicePDF", convertToPaymentInvoicePDF);

module.exports = router;
