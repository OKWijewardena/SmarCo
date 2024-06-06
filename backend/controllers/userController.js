const asyncHandler = require("express-async-handler");
const usermodel = require("../models/usermodel");
const bcrypt=require("bcryptjs");
const axios = require('axios');

//@desc register a user
//@route post /api/ users / register
//@access public

const registerUser=asyncHandler(async(req,res)=>{

    const {name,email,password,role}=req.body;
    if(!name||!email||!password||!role)
    {
        res.status(400);
        throw new Error("All field are mendotory!");
    }

    const userAvailable=await usermodel.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("user already register")
    }
   //has password
   const hashedPassword=await bcrypt.hash(password,10);
    // create new user
    const user = await usermodel.create({
      name,
      email,
      password:hashedPassword,
      role,
    });
    console.log("user create success ",user)
    if(user){
        res.status(201).json({_id:user.id,email:user.email,role:user.role})
    }else{
        res.status(400);
        throw new Error("User data is not valid");
    }
  
  });
    

  //@desc login a user
//@route post /api/ users / login
//@access public

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("All fields are mandatory!");
    }

     // Check if the email is SuperAdmin
 if(email.toLowerCase() === "superadmin@gmail.com"&& password==="123") {
    return res.status(200).json({message: "SuperAdmin page", user: {role: "superadmin", userInfo: "superadmin"}});
}

    const userlogin = await usermodel.findOne({ email });
    if(!userlogin){
        res.status(400);
        throw new Error("user not available")
    }
    //compare password with has password
    if(userlogin && (await bcrypt.compare(password,userlogin.password))){
          // Check user role and return appropriate message
          let message;
          let role;
          let userInfo;
          switch(userlogin.role) {
              case 'admin':
              case 'employee':
                  userInfo = await axios.get(`http://localhost:8000/api/employee&admin/${email}`);
                  role = userlogin.role;
                  message = `${role.charAt(0).toUpperCase() + role.slice(1)} page`;
                  break;
              case 'customer':
                  userInfo = await axios.get(`http://localhost:8000/api/customer/${email}`);
                  role = 'customer';
                  message = "Customer page";
                  break;
              
          }
          userInfo.data.role = role;
          res.status(200).json({message: message, user: userInfo.data})
        

    } else {
        res.status(400);
        throw new Error("password not matched!");
    }
});
  
//@desc get user data
//@route get /api/users/email
//@access private
const getregisterduser= asyncHandler(async(req,res)=>{
    const email = req.params.email; // get email from URL parameters
    console.log(`Searching for user with email: ${email}`);
    const userData = await usermodel.findOne({ email });
    
    console.log(`Found user: ${JSON.stringify(userData)}`);
    if(!userData){
        res.status(404);
        throw new Error("Contact not Email");
    } 
    res.status(200).json(userData); // return the user data
});


//@desc update user data
//@route put /api/users/email
//@access private
const updateregisterduser = asyncHandler(async(req, res) => {
    const email = req.params.email; // get email from URL parameters
    if(!email){
        res.status(404);
        throw new Error("Contact not found");
    }

    let updateData = req.body;

    // Check if password is being updated
    if (updateData.password) {
        // Hash the new password
        updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    // Find the user and update their data
    const userupdated = await usermodel.findOneAndUpdate(
        { email }, // find a document with this filter
        updateData, // document to insert when nothing was found
        { new: true, runValidators: true }, // options
    );

    if (!userupdated) {
        res.status(404);
        throw new Error("Error updating user");
    }

    res.status(200).json(userupdated); // return the updated user data
});

//@desc delete user data
//@route delete /api/users/email
//@access private
const deleteregisterduser = asyncHandler(async(req, res) => {
    const email = req.params.email; // get email from URL parameters
    if(!email){
        res.status(404);
        throw new Error("Contact not found");
    }

    // Find the user and delete their data
    const userdeleted = await usermodel.findOneAndDelete({ email });

    if (!userdeleted) {
        res.status(404);
        throw new Error("Error deleting user");
    }

    res.status(200).json({ message: "User deleted successfully" });
});


  module.exports={registerUser,loginUser,getregisterduser,updateregisterduser,deleteregisterduser}