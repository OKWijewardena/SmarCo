const Device = require("../models/deviceModel");
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Set up Cloudinary configuration
cloudinary.config({
  cloud_name: 'dpetznvmv',
  api_key: '168744838856757',
  api_secret: 'f65Q2OTAUiP5jgq66MBvd4mQiaE'
});


// Assume `upload.single('imageName')` is the middleware for the route
exports.addDevice = async (req, res) => {
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

    let imageUrl = '';
    if (req.file) {
      // Use `req.file.path` instead of `imageName`
      const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' });
      imageUrl = result.secure_url;
    }

    const newDevice = new Device({
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
      imageName: imageUrl // Save the Cloudinary URL
    });

    await newDevice.save();
    res.json("New Device Added");
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message, errors: err.errors });
    }
    res.status(500).json({ message: "Internal server error" });
  }
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
        imageName
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
        imageName
      };
    try {
      await Device.findByIdAndUpdate(req.params.id, updatedDevice);
      res.status(200).send({ status: "Device Updated" });
    } catch (err) {
      console.error(err);
      res.status(500).send({ status: "Error with updating", error: err.message });
    }
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

  exports.getOneDevicebyemi = (req, res) => {
    Device.findOne({ emiNumber: req.params.emiNumber })
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
