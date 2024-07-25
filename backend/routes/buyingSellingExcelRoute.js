const express = require("express");
const router = express.Router();
const {
  byingSellingExcel,
} = require("../controllers/buyingSellingExcelController");

router.post("/byingSellingExcel", byingSellingExcel);

module.exports = router;
