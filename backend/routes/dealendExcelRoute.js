const express = require("express");
const router = express.Router();
const { dealendExcel } = require("../controllers/dealendExcelController");

router.post("/dealendExcel", dealendExcel);

module.exports = router;
