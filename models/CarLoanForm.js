const mongoose = require('mongoose');
// const path = require('path');

const carloanformSchema = new mongoose.Schema({
    userdetails : 
        {
            name : String,
            email : String,
            phone : String,
            address : String,
            business_address : String,
            vehicle_type:String,
        }
    ,
    userbankingdetails : [
        {
            bank_name : String,
            account_type : String,
            account_number : String,
            remark : String
        }
    ],
    userloanpaymentdetails : [
        {
            bank_nbfc : String,
            loan_type : String,
            emi : String,
            pandding : String,
            pan_no : String,
            adhar_no : String,
            dob : String,
            voter_id : String,
            spouse_name : String,
            spouse_dob : String
        }
    ],
    coapplicantdetails: 
        {
            co_name: String,
            co_email: String,
            co_phone: String,
            co_address: String,
            co_business_address: String
        }
    ,
    coapplicantbankingdetails: [
        {
            co_bank_name: String,
            co_account_type: String,
            co_account_number: String,
            co_remark: String,
        }
    ],
    coapplicantloanpaymentdetails: [
        {
            co_bank_nbfc: String,
            co_loan_type: String,
            co_emi: String,
            co_pandding: String,
            co_pan_no: String,
            co_adhar_no: String,
            co_dob: String,
            co_voter_id: String,
            co_spouse_name: String,
            co_spouse_dob: String
        }
    ],
    files: [
        {
            fileName: String,
            url:String,
            path: String,
            originalFileName: String,
            fieldName: String
        }
    ],
    approved: {
        type: Boolean,
        default: null
    },
    connector_id:{
        type:String,
    },
},{timestamps:true});

module.exports = mongoose.model('CarLoanForm', carloanformSchema);