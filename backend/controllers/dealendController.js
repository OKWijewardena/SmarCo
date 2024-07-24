const Dealend = require("../models/dealendModel");
const Selling = require("../models/sellingModel");
const asyncHandler = require("express-async-handler");
// Controller to add a new Dealend record
exports.addDealend = async (req, res) => {
    const { deviceName, emiNumber, customerName, civilID, price, months, date, advance, imageName} = req.body;
    
    try {
        const selling = await Selling.findOne({ civilID, emiNumber });
        const customArray = selling.customArray;
        const balance = parseFloat(selling.balance);
        const newAddDealend = new Dealend({
            deviceName,
            emiNumber,
            customerName,
            civilID,
            price,
            months,
            date,
            advance,
            imageName,
            balance,
            customArray
          });
      await newAddDealend.save();
      res.json("device add to Dealend successfully");
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    }
  };

// Controller to get all Dealend records
exports.getAllDealend = (req, res) => {
  Dealend.find()
    .then((DealendRecords) => {
      res.json(DealendRecords);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Error retrieving Dealend records" });
    });
};

// Controller to update a Dealend record
exports.updateDealend = async (req, res) => {
  const {
    deviceName,
    customerName,
    emiNumber,
    price,
    months,
    date,
    advance,
    balance
  } = req.body;

  const updateDealendRecord = {
    deviceName,
    customerName,
    emiNumber,
    price,
    months,
    date,
    advance,
    balance
  };

  try {
    await Dealend.findOneAndUpdate({ _id: req.params.id }, updateDealendRecord);
    res.status(200).send({ status: "Customer device purchase record updated" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "Error with updating Dealend record", error: err.message });
  }
};

// Controller to delete a Dealend record
exports.deleteDealend = (req, res) => {
  Dealend.findOneAndDelete({ _id: req.params.id })
    .then(() => {
      res.status(200).send({ status: "Customer device purchase record deleted" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Error deleting Dealend record" });
    });
};

exports.getOneDealend = (req, res) => {
  Dealend.find({ civilID: req.params.civilID })
    .then((DealendRecord) => {
      res.json(DealendRecord);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Error retrieving Dealend record" });
    });
};





