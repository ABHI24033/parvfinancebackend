const mongoose = require('mongoose');

const businessHomeLoanFormSchema = new mongoose.Schema({
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
    userbankingdetails: [
        {
            bank_name: String,
            account_type: String,
            branch_name: String,
            salary: String,
            // account_number: String,
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
    // coapplicantdetails: [
    //     {
    //         co_name: String,
    //         co_email: String,
    //         co_phone: String,
    //         co_monthly_salary : String,
    //         co_yearly_income : String,
    //         co_address: String,
    //         co_business_address: String
    //     }
    // ],
    coapplicantdetails:
    {
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
    }
    ,
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
    // guarantordetails : [
    //     {
    //         guar_name : String,
    //         guar_email : String,
    //         guar_phone : String,
    //         guar_monthly_salary : String,
    //         guar_yearly_income : String,
    //         guar_address : String,
    //         guar_business_address : String
    //     }
    // ],
    guarantordetails: [
        {
            guar_fname: String,
            guar_mname: String,
            guar_lname: String,
            guar_email: String,
            guar_phone: String,
            guar_purpose_of_loan: String,
            guar_fathers_name: String,
            guar_mothers_name: String,
            guar_marital_status: String,
            guar_spouse_name: String,
            guar_alternate_number: String,
            guar_date_of_birth: String,
            guar_pancard_number: String,
            guar_permanent_address: String,
            // guar_residential_address: String,
            guar_land_mark: String,
            guar_village: String,
            guar_city: String,
            guar_state: String,
            guar_pincode: String,
            guar_relation: String,
        }
    ],
    guarantorbankdetails: [
        {
            guar_bank_name: String,
            guar_account_type: String,
            guar_branch_name: String,
            // guar_account_number : String,
            // guar_remark : String
        }
    ],
    guarantorloandetails: [
        {
            guar_bank_nbfc: String,
            guar_loan_type: String,
            guar_emi: String,
            // guar_start_form : String,
            guar_pandding: String,
            // guar_aaplication_pan_no: String,
            // guar_adhar_no: String,
            // guar_dob: String,
            // guar_voter_id: String,
            // guar_spouse_name: String,
            // guar_spouse_dob: String
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
    connector_id: {
        type:String,
    },
});

module.exports = mongoose.model('BusinessHomeLoanForm', businessHomeLoanFormSchema);