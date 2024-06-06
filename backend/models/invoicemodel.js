const mongoose = require("mongoose");
const InvoiceSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add the user name"],
    },
    id_card_no: {
        type: String,
        required: [true, "Please add the id_card_no"],
    },
    phone: {
        type: String, 
        required: [true, "Please add phone number"],
    },
    description: {
        type: String, 
        required: [true, "Please add the description"],
    },
    qty: {
        type: Number, 
        required: [true, "Please add the qty"],
    },
    unit_price_k_D: {
        type: Number, 
        required: [true, "Please add the unit price kD"],
    },
    total_price_k_D: {
        type: Number, 
        required: [true, "Please add the total price kD"],
    }
},
{ timestamps: true }
);

module.exports = mongoose.model("invoice", InvoiceSchema);
