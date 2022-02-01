const localStrategy = require('passport-local').Strategy;
const applicant = require('../models/Applicant');
const recruiter = require('../models/Recruiter');
const userSchema = require('../models/Users');
const bcrypt = require('bcrypt');

function initialize(passport){
    const authenticateUser = async (req, email, password, done) =>{
        User = await userSchema.findOne({email});
        if(User === null || User.type !== req.body.type){
            return done(null, false,req.flash('loginMessage','No user found'));
        }
        else{
            try{
                if( await bcrypt.compare(password, User.password)){
                    done(null, User, req.flash('loginMessage', 'Logged In successfully'));
                }else{
                    return done(null, false, req.flash('loginMessage', 'Password incorrect'));
                }
            }catch(err){
                return done(err); 
            }
        }
    };
    const getUserById = async (id)=>{
        return userSchema.findOne({_id: id});
    };
    passport.use(new localStrategy({ usernameField: 'email', passReqToCallback:true}, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) =>{
            const user = await getUserById(id);
            return done(null, user);
    });
}

module.exports = initialize;