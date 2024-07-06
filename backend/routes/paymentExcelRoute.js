const express = require('express');
const router = express.Router();
const { paymentExcel } = require("../controllers/paymentExcelController");

router.post("/paymentExcel", paymentExcel);

module.exports = router;
