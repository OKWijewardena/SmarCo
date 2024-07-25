const Inventory = require("../models/inventoryModel");

exports.addInventory = async (req, res) => {
  try {
    
    // Destructure all other fields except `imageName`
    const {
      deviceName,
      price,
      color,
      shopName,
      modelNumber,
      storage,
      ram,
      warrenty,
      emiNumber,
      purchaseDate
    } = req.body;

    const newDevice = new Inventory({
      deviceName,
      price,
      color,
      shopName,
      modelNumber,
      storage,
      ram,
      warrenty,
      emiNumber,
      purchaseDate,
    });

    await newDevice.save();
    res.json("New Device Added to inventory");
  } catch (err) {
    console.error(err);
      return res.status(400).json({ message: err.message, errors: err.errors });
  }
};


exports.getAllInventory = async (req, res) => {
  try {
    const devices = await Inventory.find();
    res.json(devices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateInventory = async (req, res) => {

  const {
        deviceName,
        price,
        color,
        shopName,
        modelNumber,
        storage,
        ram,
        warrenty,
        emiNumber,
        purchaseDate,
      } = req.body;

      const updatedDevice = {
        deviceName,
        price,
        color,
        shopName,
        modelNumber,
        storage,
        ram,
        warrenty,
        emiNumber,
        purchaseDate,
      };
    try {
      await Inventory.findByIdAndUpdate(req.params.id, updatedDevice);
      res.status(200).send({ status: "Device Updated" });
    } catch (err) {
      console.error(err);
      res.status(500).send({ status: "Error with updating", error: err.message });
    }
};

exports.deleteInventory = async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.status(200).send({ status: "Device Deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  exports.deleteInventoryEMI = async (req, res) => {
    try {
      // You should provide a query object with the field and value you're looking for
      await Inventory.findOneAndDelete({ emiNumber: req.params.emiNumber });
      res.status(200).send({ status: "Device Deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  exports.getOneInventory = (req, res) => {
    Inventory.find({ emiNumber: req.params.emiNumber })
      .then((device) => {
        res.json(device);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: "Error retrieving payment" });
      });
  };

  exports.getOneInventorybyemi = (req, res) => {
    Inventory.findOne({ emiNumber: req.params.emiNumber })
      .then((device) => {
        if (!device) {
          console.log("No device found.");
          return res.status(200).json({ message: "data not available" });
        }
        res.json(device);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: "Error retrieving device" });
      });
  };
