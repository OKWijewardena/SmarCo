const express = require('express');
const router = express.Router();
const { employeeandadminexcel } = require("../controllers/employeeandAdminExcelController");

router.post("/employeeandadminexcel", employeeandadminexcel);

module.exports = router;