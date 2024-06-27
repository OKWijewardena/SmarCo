const mongoose = require("mongoose");

const payment = new mongoose.Schema({
    
    customerName : {
        type : String,
        required : true
    },
    civilID : {
        type : String,
        required : true
    },
    deviceName : {
        type : String,
        required : true
    },
    emiNumber : {
        type : String,
        required : true
    },
    price : {
        type : String,
        required : true
    },
    date : {
        type : String,
        required : true
    }       
});

const paymentModel = mongoose.model("payment",payment);
module.exports = paymentModel;