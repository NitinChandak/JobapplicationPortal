const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    nameOfRecruiter:{
        type:String,
        required:true
    },
    emailOfRecruiter:{
        type:String,
        required:true
    },
    numberOfApplications:{
        type:Number,
        required:true
    },
    numberOfPositions:{
        type:Number,
        required:true
    },
    numberOfAccepted:{
        type: Number,
        default:0
    },
    dateOfPosting:{
        type:Date,
        required:true
    },
    deadlineDate:{
        type:Date,
        required:true
    },
    deadlineTime:{
        type:String,
        required:true
    },
    requiredSkills:[String],
    typeOfJob:{
        type:String,
        required:true
    },
    durationOfJob:{
        type:Number,
        required:true
    },
    salaryPerMonth:{
        type:Number,
        required:true
    },
    rating:{
        type:Number,
        default:-1
    },
    isActive:{
        type:Boolean,
        default:true
    },
    peopleWhoApplied:[{
        email:{
            type:String
        }, SOP:{
            type:String
        }, isRejected:{
            type:Boolean,
            default:false
        },DateOfApplication:{
            type:Date
        }
    }]
});

module.exports = mongoose.model('jobSchema',jobSchema);