const express =require ("express");
const { registerUser, loginUser,getregisterduser, updateregisterduser, deleteregisterduser } = require("../controllers/userController");
const router = express.Router();




router.post("/register",registerUser);
router.route("/:email").get(getregisterduser).put(updateregisterduser).delete(deleteregisterduser);
router.post("/login",loginUser);


    
 module.exports=router;

 