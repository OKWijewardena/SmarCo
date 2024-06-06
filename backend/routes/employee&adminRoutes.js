const express =require ("express");
const {registeremployeeandadmin,employeeAdmin,getEmployeeAdmin,updateEmployeeAdmin,deleteEmployeeAdmin}=require("../controllers/employee&adminController");
const router = express.Router();


router.route("/").get(employeeAdmin);
router.post("/register",registeremployeeandadmin);
router.route("/:email").get(getEmployeeAdmin).put(updateEmployeeAdmin).delete(deleteEmployeeAdmin);
module.exports=router;