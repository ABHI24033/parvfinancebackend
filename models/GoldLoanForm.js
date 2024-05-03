const mongoose = require('mongoose');

const goldloanformSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    application_no: String,
    dob: String,
    password: String,
    adhar_no: String,
    voter_id: String,
    address: String,
    business_address: String,
    pan_no: String,
    spouse_name: String,
    spouse_dob: String,
    approve:{
        type:Boolean,
        default:null,
    },
    connector_id:String,
});

module.exports = mongoose.model('GoldLoanForm', goldloanformSchema);