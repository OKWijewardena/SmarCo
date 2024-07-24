const express = require("express");
const router = express.Router();
const { convertTodealendPDF } = require("../controllers/dealendPdfController");

router.post("/convertdealendPDF", convertTodealendPDF);

module.exports = router;
