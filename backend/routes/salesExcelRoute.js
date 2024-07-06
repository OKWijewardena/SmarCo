const express = require('express');
const router = express.Router();
const { salesExcel } = require("../controllers/salesExcelController");

router.post("/salesExcel", salesExcel);

module.exports = router;
