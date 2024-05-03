const mongoose = require('mongoose');

const homeloanformSchema = new mongoose.Schema({
    userID: {
        type: String,
        // required: true,
    },
    employment_type: {
        type: String,
        required: true,
    }, //salaried/self employeed
    personalloanform_businessloanform_id: {
        type: String,
        required: true
    },//id
    files: [
        {
            fileName: String,
            url: String,
            path: String,
            originalFileName: String,
            fieldName: String
        }
    ],
    approved:{
        type:Boolean,
        default:null
    },
    connector_id:String
});

module.exports = mongoose.model('HomeLoanForm', homeloanformSchema);