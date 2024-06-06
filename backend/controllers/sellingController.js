const Selling = require("../models/sellingModel");
const asyncHandler = require("express-async-handler");
// Controller to add a new selling record
exports.addSelling = async (req, res) => {
    const { deviceName, emiNumber, customerName, civilID, price, months, date, advance, imageName } = req.body;
    
    const currentbalance = parseFloat(price) * parseFloat(months);
    const balance = String(currentbalance);
    const customArray = [];
  
    for (let i = 0; i < months; i++) {
      const nextMonthDate = new Date(date);
      nextMonthDate.setMonth(nextMonthDate.getMonth() + (i+1));
  
      const formattedNextMonthDate = `${nextMonthDate.getFullYear()}-${String(nextMonthDate.getMonth() + 1).padStart(2, '0')}-${String(nextMonthDate.getDate()).padStart(2, '0')}`;
      
      const monthData = { 
        date: formattedNextMonthDate,
        price: String(price),
        status: 'unpaid'
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
      customArray
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

  const updateSellingRecord = {
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
    await Selling.findOneAndUpdate({ _id: req.params.id }, updateSellingRecord);
    res.status(200).send({ status: "Customer device purchase record updated" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "Error with updating selling record", error: err.message });
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

// Controller to get a single selling record by ID
exports.getOneSellingID = (req, res) => {
  Selling.findOne({ _id: req.params.id })
    .then((sellingRecord) => {
      res.json(sellingRecord);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Error retrieving selling record" });
    });
};

exports.updatePaymentHistory = async (req, res) => {
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
      const itemDate = new Date(customArray[i].date);
      const itemPrice = parseFloat(customArray[i].price);

      if (itemDate >= new Date(date) && itemPrice === parseFloat(payment) && customArray[i].status === "unpaid") {
        customArray[i].status = "paid";
        customArray[i].price = payment.toString();
        balance -= parseFloat(payment);
        isPaymentUpdated = true;
        break;
      } else if (itemDate >= new Date(date) && itemPrice > parseFloat(payment) && customArray[i].status === "unpaid") {
        customArray[i].status = "paid";
        customArray[i].price = payment.toString();
        const newPrice = 2 * itemPrice - parseFloat(payment);
        balance -= parseFloat(payment);

        if (customArray[i + 1]) {
          customArray[i + 1].price = newPrice.toString();
        } else {
          console.error('No next item to update the price for.');
        }

        isPaymentUpdated = true;
        break;
      } else if (itemDate >= new Date(date) && itemPrice < parseFloat(payment) && customArray[i].status === "unpaid") {
        customArray[i].status = "paid";
        customArray[i].price = payment.toString();
        const newPrice = itemPrice - (parseFloat(payment) - itemPrice);
        balance -= parseFloat(payment);

        if (customArray[i + 1]) {
          customArray[i + 1].price = newPrice.toString();
        } else {
          console.error('No next item to update the price for.');
        }

        isPaymentUpdated = true;
        break;
      }
    }

    if (!isPaymentUpdated) {
      return res.status(404).json({ message: "No matching unpaid record found with the given date and payment amount" });
    }

    selling.balance = balance.toString();
    await selling.save();

    res.json({ message: "Payment status updated successfully", customArray: selling.customArray });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
