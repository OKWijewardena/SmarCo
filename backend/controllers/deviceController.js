const Device = require("../models/deviceModel");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// const dscf = require('../../frontend/src/images/deviceImages')

// Define the upload path
const uploadPath = path.join(__dirname, '../../frontend/public/images/deviceImages');

// Ensure the upload path exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath); // Folder to save the images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // File name
  }
});

const upload = multer({ storage: storage }).single('imageName');

exports.addDevice = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Multer Error:', err);
      return res.status(500).json({ message: "Error uploading file" });
    }
    try {
      const {
        deviceName,
        price,
        color,
        shopName,
        modelNumber,
        storage,
        warrenty,
        emiNumber,
        purchaseDate,
        expireDate
      } = req.body;

      const newDevice = new Device({
        deviceName,
        price,
        color,
        shopName,
        modelNumber,
        storage,
        warrenty,
        emiNumber,
        purchaseDate,
        expireDate,
        imageName: req.file ? req.file.filename : ''
      });

      await newDevice.save();

      res.json("New Device Added");
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
};

exports.getAllDevices = async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateDevice = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: "Error uploading file" });
    }
    try {
      const {
        deviceName,
        price,
        color,
        shopName,
        modelNumber,
        storage,
        warrenty,
        emiNumber,
        purchaseDate,
        expireDate
      } = req.body;

      const updatedDevice = {
        deviceName,
        price,
        color,
        shopName,
        modelNumber,
        storage,
        warrenty,
        emiNumber,
        purchaseDate,
        expireDate,
        imageName: req.file ? req.file.filename : req.body.imageName
      };

      await Device.findByIdAndUpdate(req.params.id, updatedDevice);
      res.status(200).send({ status: "Device Updated" });
    } catch (err) {
      console.error(err);
      res.status(500).send({ status: "Error with updating", error: err.message });
    }
  });
};

exports.deleteDevice = async (req, res) => {
  try {
    await Device.findByIdAndDelete(req.params.id);
    res.status(200).send({ status: "Device Deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  exports.deleteDeviceEMI = async (req, res) => {
    try {
      // You should provide a query object with the field and value you're looking for
      await Device.findOneAndDelete({ emiNumber: req.params.emiNumber });
      res.status(200).send({ status: "Device Deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  exports.getOneDevice = (req, res) => {
    Device.find({ emiNumber: req.params.emiNumber })
      .then((device) => {
        res.json(device);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: "Error retrieving payment" });
      });
  };
