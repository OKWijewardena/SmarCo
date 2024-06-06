const express = require("express");
const router = express.Router();
const sellingController = require("../controllers/sellingController");

// Route for adding a new selling record
router.post("/addSelling", sellingController.addSelling);

// Route for getting all selling records
router.get("/getSelling", sellingController.getAllSelling);

// Route for updating a selling record
router.put("/updateSelling/:id", sellingController.updateSelling);

// Route for deleting a selling record
router.delete("/deleteSelling/:id", sellingController.deleteSelling);

// Route for getting a single selling record by ID
router.get("/getOneSelling/:civilID", sellingController.getOneSelling);

// Route for getting a single selling record by ID
router.get("/getOneSellingID/:id", sellingController.getOneSellingID);

// Route for updating payment history in a selling record
router.post("/paymentHistory", sellingController.updatePaymentHistory);

module.exports = router;
