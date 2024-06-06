const { json } = require("body-parser");
const { constants } = require("../routes/constants");
const errorHandler=(err,req,res,next)=>{
const statusCode=res.statusCode?res.statusCode:500;
switch(statusCode){
case constants.VALIDATION_ERROR:
res:json({
    title:"its validation error",
    message:err.message,
    stackTrace:err.stack
});
break;
case constants.NOT_FOUND:
res.json({
    title:"its PAGE NOT FOUND",
    message:err.message,
    stackTrace:err.stack
});
case constants.UNAUTHORIZED:
res.json({
    title:"its UNAUTHORIZED",
    message:err.message,
    stackTrace:err.stack
});
case constants.FORBIDDEN:
res.json({
    title:"its FORBIDDEN",
    message:err.message,
    stackTrace:err.stack
});
case constants.SERVER_ERROR:
res.json({
    title:"its SERVER_ERROR",
    message:err.message,
    stackTrace:err.stack
});
default:
    console.log("NO ERROR ALL GOOD !");
break;

}


};
module.exports=errorHandler;