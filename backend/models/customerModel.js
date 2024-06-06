const mongoose = require("mongoose");
const customerSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add the user name"],
    },
    email: {
        type: String,
        required: [true, "Please add the email"],
        unique:[true,"Email address already taken"],
    },
    password: {
        type: String,
        required: [true, "Please add user password"],
    },
    civil_id:{
        type:String,
        required:[true,"Please add the phone number"],
        unique:[true,"Email civil id already taken"],
    },
    nationality:{
        type:String,
        required:[true,"Please add the civil id"],
    },
    address:{
        type:String,
        required:[true,"Please add the address"],
    },
    paci_number:{
        type:String,
        required:[true,"Please add the Paci number"],
    },
   mobile:{
    type:Number,
    required:[true,"Please add phone number no"],
   },
   whatsapp_no:{
    type:Number,
    required:[true,"Please add whatsapp number no"],
   },
   telephone_no:{
    type:Number,
    require:[true,"Please add whatsapp telephone no"],
   }
}
,
{ timestamps: true }
);
 
module.exports=mongoose.model("customer",customerSchema);