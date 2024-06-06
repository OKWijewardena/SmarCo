const express =require ("express");
const {getusers,registerCustomer,getCustomer,updateCustomer,deleteCustomer,getCivil_idCustomer}=require("../controllers/customerController");
const router = express.Router();


router.get('/', getusers);
router.post("/register",registerCustomer);
router.route("/:email").get(getCustomer).put(updateCustomer).delete(deleteCustomer);
router.route("/civil/:civil_id").get(getCivil_idCustomer);
module.exports=router;