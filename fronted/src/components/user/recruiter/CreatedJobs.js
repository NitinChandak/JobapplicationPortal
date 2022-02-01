import React, { Component } from 'react'
import axios from 'axios';

export class CreatedJobs extends Component {
    constructor(props){
        super(props);
        this.state={
            jobsCreated:[]
        };
    }
    
    componentDidMount(){
        axios.get("http://localhost:4000/login",{withCredentials:true})
        .then(res=>{
            axios.get("http://localhost:4000/user/recruiter/createdJobs",{params:{email:res.data.user.email},withCredentials:true})
            .then(res=>{
                this.setState({jobsCreated:res.data})
            })
            .catch(err=>console.log(err));
        })
        .catch(err=>console.log(err));
    }

    viewApplicants(jobId){
        window.location.href = "/user/recruiter/viewJobApplicants?jobId="+jobId;
    }

    editJobs(jobId){
        window.location.href = "/user/recruiter/editJobDetails?jobId="+jobId;
    }

    deleteJob(jobId){
        let toDelete = window.confirm("Are you sure you want to delete the job?");
        if(toDelete){
            axios.put("http://localhost:4000/user/recruiter/deleteJob",{jobId: jobId},{withCredentials:true})
                .then(res=>window.location.reload())
                .catch(err=>console.log(err));
        }
    }

    inputStyle = {
        fontFamily: 'OpenSans-Regular',
        fontSize: '20px',
        width: '100%',
        padding: '10px',
        margin: '8px',
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };
    divStyle = {
        background: '#333',
        padding: '10px',
        align: 'center',
        color: "#fff",
        position:'relative'
    };

    render() {
        return (
            <div>
                <h1>Created Jobs</h1>
                {
                    this.state.jobsCreated !==[] && this.state.jobsCreated.map((job,index)=>{
                        return(
                            <div style={this.divStyle} key={index}>
                                <h3 style={{...this.inputStyle,fontSize:'30px'}}>Title: {job.title}</h3>
                                <h3 style={this.inputStyle}>Date Of posting: {job.dateOfPosting.substring(0,10)}</h3>
                                <h3 style={this.inputStyle}>Maximum number of positions: {job.numberOfPositions}</h3>
                                <h3 style={this.inputStyle}>Number of applicants: {job.peopleWhoApplied.reduce((n,appl)=>{return n+(!appl.isRejected);},0)}</h3>
                                <h3 style={this.inputStyle}>Number of positions remaining: {job.numberOfPositions - job.numberOfAccepted}</h3>
                                <button style={{...this.inputStyle,width:'20%',display:'auto'}} onClick={e=>this.viewApplicants(job._id)}>View applicants</button>
                                <button style={{...this.inputStyle,width:'20%',position:'absolute',right:'40%',top:'72%'}} onClick={e=>this.editJobs(job._id)}>Edit</button>
                                <button style={{...this.inputStyle,width:'20%',float:'right'}} onClick={e=>this.deleteJob(job._id)}>Delete</button>
                                <hr/>
                            </div>
                        )
                    })
                } 
            </div>
        )
    }
}

export default CreatedJobs;