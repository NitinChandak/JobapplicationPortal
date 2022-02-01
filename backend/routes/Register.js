const router = require("express").Router();
const bcrypt = require('bcrypt');

const applicant = require('../models/Applicant');
const recruiter = require('../models/Recruiter');
const user = require('../models/Users');

router.post("/",async (req,res)=>{
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new user({
        email: req.body.email,
        password: hashedPassword,
        type: req.body.type
    })
    if(req.body.type === "recruiter"){
        const newRecruiter = new recruiter({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            contactNumber: req.body.RecruiterContact,
            bio: req.body.RecruiterBio 
        });
        newRecruiter.save();
        newUser.save()
            .then(User =>{  
                res.status(200).json(User);
            }).catch(err => {
                res.status(400).send(err);
            })
    }
    if(req.body.type === "applicant"){
        const newApplicant = new applicant({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            education: req.body.ApplicantEducation,
            skills: req.body.ApplicantSkill
        })
        newApplicant.save();
        newUser.save()
            .then(User =>{  
                res.status(200).json(User);
            }).catch(err => {
                res.status(400).send(err);
            })
    }
});

module.exports = router;