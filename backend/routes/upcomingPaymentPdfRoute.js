const express = require("express");
const router = express.Router();
const {
  convertToupcomingPaymentPDF,
} = require("../controllers/upcomingPaymentPdfController");

router.post("/convertToupcomingPaymentPDF", convertToupcomingPaymentPDF);

module.exports = router;
