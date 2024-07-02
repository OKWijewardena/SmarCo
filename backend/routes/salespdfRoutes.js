const express = require('express');
const router = express.Router();
const { convertTosalesPDF } = require("../controllers/salesPdfController");


router.post('/convertsalesPDF', convertTosalesPDF);


module.exports = router;