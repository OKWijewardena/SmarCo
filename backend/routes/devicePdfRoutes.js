const express = require('express');
const router = express.Router();
const { convertToDevicePDF } = require("../controllers/devicePdfController");


router.post('/convertdevicePDF', convertToDevicePDF);


module.exports = router;