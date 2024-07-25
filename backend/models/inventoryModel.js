const mongoose = require("mongoose");

const inventory = new mongoose.Schema({
    
    deviceName : {
        type : String,
        required : true
    },
    price : {
        type : String,
        required : true
    },
    color : {
        type : String,
        required : true
    }, 
    shopName : {
        type : String,
        required : true
    },
    modelNumber : {
        type : String,
        required : true
    },
    storage : {
        type : String,
        required : true
    },
    ram : {
        type : String,
        required : true
    },
    warrenty : {
        type : String,
        required : true
    },
    emiNumber : {
        type : String,
        required : true,
        unique:[true,"EMI Number already taken"],
    },
    purchaseDate : {
        type : String,
        required : true
    }     
});

const inventoryModel = mongoose.model("inventory",inventory);
module.exports = inventoryModel;
