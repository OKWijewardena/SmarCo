const asyncHandler = require("express-async-handler");
const usermodel = require("../models/userModel");
const bcrypt=require("bcryptjs");
const axios = require('axios');

//@desc forget password 
//@route post /api/users/login
//@access public

const forgot_password = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email ) {
      res.status(400);
      throw new Error("Please enter your email!");
    }

    const userlogin = await usermodel.findOne({ email });
    if(!userlogin){
        res.status(400);
        throw new Error("user not available")
    }
   else {
    res.status(200).send('Email is available');
    console.log('Email is available');
   }
   

});

module.exports={forgot_password};
