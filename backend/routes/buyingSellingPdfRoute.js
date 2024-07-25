const express = require("express");
const router = express.Router();
const {
  convertTobuyingSellingPDF,
} = require("../controllers/buyingSellingPdfController");

router.post("/convertTobuyingSellingPDF", convertTobuyingSellingPDF);

module.exports = router;
