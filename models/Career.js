const mongoose = require('mongoose');
const careersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },

    message: {
        type: String,
        required: true,
    },
});
module.exports = mongoose.model('Careers', careersSchema);