const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Route for adding a new payment
router.post("/addPayment", paymentController.addPayment);

// Route for getting all payments
router.get("/getPayment", paymentController.getAllPayments);

// Route for updating a payment
router.put("/updatePayment/:civilID", paymentController.updatePayment);

// Route for deleting a payment
router.delete("/deletePayment/:id", paymentController.deletePayment);

// Route for getting a single payment by ID
router.post("/getOnePayment", paymentController.getOnePayment);

module.exports = router;
