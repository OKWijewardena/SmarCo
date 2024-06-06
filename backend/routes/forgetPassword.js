const express =require ("express");
const {forgot_password} = require("../controllers/forgotPasswordController");
const router = express.Router();


router.post("/forgot-password",forgot_password);


 module.exports=router;
