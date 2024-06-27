
const Payment = require("../models/paymentModel");

// Controller to add a new payment
exports.addPayment = (req, res) => {
  const { customerName, civilID, deviceName, emiNumber, price, date } = req.body;

  const newPayment = new Payment({
    customerName,
    civilID,
    deviceName,
    emiNumber,
    price,
    date,
  });

  newPayment
    .save()
    .then(() => {
      res.json("New Payment Added");
    })
    .catch((err) => {
      console.log(err);
      res.status().json({ error: "Error adding new payment" });
    });
};

// Controller to get all payments
exports.getAllPayments = (req, res) => {
  Payment.find()
    .then((payments) => {
      res.json(payments);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Error retrieving payments" });
    });
};

// Controller to update a payment
exports.updatePayment = async (req, res) => {
  const { customerName, civilID, deviceName, emiNumber, price, date } = req.body;

  const updatePayment = {
    customerName,
    civilID,
    deviceName,
    emiNumber,
    price,
    date,
  };

  try {
    await Payment.findOneAndUpdate({ civilID : req.params.civilID }, updatePayment);
    res.status(200).send({ status: "Payment Updated" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "Error with updating payment", error: err.message });
  }
};

// Controller to delete a payment
exports.deletePayment = (req, res) => {
  Payment.findOneAndDelete({ _id : req.params.id })
    .then(() => {
      res.status(200).send({ status: "Payment Deleted" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Error deleting payment" });
    });
};

// Controller to get a single payment by ID
exports.getOnePayment = async (req, res) => {
  const { civilID, emiNumber } = req.body;
  try {
    const payments = await Payment.find({ civilID, emiNumber });
    res.json(payments);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error retrieving payment" });
  }
};


