const express = require("express");
const router = express.Router();
const dealendController = require("../controllers/dealendController");

// Route for adding a new selling record
router.post("/addDealend", dealendController.addDealend);

// Route for getting all Dealend records
router.get("/getDealend", dealendController.getAllDealend);

// Route for updating a Dealend record
router.put("/updateDealend/:id", dealendController.updateDealend);

// Route for deleting a Dealend record
router.delete("/deleteDealend/:id", dealendController.deleteDealend);

// Route for getting a single Dealend record by ID
router.get("/getOneDealend/:civilID", dealendController.getOneDealend);



module.exports = router;
