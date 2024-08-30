const express = require("express");
const router = express.Router();
const dealendReversion = require("../controllers/dealendRevesionController");

// Route for adding a new selling record
router.post("/addSelling", dealendReversion.addSellingfromdealend);




module.exports = router;