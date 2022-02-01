const router = require('express').Router();
const { connections } = require('mongoose');
const passport = require('passport');

const RecruiterSchema = require('../../models/Recruiter');
const Users = require('../../models/Users');
const jobSchema = require('../../models/Jobs');
const ApplicantSchema = require('../../models/Applicant');

router.get("/",async(req,res)=>{
    const email = req.query.email;
    const user = await RecruiterSchema.findOne({email});
    res.send(user);
})

router.put("/edit",async(req,res)=>{
    const conditions = {email: req.body.email};
    const newRecruiter = {
        bio: req.body.bio,
        contactNumber: req.body.contactNumber,
        email: req.body.email,
        name: req.body.name
    }
    RecruiterSchema.updateOne(conditions, newRecruiter, (err,docs)=>{
        if(err) console.log(err);
        else{ 
            console.log(docs);
            res.send("done");
        }
    })
});

router.post("/createJobs",async(req,res)=>{
    const newJob = new jobSchema({
        title: req.body.title,
        nameOfRecruiter: req.body.nameOfRecruiter,
        emailOfRecruiter: req.body.emailOfRecruiter,
        numberOfApplications: req.body.numberOfApplications,
        numberOfPositions: req.body.numberOfPositions,
        dateOfPosting: req.body.dateOfPosting,
        deadlineDate: req.body.deadlineDate,
        deadlineTime: req.body.deadlineTime,
        requiredSkills: req.body.requiredSkills,
        typeOfJob: req.body.typeOfJob,
        durationOfJob: req.body.durationOfJob,
        salaryPerMonth: req.body.salaryPerMonth
    });
    newJob.save(newJob)
        .then(job=>res.status(200).json(job))
        .catch(err=>res.send(err));     
});

router.get("/createdJobs",async(req,res)=>{
    const email = req.query.email;
    const jobs = await jobSchema.find({emailOfRecruiter:email,isActive:true});
    res.send(jobs);
})

router.get("/jobDetails",async(req,res)=>{
    const Id = req.query.id;
    let job = await jobSchema.find({_id: Id,isActive:true});
    res.send(job);
})

router.put("/jobDetails",async(req,res)=>{
    const condition = {
        _id: req.body._id
    };

    const updatedJob = {
        numberOfApplications: req.body.numberOfApplications,
        numberOfPositions: req.body.numberOfPositions,
        deadlineDate: req.body.deadlineDate,
        deadlineTime: req.body.deadlineTime
    }

    jobSchema.updateOne(condition,updatedJob,(err,docs)=>{
        if(err)console.log(err);
        else{ 
            res.send("done");
            console.log(docs);
        }
    })

})

router.get("/viewJobApplicants",async(req,res)=>{
    const id = req.query.id;
    const job = await jobSchema.find({_id: id,isActive:true});
    res.send(job);
});

router.get("/getApplicant",async(req,res)=>{
    const queryemail=req.query.email;
    const appl = await ApplicantSchema.find({email:queryemail});
    res.send(appl);
});

router.put("/reject",async(req,res)=>{
    const jobId = req.body.jobId;
    const email = req.body.email;
    jobSchema.updateOne({_id: jobId,"peopleWhoApplied.email":email},{$set:{
            "peopleWhoApplied.$.isRejected": true
        }},(err,docs)=>{
            if(err) console.log(err);
            else console.log(docs);
    })
    ApplicantSchema.updateOne({email: email, "appliedJobs.jobId":jobId},{
            $set:{"appliedJobs.$.isRejected":true}
        },(err,docs)=>{
            if(err) console.log(err);
            else{
                console.log(docs);
                res.send("done");
            }
    });
})

router.put("/accept",async(req,res)=>{
    const email = req.body.email;
    const jobId = req.body.jobId;
    const emailOfRecruiter = req.body.emailOfRecruiter;
    ApplicantSchema.updateOne({email: email},{
        isAccepted:true,
        AcceptedJobId: jobId,
        AcceptedDate: new Date(),
        },(err,docs)=>{
            if(err)console.log(err);
            else console.log(docs);
    });
    ApplicantSchema.updateOne({email:email},{
        $set:{"appliedJobs.$[].isRejected":true}},(err,docs)=>{
            if(err)console.log(err);
            else console.log(docs);
    });
    ApplicantSchema.updateOne({email: email, "appliedJobs.jobId":jobId},{
        $set:{"appliedJobs.$.isRejected":false}},(err,docs)=>{
        if(err)console.log(err);
        else console.log(docs);
    });
    jobSchema.updateMany({"peopleWhoApplied.email":email},{
        $set:{"peopleWhoApplied.$.isRejected":true}},(err,docs)=>{
        if(err)console.log(err);
        else{ 
            console.log(docs);
        }
    });
    jobSchema.updateOne({_id: jobId,"peopleWhoApplied.email":email},{
        $inc:{numberOfAccepted:1},
        $set:{"peopleWhoApplied.$.isRejected":false}},(err,docs)=>{
            if(err)console.log(err);
            else{ 
                console.log(docs);
            }
    });
    RecruiterSchema.updateOne({email:emailOfRecruiter},{$push:{acceptedApplicants:email}},(err,docs)=>{
        if(err)console.log(err);
        else{
            res.send("done"); 
            console.log(docs);
        }
    });
})

router.get("/acceptedApplicant",async(req,res)=>{
    const email = req.query.email;
    const user = await ApplicantSchema.find({email: email});
    if(user){
        const job = await jobSchema.find({_id: user[0].AcceptedJobId,isActive:true});
        if(job)
            res.send({
                name: user[0].name,
                dateOfJoining: user[0].AcceptedDate,
                jobType: job[0].typeOfJob,
                jobTitle: job[0].title,
                rating: user[0].rating,
                email: user[0].email
            });
    }
})

router.put("/rateApplicant",async(req,res)=>{
    const condition = {email: req.body.email};
    ApplicantSchema.updateOne(condition,{rating: req.body.rating},(err,docs)=>{
        if(err)console.log(err);
        else{
            console.log(docs);
            res.send("done");
        }
    });
})

router.put("/deleteJob",async(req,res)=>{
    const id = req.body.jobId;
    jobSchema.updateOne({_id: id},{isActive:false},(err,docs)=>{
        if(err)console.log(err);
        else{
            console.log(docs);
            res.send("done");
        }
    })
})

module.exports = router;