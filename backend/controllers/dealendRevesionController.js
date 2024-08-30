const Selling = require("../models/sellingModel");
const asyncHandler = require("express-async-handler");
// Controller to add a new selling record
exports.addSellingfromdealend = async (req, res) => {
  const {
    deviceName,
    emiNumber,
    customerName,
    civilID,
    price,
    months,
    date,
    advance,
    imageName,
  } = req.body;

  const currentbalance = (parseFloat(price) - parseFloat(advance)).toFixed(2);
  const installment = (currentbalance / parseFloat(months)).toFixed(2);
  const balance = String(currentbalance);
  const customArray = [];

  for (let i = 0; i < months; i++) {
    const nextMonthDate = new Date(date);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + (i + 1));

    const formattedNextMonthDate = `${nextMonthDate.getFullYear()}-${String(
      nextMonthDate.getMonth() + 1
    ).padStart(2, "0")}-${String(nextMonthDate.getDate()).padStart(2, "0")}`;

    const monthData = {
      date: formattedNextMonthDate,
      price: String(installment),
      status: "unpaid",
    };

    customArray.push(monthData);
  }

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
    customArray,
  });

  try {
    await newAddSelling.save();
    res.json("New customer device purchased");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};