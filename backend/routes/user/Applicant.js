const router = require('express').Router();

const ApplicantSchema = require('../../models/Applicant');
const Jobs = require('../../models/Jobs');
const Users = require('../../models/Users');



router.get("/",async(req,res)=>{
    const email = req.query.email;
    const user =await ApplicantSchema.findOne({email});
    res.send(user);
})

router.put("/edit",async(req,res)=>{
    var conditions = {email: req.body.email};
    const newApplicant = {
        appliedJobs: req.body.appliedJobs,
        education: req.body.education,
        email:req.body.email,
        name: req.body.name,
        skills: req.body.skills
    }
    ApplicantSchema.updateOne(conditions,newApplicant,(err,applicant)=>{
        if(err)
            console.log(err);
        else{
            console.log(applicant);
            res.send("done");
        }
    })
})

router.get("/jobListings",async(req,res)=>{
    let date = new Date().toISOString();
    let todayDate = date.substring(0,10);
    let timenow = date.substring(11,16);
    if(req.query.searchString === ""){
        const jobs = await Jobs.find({isActive: true});
        res.send(jobs.filter(job=>job.deadlineDate.toISOString().substring(0,10) > todayDate || (job.deadlineDate.toISOString().substring(0,10) === todayDate && job.deadlineTime > timenow)));
    }
    else{
        const regexString = new RegExp(req.query.searchString.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),'gi');
        const jobs = await Jobs.find({title: regexString,isActive:true});
        res.send(jobs.filter(job=>job.deadlineDate.toISOString().substring(0,10) > todayDate || (job.deadlineDate.toISOString().substring(0,10) === todayDate && job.deadlineTime > timenow)));
    }

});

router.put("/apply",async(req,res)=>{
    const conditionsForApplicant = {email: req.body.email};
    const conditionForJobs = {_id: req.body.jobId};
    const date = new Date().toISOString();
    //console.log(req.body.email,req.body.SOP);
    ApplicantSchema.updateOne(conditionsForApplicant,{$push:{appliedJobs:{jobId: req.body.jobId,isRejected:false}}},(err,docs)=>{
        if(err)console.log(err);
        else console.log(docs);
    })
    Jobs.updateOne(conditionForJobs,{$push:{peopleWhoApplied:{email:req.body.email,SOP:req.body.SOP,DateOfApplication:date}}},
        (err,applicant)=>{
        if(err)
            console.log(err);
        else{
            console.log(applicant);
            res.send("done");
        }
    })
        
})

router.get("/getJobs",async(req,res)=>{
    const jobId = req.query.jobId;
    const job = await Jobs.find({_id: jobId,isActive:true});
    if(job !==[]){
        res.send({
            nameOfRecruiter: job[0].nameOfRecruiter,
            emailOfRecruiter: job[0].emailOfRecruiter,
            salary: job[0].salaryPerMonth,
            title: job[0].title,
            rating: job[0].rating
        });
    }
});

router.put("/rateJob",async(req,res)=>{
    const condition = {_id: req.body.jobId};
    Jobs.updateOne(condition,{rating:req.body.rating},(err,docs)=>{
        if(err)console.log(err);
        else{
            console.log(docs);
            res.send("done");
        }
    });
});

module.exports = router;
