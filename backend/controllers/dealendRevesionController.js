const Dealend = require("../models/dealendModel");
const Selling = require("../models/sellingModel");
const asyncHandler = require("express-async-handler");
// Controller to add a new selling record
exports.addSellingfromdealend = async (req, res) => {
  const { deviceName, emiNumber, customerName, civilID, price, months, date, advance, imageName} = req.body;
    
    try {
        const dealend = await Dealend.findOne({ civilID, emiNumber });
        const customArray = dealend.customArray;
        const balance = parseFloat(dealend.balance);
        const newAddSelling = new Selling({
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
      await newAddSelling.save();
      res.json("device add to Selling successfully");
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    }
};