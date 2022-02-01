const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
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
    education: [{
        institutionName:{
            type: String,
            required:true
        },
        startYear: {
            type: Number,
            required: true
        },
        endYear:{
            type: Number
        }
    }],
    skills: [ String ],
    rating: {
        type: Number,
        default: -1
    },
    appliedJobs: [{
        jobId:{
            type:mongoose.Types.ObjectId
        },isRejected:{
            type:Boolean,
            default:false
        }
    }],
    isAccepted:{
        type:Boolean,
        default:false
    },
    AcceptedJobId:{
        type:mongoose.Types.ObjectId
    },
    AcceptedDate:{
        type:Date
    }
});

module.exports = mongoose.model('applicantSchema', applicantSchema);