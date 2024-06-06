const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
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
    address:{
        type:String,
        required:[true,"please add the adress"],
    },
    phone:{
        type:Number,
        required:[true,"please add the phone number"],
    },
    role:{
        type:String,
        required:[true,"please select the role"],
    }

}, 
{ timestamps: true });
  

module.exports = mongoose.model("employeeAdmin", userSchema);
