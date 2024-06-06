const asyncHandler = require("express-async-handler");
const Invoice = require("../models/invoicemodel");
const puppeteer = require('puppeteer');
const cors = require("cors"); 


//@desc Get all login
//@route Get /api/ login
//@access public

const getinvoices=asyncHandler(async(req, res) => {
const invoices=await Invoice.find();
    res.status(200).json(invoices);
  });


//@desc create invoice
//@route post /api/ add
//@access public
const addInvoice = asyncHandler(async(req, res) => {
    console.log("the request body is", req.body);
    const { name, id_card_no, phone, description, qty, unit_price_k_D, total_price_k_D} = req.body;
    if (!name || !id_card_no || !phone || !description || !qty || !unit_price_k_D ||!total_price_k_D) {
        res.status(400);
        throw new Error("all fields are mandatory !");
    }
    const invoice = await Invoice.create({ // Use the imported model
        name,
        id_card_no,
        phone,
        description,
        qty,
        unit_price_k_D,
        total_price_k_D
    })
  
    res.status(201).json(invoice);
  });
  


//@desc Get new invoice
//@route put /api/ invoice /:id 
//@access public
const getInvoice = asyncHandler(async(req, res) => {
  const invoiceData = await Invoice.findById(req.params.id);
  if(!invoiceData){
    res.status(404); 
    throw new Error("invoice not found");
  } 
  res.status(200).json(invoiceData);
});



//@desc update login
//@route put /api/ login /:id 
//@access public
const updateInvoice=asyncHandler(async(req, res) => {
  const  invoiceupdate=await Invoice.findById(req.params.id);
  if(!invoiceupdate){
    res.status(404);
    throw new Error("invoice not found");
  }
  const  invoiceupdated=await Invoice.findByIdAndUpdate
  (req.params.id,
  req.body,{
  new:true,
  });

    res.status(200).json(invoiceupdated);
  });


//@desc delete invoice
//@route delete /api/ invoice /:id 
//@access public
const deleteInvoice = asyncHandler(async(req, res) => {
  const deleteDelete = await Invoice.findById(req.params.id);
  if(!deleteDelete){
    res.status(404);
    throw new Error("Contact not found");
  }
  await product.deleteOne({ _id: req.params.id });
  res.status(201).json(product);
});






module.exports={getinvoices,addInvoice ,getInvoice,updateInvoice,deleteInvoice};