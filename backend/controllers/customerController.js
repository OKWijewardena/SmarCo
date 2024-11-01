const asyncHandler = require("express-async-handler");
const customerModel =require("../models/customerModel");
const bcrypt=require("bcryptjs");
const validator = require("validator");



//@desc  get customers
//@route get /api/ customers / 
//@access public
const getusers=asyncHandler(async(req, res) => {
    const customer=await customerModel.find();
        res.status(200).json(customer);
      });


//@desc register a customer
//@route post /api/ customer / register
//@access public

const registerCustomer = asyncHandler(async (req, res) => {
  const { name, email, password, civil_id, nationality, mobile, whatsapp_no, telephone_no, address, paci_number } = req.body;

  // Check for all required fields
  if (!name || !email || !password || !civil_id || !nationality || !mobile || !whatsapp_no || !telephone_no || !address || !paci_number) {
    return res.status(400).json({ message: "All fields are mandatory" });
  }

  // Validate name
  if (!validator.isAlpha(name, 'en-US', { ignore: ' ' })) {
    return res.status(400).json({ message: "Name cannot have numbers" });
  }

  // Validate email
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Validate mobile, whatsapp_no, and telephone_no
  if (!validator.isNumeric(mobile.toString()) || !validator.isNumeric(whatsapp_no.toString()) || !validator.isNumeric(telephone_no.toString())) {
    return res.status(400).json({ message: "Phone numbers cannot have letters" });
  }

  // Check if customer already exists
  const customerAvailable = await customerModel.findOne({ email });
  if (customerAvailable) {
    return res.status(400).json({ message: "User with this email address already exists" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new customer
  try {
    const customer = await customerModel.create({
      name,
      email,
      password: hashedPassword,
      civil_id,
      nationality,
      address,
      paci_number,
      mobile,
      whatsapp_no,
      telephone_no,
    });

    if (customer) {
      return res.status(201).json({ 
        id: customer.id, 
        email: customer.email, 
        civil_id: customer.civil_id, 
        nationality: customer.nationality, 
        address: customer.address, 
        mobile: customer.mobile, 
        whatsapp_no: customer.whatsapp_no, 
        telephone_no: customer.telephone_no, 
        paci_number: customer.paci_number 
      });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

  
//@desc get customer data
//@route get /api/customer/email
//@access public
const getCustomer=asyncHandler(async(req,res)=>{

const email=req.params.email; //get email from url parameters
console.log(`Searching for user with email: ${email}`);
const customerData = await customerModel.findOne({ email });


console.log(`Found user: ${JSON.stringify(customerData)}`);
if(!customerData){
    res.status(404);
    throw new Error("Customer email not found");
} 
    res.status(200).json(customerData);
});

//@desc get customer data
//@route get /api/customer/civil_id
//@access public
const getCivil_idCustomer =asyncHandler(async(req,res)=>{

    const civil_id=req.params.civil_id; //get email from url parameters
    console.log(`Searching for user with email: ${civil_id}`);
    const customerData = await customerModel.findOne({ civil_id });
    // res.json(customerData);
    
    
    // console.log(`Found user: ${JSON.stringify(customerData)}`);
    if(!customerData){
        res.status(404);
        throw new Error("Customer email not found");
    } 
        res.json(customerData);
    });
    


//@desc update customer data
//@route put /api/customer/email
//@access private 
const updateCustomer=asyncHandler(async(req,res)=>{
const email = req. params.email;// get email from URL parameters
if(!email){
    res.status(404);
    throw new Error("customer not found on mention email");
}
let updateData = req.body;

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

// Validate mobile, whatsapp_no, and telephone_no
if (!validator.isNumeric(updateData.mobile.toString()) || !validator.isNumeric(updateData.whatsapp_no.toString()) || !validator.isNumeric(updateData.telephone_no.toString())) {
    res.status(400);
    throw new Error("Phone numbers cannot have letters");
}
 // Check if password is being updated
 if (updateData.password) {
    // Hash the new password
    updateData.password = await bcrypt.hash(updateData.password, 10);
}
 // Find the customer and update their data
 const customerupdated = await customerModel.findOneAndUpdate(
    { email }, // find a document with this filter
    updateData, // document to insert when nothing was found
    { new: true, runValidators: true }, // options
);

if (!customerupdated) {
    res.status(404);
    throw new Error("Error updating user");
}

res.status(200).json(customerupdated); // return the updated user data
});

//@desc delete customer data
//@route delete /api/customer/email
//@access private
const deleteCustomer=asyncHandler(async(req,res)=>{
    const email = req.params.email; // get email from URL parameters
    if(!email){
        res.status(404);
        throw new Error("Contact not found");
    }

    // Find the user and delete their data
    const customerdeleted = await customerModel.findOneAndDelete({ email });

    if (!customerdeleted) {
        res.status(404);
        throw new Error("Error deleting user");
    }

    res.status(200).json({ message: "User deleted successfully" });
});

const getOneCustomer = (req, res) => {
  customerModel.findOne({ civilID: req.params.civilID })
    .then((customerRecord) => {
      res.json(customerRecord);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Error retrieving selling record" });
    });
};

const searchCustomers = asyncHandler(async (req, res) => {
  const searchTerm = req.params.searchTerm; // Get the search term from URL parameters
  console.log("Searching for user with search term:", searchTerm); // Log the extracted search term

  // Check if searchTerm is a number
  const isNumeric = !isNaN(searchTerm);

  // Search customers based on civil_id, name, or mobile (if numeric)
  const queryConditions = [
      { civil_id: searchTerm }, // Match exact civil ID
      { name: { $regex: searchTerm, $options: "i" } } // Case-insensitive partial match for name
  ];

  if (isNumeric) {
      queryConditions.push({ mobile: searchTerm }); // Match exact mobile number if numeric
  }

  const customerRecords = await customerModel.find({
      $or: queryConditions
  });

  console.log("Found users:", customerRecords); // Log found records
  res.json(customerRecords); // Return matching customer records as JSON
});



module.exports={registerCustomer,getCustomer,updateCustomer,deleteCustomer,getusers,getCivil_idCustomer,getOneCustomer,searchCustomers};

      