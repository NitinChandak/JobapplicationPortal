const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 4000;
const DB_NAME = "jobSearch"


// Routes
var LoginRoute = require('./routes/Login');
var RegisterRoute = require('./routes/Register');
var ApplicantRoute = require('./routes/user/Applicant');
var RecruiterRoute = require('./routes/user/Recruiter');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus:200
}));
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});


// Connection to databse
mongoose.connect('mongodb://127.0.0.1:27017/' + DB_NAME, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("Successfully connected to database.");
});

app.use("/login", LoginRoute);
app.use("/register", RegisterRoute);
app.use("/user/applicant", ApplicantRoute);
app.use("/user/recruiter", RecruiterRoute);

app.listen(PORT,() => {
    console.log("App running on port: " + PORT);
});