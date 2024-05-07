const mongoose=require("mongoose");

const employeeDataSchema=new mongoose.Schema({
    // data:[
    //     {
    //         name: String,
    //         email: String,
    //         phone: String,
    //         loanType: String,
    //     }
    // ],
    name: String,
    email: String,
    phone: String,
    loanType: String,
    employeeId: String,
    employee_id:String,
},{timestamps:true});

module.exports=mongoose.model("Employeedata",employeeDataSchema);