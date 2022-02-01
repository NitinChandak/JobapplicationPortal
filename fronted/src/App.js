import React from 'react';
import { BrowserRouter as Router , Route } from 'react-router-dom';
import { NavigationBar } from './components/Common/NavigationBar';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Recruiter from './components/user/recruiter/recruiter';
import Applicant from './components/user/applicant/applicant';
import EditRec from './components/user/recruiter/Edit';
import EditApp from './components/user/applicant/Edit';
import createjobs from './components/user/recruiter/createjobs';
import CreatedJobs from './components/user/recruiter/CreatedJobs';
import AcceptedJobApplicants from './components/user/recruiter/AcceptedJobApplicants';
import jobListings from './components/user/applicant/jobListings';
import MyApplications from './components/user/applicant/MyApplications';
import applyForJobs from './components/user/applicant/applyForJobs';
import EditJobDetails from './components/user/recruiter/EditJobDetails';
import ViewJobApplicants from './components/user/recruiter/ViewJobApplicants';

function App() {
  return (
    <Router>
      <div className="App">

        {/* All the necessary routes for Login and register pages */}
        <Route exact path="/" component={NavigationBar}/>
        <Route exact path="/login" component={ Login } />
        <Route exact path="/register" component={ Register }/>
        
        {/* All the necessary routes for recruiter */}
        <Route path="/user/recruiter" component={ Recruiter }/>
        <Route exact path="/user/recruiter/edit" component={ EditRec }/>
        <Route exact path="/user/recruiter/createJobs" component={ createjobs }/>
        <Route exact path="/user/recruiter/createdJobs" component={ CreatedJobs }/>
        <Route exact path="/user/recruiter/jobApplicantsAccepted" component={ AcceptedJobApplicants }/>
        <Route exact path="/user/recruiter/editJobDetails" component={EditJobDetails}/>
        <Route exact path="/user/recruiter/viewJobApplicants" component={ViewJobApplicants}/>

        {/* All the necessary routes for user */}
        <Route path="/user/applicant" component={ Applicant }/>
        <Route exact path="/user/applicant/edit" component={ EditApp }/>
        <Route exact path="/user/applicant/jobListings" component={ jobListings}/>
        <Route exact path="/user/applicant/myApplications" component={ MyApplications }/>
        <Route exact path="/user/applicant/apply" component={ applyForJobs }/>

      </div>
    </Router>
  );
}

export default App;
