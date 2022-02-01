const router = require("express").Router();
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const applicant = require('../models/Applicant');
const recruiter = require('../models/Recruiter');

const initializePassport = require('./passport-config');

router.use(flash());
router.use(session({
    secret:"secret",
    resave: true,
    saveUninitialized: true,
    cookie:{ maxAge: 3600000}
}));
router.use(cookieParser("secret"));
router.use(passport.initialize());
router.use(passport.session());

initializePassport(passport);

const checkAuthenticated = (req,res,next)=>{
    if(req.isAuthenticated())
        return next();
    else
        res.send({
            isLoggedIn: false,
            user: null
        });
}

router.get("/",checkAuthenticated,(req,res)=>{
    res.send({
        isLoggedIn: true,
        user: req.user
    });
})

router.get("/logout",checkAuthenticated,(req,res)=>{
    //console.log(req.user);
    req.session.destroy();
    req.logout();
    req.session = null;
    console.log("looged out");
    //console.log(req.user);
    res.send();
})

router.post("/",(req,res, next) => {
    passport.authenticate('local',{failureFlash: true},(error, user, info)=>{
        if(error){ 
            console.log(error);
            return res.send(error);
        }
        if(!user){
            return res.send(req.flash('loginMessage')[0]);  
        }
        else{
            req.logIn(user , err=>{
                if(err) throw err;
                res.send(req.flash('loginMessage')[0]);
                //console.log(req.user);
            })
        }
    })(req, res, next);
});

module.exports = router;