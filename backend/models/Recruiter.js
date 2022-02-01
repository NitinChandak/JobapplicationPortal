const mongoose = require('mongoose');

const recruiterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    contactNumber:{
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    acceptedApplicants:[String]
});

module.exports = mongoose.model('recruiterSchema',recruiterSchema);