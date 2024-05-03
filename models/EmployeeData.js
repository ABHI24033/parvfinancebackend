const mongoose=require("mongoose");

const employeeDataSchema=new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    loanType: String,
    employeeId: String,
},{timestamps:true});

module.exports=mongoose.model("Employeedata",employeeDataSchema);