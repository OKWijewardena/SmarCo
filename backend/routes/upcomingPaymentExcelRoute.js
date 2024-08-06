const express = require("express");
const router = express.Router();
const {
  upcomingPaymentExcel,
} = require("../controllers/upcomingPaymentExcelController");

router.post("/upcomingPaymentExcel", upcomingPaymentExcel);

module.exports = router;
