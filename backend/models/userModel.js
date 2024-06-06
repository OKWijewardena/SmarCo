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
    role:{
    type:String,
    require:[true,"please add user role"],
    }
}, 
{ timestamps: true });
  

module.exports = mongoose.model("user", userSchema);
