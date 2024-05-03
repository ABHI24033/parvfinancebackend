const mongoose = require('mongoose');

const professionalformSchema = new mongoose.Schema({
    userbankingdeatails: [
        {
            bank_name: String,
            account_type: String,
            account_number: String,
            remark: String,
        }
    ],
    userloanpaymentdetails: [
        {
            pan_no: String,
            adhar_no: String,
            spouse_name: String,
            loan_type: String,
            spouse_dob: String,
            dob: String,
            voter_id: String,
            bank_nbfc: String,
            emi: String,
            pandding: String,
        }
    ],
    coapplicantbankingdetails: [
        {
            dividendArr2co_bank_name: String,
            dividendArr2co_account_type: String,
            dividendArr2co_account_number: String,
            dividendArr2co_remark: String,
        }
    ],
    coapplicantloanpaymentdetails: [
        {
            dividendArr3co_pan_no: String,
            dividendArr3co_adhar_no: String,
            dividendArr3co_spouse_name: String,
            dividendArr3co_loan_type: String,
            dividendArr3co_spouse_dob: String,
            dividendArr3co_dob: String,
            dividendArr3co_voter_id: String,
            dividendArr3co_bank_nbfc: String,
            dividendArr3co_emi: String,
            dividendArr3co_pandding: String,
        }
    ],
    userdetails: {
        name: String,
        email: String,
        phone: String,
        degree: String,
        address: String,
        business_address: String,
    },
    coapplicantdetails: {
        co_name: String,
        co_email: String,
        co_phone: String,
        co_address: String,
        co_business_address: String,
    },
    files: [
        {
            fileName: String,
            url: String,
            path: String,
            originalFileName: String,
            fieldName: String,
        }
    ],
    loanType: String,
    approved:{
        type:Boolean,
        default:null,
    },
    connector_id:String

});

module.exports = mongoose.model('ProfessionalLoanForm', professionalformSchema);