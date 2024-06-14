const mongoose = require("mongoose");

const device = new mongoose.Schema({
    
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
        required : true
    },
    purchaseDate : {
        type : String,
        required : true
    },
    imageName : {
        type : String,
        required : true
    }           
});

const deviceModel = mongoose.model("device",device);
module.exports = deviceModel;
