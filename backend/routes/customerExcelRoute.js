const express = require('express');
const router = express.Router();
const { customerexcel } = require("../controllers/customerExcelController");

router.post("/customerexcel", customerexcel);

module.exports = router;