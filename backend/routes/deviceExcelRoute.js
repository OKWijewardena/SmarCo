const express = require('express');
const router = express.Router();
const { addexcel } = require("../controllers/deviceExcelController");

router.post("/add", addexcel);

module.exports = router;
