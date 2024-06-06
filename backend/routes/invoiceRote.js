const express =require ("express");
const {getinvoices,addInvoice,getInvoice,updateInvoice,deleteInvoice}=require("../controllers/invoiceController");
const router = express.Router();


router.route("/").get(getinvoices) 
router.post("/add",addInvoice);
router.route("/:id").get(getInvoice).put(updateInvoice).delete(deleteInvoice);



module.exports=router;  