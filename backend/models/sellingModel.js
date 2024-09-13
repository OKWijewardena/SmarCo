const mongoose = require("mongoose");

const sellingSchema = new mongoose.Schema({
  deviceName: {
    type: String,
    required: true,
  },
  emiNumber: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  civilID: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  months: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  advance: {
    type: String,
    required: true,
  },
  imageName: {
    type: String,
    required: true,
  },
  balance: {
    type: String,
    required: true,
  },
  customArray: {
    type: [
      {
        date: {
          type: String,
          required: true,
        },
        price: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          required: true,
          default: "unpaid",
        },
        updateprice: {
          type: String,
          required: true,
        },
        defaultdate: {
          type: String,
          required: true,
        },
      },
    ],
    required: true,
  },
});

const Selling = mongoose.model("Selling", sellingSchema);
module.exports = Selling;
