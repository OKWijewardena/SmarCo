const asyncHandler = require("express-async-handler");
const employeeAdminModel =require("../models/employeeAdminModel");
const bcrypt=require("bcryptjs");
const validator = require("validator");


//@desc get all Admin and Employee
//@route get /api/ adminemployee / 
//@access public
const employeeAdmin=asyncHandler(async(req, res) => {
    const employeeAdmin=await employeeAdminModel.find();
    res.status(200).json(employeeAdmin);
    });


//@desc register a Admin or Employee
//@route post /api/ users / register
//@access public

const registeremployeeandadmin=asyncHandler(async(req,res)=>{
   const{name,email,password,address,phone,role}=req.body;
   if(!name||!email||!password||!address||!phone||!role)
   {
    res.status(400);
    throw new Error("All field are mendotory");
   }
      // Validate name
      if (!validator.isAlpha(name, 'en-US', {ignore: ' '})) {
        res.status(400);
        throw new Error("Name cannot have numbers");
    }

    // Validate email
    if (!validator.isEmail(email)) {
        res.status(400);
        throw new Error("Invalid email format");
    }

    // Validate phone
    if (!validator.isNumeric(phone.toString())) {
        res.status(400);
        throw new Error("Phone numbers cannot have letters");
    }

    // Validate role
    if (!validator.isAlpha(role, 'en-US') || (role !== 'employee' && role !== 'admin')) {
        res.status(400);
        throw new Error("Role can only be 'employee' or 'admin'");
    }

   const employeeAdminAvailable=await employeeAdminModel.findOne({email});
   if(employeeAdminAvailable){
    res.status(400);
    throw new Error("users on mention email address already exist");
   }

   //has password
   const hashedPassword=await bcrypt.hash(password,10);
   //create new employee or admin

   const user = await employeeAdminModel.create({
    name,
    email,
    password:hashedPassword,
    address,
    phone,
    role
   });
   console.log("user create success",user)
   if(user){
    res.status(201).json({id:user.id,email:user.email,address:user.address,phone:user.phone,role:user.role})
   }else{
    res.status(400);
    throw new Error("ser data is snot valid")
   }
});

  
//@desc get user data
//@route get /api/users/email
//@access public
const getEmployeeAdmin=asyncHandler(async(req,res)=>{

const email=req.params.email; //get email from url parameters
console.log(`Searching for user with email: ${email}`);
const userData = await employeeAdminModel.findOne({ email });

console.log(`Found user: ${JSON.stringify(userData)}`);
if(!userData){
    res.status(404);
    throw new Error("Contact not Email");
} 
    res.status(200).json(userData);
});


//@desc update employee&admin data
//@route put api/employee&admin
//@access public 
const updateEmployeeAdmin=asyncHandler(async(req,res)=>{
const email = req. params.email;// get email from URL parameters
if(!email){
    res.status(404);
    throw new Error("Contact not found");
}
let updateData = req.body;
 // Check if password is being updated


    // Validate name
    if (!validator.isAlpha(updateData.name, 'en-US', {ignore: ' '})) {
        res.status(400);
        throw new Error("Name cannot have numbers");
    }

    // Validate email
    if (!validator.isEmail(updateData.email)) {
        res.status(400);
        throw new Error("Invalid email format");
    }

    // Validate phone
    if (!validator.isNumeric(updateData.phone.toString())) {
        res.status(400);
        throw new Error("Phone numbers cannot have letters");
    }

    // Validate role
    if (!validator.isAlpha(updateData.role, 'en-US') || (updateData.role !== 'employee' && updateData.role !== 'admin')) {
        res.status(400);
        throw new Error("Role can only be 'employee' or 'admin'");
    }
    
 if (updateData.password) {
    // Hash the new password
    updateData.password = await bcrypt.hash(updateData.password, 10);
}
 // Find the user and update their data
 const userupdated = await employeeAdminModel.findOneAndUpdate(
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
const deleteEmployeeAdmin=asyncHandler(async(req,res)=>{
    const email = req.params.email; // get email from URL parameters
    if(!email){
        res.status(404);
        throw new Error("Contact not found");
    }

    // Find the user and delete their data
    const userdeleted = await employeeAdminModel.findOneAndDelete({ email });

    if (!userdeleted) {
        res.status(404);
        throw new Error("Error deleting user");
    }

    res.status(200).json({ message: "User deleted successfully" });
});

module.exports={registeremployeeandadmin,getEmployeeAdmin,updateEmployeeAdmin,deleteEmployeeAdmin,employeeAdmin};

      