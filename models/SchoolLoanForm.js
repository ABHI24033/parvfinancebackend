const mongoose = require('mongoose');

const schooloanformSchema = new mongoose.Schema({
    trustees: [
        {
            name_trust: String,
            dt_email: String,
            designation: String,
            contact: String,
        }
    ],
    institutes: [
        {
            name_institue: String,
            course_faculty: String,
            approved_by: String,
            seats: String,
            per_year_fess: String,
        }
    ],
    students: [
        {
            name_of_inst: String,
            course_faculty_one: String,
            approved_bye_one: String,
            seats_one: String,
            per_year_fee_one: String,
        }
    ],
    studenthotel: [
        {
            institutes_host: String,
            course_faculty_two: String,
            approved_two: String,
            seats_two: String,
            per_year_fees_hostel: String,
        }
    ],
    collegeSchooldetails: {
        name: String,
        email: String,
        phone: String,
        conract_person: String,
        website_link: String,
        sclclg_managed: String,
        business_address: String,
    },
    annualfeescollection: {
        school_clg: String,
        transport: String,
        hostel: String,
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
    approved:{
        type:Boolean,
        default:null,
    },
    connector_id:String


});

module.exports = mongoose.model('SchoolLoanForm', schooloanformSchema);