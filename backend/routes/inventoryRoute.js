var express = require('express');
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");

// Route for adding a new device
router.post('/addInventory', inventoryController.addInventory);

// Route for getting all Inventorys
router.get("/getInventory", inventoryController.getAllInventory);

// Route for updating a Inventory
router.put("/updateInventory/:id", inventoryController.updateInventory);

// Route for deleting a Inventory
router.delete("/deleteInventory/:id", inventoryController.deleteInventory);

// Route for getting a single Inventory by ID
router.get("/getOneInventory/:emiNumber", inventoryController.getOneInventory);

// Route for delete Inventory by emi number
router.delete("/deleteInventoryemi/:emiNumber", inventoryController.deleteInventoryEMI);

router.get("/getOneInventorybyemi/:emiNumber", inventoryController.getOneInventorybyemi);

module.exports = router;
