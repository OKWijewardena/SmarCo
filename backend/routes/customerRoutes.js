const express =require ("express");
const {getusers,registerCustomer,getCustomer,updateCustomer,deleteCustomer,getCivil_idCustomer,getOneCustomer,searchCustomers}=require("../controllers/customerController");
const router = express.Router();


router.get('/', getusers);
router.post("/register",registerCustomer);
router.route("/:email").get(getCustomer).put(updateCustomer).delete(deleteCustomer);
router.route("/civil/:civil_id").get(getCivil_idCustomer);
router.route("/getonecustomer/:civil_id").get(getOneCustomer);
router.route("/search/:searchTerm").get(searchCustomers); // Updated to use URL parameter
module.exports=router;