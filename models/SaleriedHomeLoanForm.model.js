const mongoose = require('mongoose');

const salariedHomeLoanSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
    },
    userdetails: {
        fname: String,
        mname: String,
        lname: String,
        email: String,
        phone: String,
        purpose_of_loan: String,
        fathers_name: String,
        mothers_name: String,
        marital_status: String,
        spouse_name: String,
        alternate_number: String,
        date_of_birth: String,
        pancard_number: String,
        permanent_address: String,
        residential_address: String,
        landmark: String,
        village: String,
        city: String,
        state: String,
        pincode: String,
    },
    userbankingdeatails: [
        {
            bank_name: String,
            account_type: String,
            branch_name: String,
            salary: String,
            // remark: String,
        }
    ],
    userloanpaymentdetails: [
        {
            // pan_no: String,
            // adhar_no: String,
            // spouse_name: String,
            loan_type: String,
            // spouse_dob: String,
            // dob: String,
            // voter_id: String,
            bank_nbfc: String,
            // bank_name: String,
            // account_type: String,
            emi: String,
            pandding: String,
        }
    ],
    coapplicantdetails: {
        co_fname: String,
        co_mname: String,
        co_lname: String,
        co_email: String,
        co_phone: String,
        co_purpose_of_loan: String,
        co_fathers_name: String,
        co_mothers_name: String,
        co_marital_status: String,
        co_spouse_name: String,
        co_alternate_number: String,
        co_date_of_birth: String,
        co_pancard_number: String,
        co_permanent_address: String,
        // co_residential_address: String,
        co_land_mark: String,
        co_village: String,
        co_city: String,
        co_state: String,
        co_pincode: String,
        co_relation: String,
    },
    coapplicantbankingdetails: [
        {
            co_bank_name: String,
            co_account_type: String,
            co_branch_name: String,
            // co_account_number: String,
            // co_remark: String,
        }
    ],
    coapplicantloanpaymentdetails: [
        {
            // co_pan_no: String,
            // co_adhar_no: String,
            // co_spouse_name: String,
            co_loan_type: String,
            // co_spouse_dob: String,
            // co_dob: String,
            // co_voter_id: String,
            co_bank_nbfc: String,
            // co_bank_name: String,
            // co_account_type: String,
            co_emi: String,
            co_pandding: String,
        }
    ],
    files: [
        {
            fileName: String,
            url: String,
            path: String,
            originalFileName: String,
            fieldName: String,
        }
    ],
    // propertyFiles: [
    //     {
    //         fileName: String,
    //         path: String,
    //         originalFileName: String,
    //         fieldName: String,
    //     }
    // ],
    approved:{
        type:Boolean,
        default:null,
    },
    connector_id:String

});

module.exports = mongoose.model('SalariedHomeLoan', salariedHomeLoanSchema);