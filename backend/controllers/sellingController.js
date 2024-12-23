const Selling = require("../models/sellingModel");
const asyncHandler = require("express-async-handler");
// Controller to add a new selling record
exports.addSelling = async (req, res) => {
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
      updateprice: String(installment),
      defaultdate: formattedNextMonthDate,
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

// Controller to get all selling records
exports.getAllSelling = (req, res) => {
  Selling.find()
    .then((sellingRecords) => {
      res.json(sellingRecords);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Error retrieving selling records" });
    });
};

// Controller to update a selling record
exports.updateSelling = async (req, res) => {
  const { deviceName, emiNumber, customerName, civilID, price, months, date, advance, imageName } = req.body;

  try {
    // Fetch the selling record by ID
    const sellingRecord = await Selling.findById(req.params.id);
    if (!sellingRecord) {
      return res.status(404).send({ status: "Selling record not found" });
    }

    // Check if customArray has any entry with status "paid"
    const hasPaidEntry = sellingRecord.customArray.some(entry => entry.status === "paid");
    if (hasPaidEntry) {
      return res.status(400).send({ status: "You already made a payment for this selling, unable to update the record." });
    }

    // Calculate new balance and installment based on the new data
    const currentbalance = (parseFloat(price) - parseFloat(advance)).toFixed(2);
    const installment = (currentbalance / parseFloat(months)).toFixed(2);
    const balance = String(currentbalance);
    const updatedCustomArray = [];

    // Generate updated customArray with recalculated installment dates and amounts
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
        updateprice: String(installment),
        defaultdate: formattedNextMonthDate,
      };

      // Retain the _id if it exists to avoid MongoDB from creating new entries
      if (sellingRecord.customArray[i]?._id) {
        monthData._id = sellingRecord.customArray[i]._id;
      }

      updatedCustomArray.push(monthData);
    }

    // Prepare the updated selling record
    const updatedSellingRecord = {
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
      customArray: updatedCustomArray,  // Use the updated customArray
    };

    // Update the record with the new values
    await Selling.findOneAndUpdate({ _id: req.params.id }, updatedSellingRecord, { new: true });
    res.status(200).send({ status: "Customer device purchase record updated successfully with recalculated installments." });
  } catch (err) {
    console.log("Error during selling update:", err);
    res.status(500).send({
      status: "Error with updating selling record",
      error: err.message,
    });
  }
};

// Controller to delete a selling record
exports.deleteSelling = (req, res) => {
  Selling.findOneAndDelete({ _id: req.params.id })
    .then(() => {
      res.status(200).send({ status: "Customer device purchase record deleted" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Error deleting selling record" });
    });
};

exports.getOneSelling = (req, res) => {
  Selling.find({ civilID: req.params.civilID })
    .then((sellingRecord) => {
      res.json(sellingRecord);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Error retrieving selling record" });
    });
};

exports.getonesellingByIdEmi = (req, res) => {
  const { civilID, emiNumber } = req.params;
  console.log("Searching for civil_id:", civilID, "and emi_no:", emiNumber);

  Selling.findOne({ civilID, emiNumber })
    .then((sellingRecord) => {
      if (!sellingRecord) {
        console.log("No record found.");
        return res.status(404).json({ message: "Record not found" });
      }
      console.log("Found record:", sellingRecord);
      res.json(sellingRecord);
    })
    .catch((err) => {
      console.error("Error retrieving selling record:", err);
      res.status(500).json({ error: "Error retrieving selling record" });
    });
};

// Controller to get a single selling record by ID
exports.getOneSellingID = (req, res) => {
  Selling.find({ _id: req.params.id })
    .then((sellingRecord) => {
      res.json(sellingRecord);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Error retrieving selling record" });
    });
};

exports.getonesellingByIdEminumber = (req, res) => {
  const { emi } = req.params;
  console.log({ emi });
  Selling.findOne({ emiNumber: emi })
    .then((sellingRecord) => {
      if (!sellingRecord) {
        console.log("No record found.");
        return res.status(200).json({ message: "data not available" });
      }
      console.log("Found record:", sellingRecord);
      res.json(sellingRecord);
    })
    .catch((err) => {
      console.error("Error retrieving selling record:", err);
      res.status(500).json({ error: "Error retrieving selling record" });
    });
};

exports.updatePaymentHistory = async (req, res) => {
  const { civilID, emiNumber, date, paymentDate, payment } = req.body;

  try {
    const selling = await Selling.findOne({ civilID, emiNumber });

    if (!selling) {
      return res.status(404).json({ message: "Selling record not found" });
    }

    let isPaymentUpdated = false;
    const customArray = selling.customArray;
    let balance = parseFloat(selling.balance);

    for (let i = 0; i < customArray.length; i++) {
      const itemDate = new Date(customArray[i].date);
      const itemPrice = parseFloat(customArray[i].price);
      let nextPrice = parseFloat(customArray[i].price);

      if (customArray[i + 1]) {
        nextPrice = parseFloat(customArray[i + 1].price);
      } else {
        nextPrice = parseFloat(customArray[i].price);
      }

      if (
        itemDate >= new Date(paymentDate) &&
        itemPrice === parseFloat(payment) &&
        customArray[i].status === "unpaid"
      ) {
        customArray[i].status = "paid";
        customArray[i].price = payment.toString();
        customArray[i].date = date.toString();
        balance -= parseFloat(payment);
        balance = balance.toFixed(2); // Ensure balance is rounded to 2 decimals
        isPaymentUpdated = true;
        break;
      } else if (
        itemDate >= new Date(paymentDate) &&
        itemPrice > parseFloat(payment) &&
        customArray[i].status === "unpaid"
      ) {
        customArray[i].status = "paid";
        customArray[i].price = payment.toString();
        customArray[i].date = date.toString();
        const newPrice = (
          nextPrice +
          (itemPrice - parseFloat(payment))
        ).toFixed(2);
        balance -= parseFloat(payment);
        balance = balance.toFixed(2); // Ensure balance is rounded to 2 decimals

        if (customArray[i + 1]) {
          customArray[i + 1].price = newPrice.toString();
          customArray[i + 1].updateprice = newPrice.toString();
        } else {
          console.error("No next item to update the price for.");
        }

        isPaymentUpdated = true;
        break;
      } else if (
        itemDate >= new Date(paymentDate) &&
        itemPrice < parseFloat(payment) &&
        customArray[i].status === "unpaid"
      ) {
        customArray[i].status = "paid";
        customArray[i].price = payment.toString();
        customArray[i].date = date.toString();
        const newPrice = (
          nextPrice -
          (parseFloat(payment) - itemPrice)
        ).toFixed(2);
        balance -= parseFloat(payment);
        balance = balance.toFixed(2); // Ensure balance is rounded to 2 decimals

        if (customArray[i + 1]) {
          customArray[i + 1].price = newPrice.toString();
          customArray[i + 1].updateprice = newPrice.toString();
        } else {
          console.error("No next item to update the price for.");
        }

        isPaymentUpdated = true;
        break;
      }
    }

    if (!isPaymentUpdated) {
      return res
        .status(404)
        .json({
          message:
            "No matching unpaid record found with the given date and payment amount",
        });
    }

    selling.balance = balance.toString();
    await selling.save();

    res.json({
      message: "Payment status updated successfully",
      customArray: selling.customArray,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateDeletePaymentHistory = async (req, res) => {
  const { civilID, emiNumber, date, payment } = req.body;

  try {
    const selling = await Selling.findOne({ civilID, emiNumber });

    if (!selling) {
      return res.status(404).json({ message: "Selling record not found" });
    }

    let isPaymentUpdated = false;
    const customArray = selling.customArray;
    let balance = parseFloat(selling.balance);

    for (let i = 0; i < customArray.length; i++) {
      const itemDate = customArray[i].date;
      const updatePrice = parseFloat(customArray[i].updateprice);
      const itemPrice = parseFloat(customArray[i].price);

      // Ensure the next item exists before accessing its properties
      let nextPrice = 0;
      let nextUpdatePrice = 0;

      if (customArray[i + 1]) {
        nextPrice = parseFloat(customArray[i + 1].price);
        nextUpdatePrice = parseFloat(customArray[i + 1].updateprice);
      } else {
        nextPrice = itemPrice; // Fallback to current item's price if next item doesn't exist
        nextUpdatePrice = updatePrice; // Fallback to current item's update price
      }

      console.log(itemPrice);
      console.log(payment);
      console.log(customArray[i].date);
      console.log(date);

      if (
        itemDate === date &&
        itemPrice === parseFloat(payment) &&
        customArray[i].status === "paid"
      ) {
        let newPrice = 0;

        if (updatePrice > nextUpdatePrice) {
          newPrice = nextUpdatePrice + (updatePrice - nextUpdatePrice);
        } else if (updatePrice < nextUpdatePrice) {
          newPrice = nextUpdatePrice - (nextUpdatePrice - updatePrice);
        } else {
          newPrice = nextUpdatePrice;
        }

        customArray[i].status = "unpaid";
        customArray[i].price = updatePrice.toString();
        customArray[i].date = customArray[i].defaultdate.toString();
        customArray[i + 1].price = newPrice.toString();
        customArray[i + 1].updateprice = newPrice.toString();
        balance += parseFloat(payment);
        balance = balance.toFixed(2); // Ensure balance is rounded to 2 decimals
        isPaymentUpdated = true;
        break;
      }
    }

    if (!isPaymentUpdated) {
      return res.status(404).json({
        message: "No matching unpaid record found with the given date and payment amount",
      });
    }

    selling.balance = balance.toString();
    await selling.save();

    res.json({
      message: "Payment status updated successfully",
      customArray: selling.customArray,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

