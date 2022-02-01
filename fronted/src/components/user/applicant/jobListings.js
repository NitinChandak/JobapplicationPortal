import React, { Component } from 'react';
import axios from 'axios';

export class jobListings extends Component {
    constructor(props){
        super(props);
        this.state = {
            searchString:'',
            filterMinSalary:'',
            filterMaxSalary:'',
            filterByDurationVar:'',
            sortVar:'',
            filterByTypeVar:'',
            jobs:[],
            applicantData:{}
        };
        this.handleChange = this.handleChange.bind(this);
        this.searchQuery = this.searchQuery.bind(this);
        this.sortJobs = this.sortJobs.bind(this);
        this.filterByType = this.filterByType.bind(this);
        this.filterBySalary = this.filterBySalary.bind(this);
        this.filterByDuration = this.filterByDuration.bind(this);
        this.clearAllFilters = this.clearAllFilters.bind(this);
    }

    clearAllFilters(event){
        axios.get("http://localhost:4000/user/applicant/jobListings",{params:{searchString:""},withCredentials:true})
            .then(res=>{
                console.log(res);
                this.setState({
                    jobs:res.data,
                    searchString:'',
                    filterMinSalary:'',
                    filterMaxSalary:'',
                    filterByDurationVar:'',
                    sortVar:'',
                    filterByTypeVar:''
                });
            })
            .catch(err=>{
                console.log(err);
            })
    }

    filterByDuration(event){
        let value = parseFloat(event.target.value);
        this.setState({filterByDurationVar:value});
        let array = this.state.jobs.filter(job=>job.durationOfJob<value);
        this.setState({jobs: array});
    }

    filterByType(event){
        let value = event.target.value;
        this.setState({filterByTypeVar:value});
        let array = this.state.jobs.filter(job=>job.typeOfJob===value);
        this.setState({jobs: array});
    }

    filterBySalary(event){
        let minSal = parseInt(this.state.filterMinSalary);
        let maxSal = parseInt(this.state.filterMaxSalary);
        if(!minSal)
            minSal = 0;
        if(!maxSal)
            maxSal = Infinity;
        let array = this.state.jobs.filter(job=>job.salaryPerMonth >= minSal && job.salaryPerMonth <=maxSal )
        this.setState({jobs: array});
    }

    sortJobs(event){
        let array = [...this.state.jobs];
        let value = event.target.value;
        this.setState({sortVar:value});
        if(value === "salaryAscending"){
            array.sort((a,b)=>a.salaryPerMonth - b.salaryPerMonth);
        }
        else if(value === "salaryDescending"){
            array.sort((a,b)=>b.salaryPerMonth - a.salaryPerMonth);
        }
        else if(value === "durationAscending"){
            array.sort((a,b)=>a.durationOfJob - b.durationOfJob);
        }
        else if(value === "durationDescending"){
            array.sort((a,b)=>b.durationOfJob - a.durationOfJob);
        }
        else if(value === "ratingAscending"){
            array.sort((a,b)=>a.rating - b.rating);
        }
        else if(value === "ratingDescending"){
            array.sort((a,b)=>b.rating - a.rating);
        }
        this.setState({jobs: array});
        // console.log(this.state.jobs);
    }

    searchQuery(event){
        axios.get("http://localhost:4000/user/applicant/jobListings",{params:{searchString:this.state.searchString},withCredentials:true})
            .then(res=>{
                console.log(res);
                this.setState({jobs:res.data});
            })
            .catch(err=>{
                console.log(err);
            })    
        this.setState({searchString:''});
    }

    handleChange(event){
        const name = event.target.name;
        const value = event.target.value;
        this.setState({ [name]: value});
    }

    componentDidMount(){
        axios.get("http://localhost:4000/user/applicant/jobListings",{params:{searchString:this.state.searchString},withCredentials:true})
            .then(res=>{
                this.setState({jobs:res.data});
            })
            .catch(err=>{
                console.log(err);
            })

        axios.get("http://localhost:4000/login/",{withCredentials: true})
            .then(res=>{
                axios.get("http://localhost:4000/user/applicant/",{params:{email:res.data.user.email},withCredentials:true})
                .then(res=>{
                    this.setState({applicantData: res.data});
                })
                .catch(err=>{
                    console.log(err);
                })
            })
            .catch(err=>{
                console.log(err);
            })
    }

    hasApplied(jobId,event){
        if(this.state.applicantData.appliedJobs){
            if(this.state.applicantData.appliedJobs.some(job=>job.jobId === jobId)){
                return true;
            }
        }
        return false;
    }

    hasAppliedAndRejected(jobId,event){
        if(this.state.applicantData.appliedJobs){
            if(this.state.applicantData.appliedJobs.some(job=>job.jobId === jobId && job.isRejected)){
                return true;
            }
        }
        return false;
    }

    applyForJob(jobId){
        if(this.hasAppliedAndRejected(jobId))
            alert("You are rejected from this job!");
        else if(this.hasApplied(jobId))
            alert("You have applied for this job!");
        else{
            window.location.href="/user/applicant/apply?email="+this.state.applicantData.email+"&jobId="+jobId;
        }
    }

    isDisabled(){
        if(this.state.applicantData.isAccepted || (this.state.applicantData.appliedJobs && this.state.applicantData.appliedJobs.reduce((n,appl)=>{return n+(!appl.isRejected);},0) >=10))
            return true;
        return false;
    }

    isFull(job){
        if(job){
            if(job.peopleWhoApplied.reduce((n,appl)=>{return n+(!appl.isRejected);},0) >= job.numberOfApplications || job.numberOfAccepted >= job.numberOfPositions)
                return true;
            return false;    
        }
    }

    inputStyle = {
        fontFamily: 'OpenSans-Regular',
        fontSize: '20px',
        width: '30%',
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
        color: "#fff"
    };

    render() {
        return (
            <div>
                <div style={this.divStyle}>
                    <input style={{...this.inputStyle,display:'auto',float:'right'}} type="text" name="searchString" value={this.state.searchString} onChange={this.handleChange} placeholder="Search for jobs"/>
                    <button style={{...this.inputStyle, display:'auto', width:'10%',float:'right'}} onClick={this.searchQuery}>Search</button>
                    <select id="dropdown" style={this.inputStyle} value={this.state.sortVar} onChange={this.sortJobs}>
                        <option selected hidden disabled value="">Choose sort</option>
                        <option value="salaryAscending">Salary Ascending</option>
                        <option value="salaryDescending">Salary Descending</option>
                        <option value="durationAscending">Duration Ascending</option>
                        <option value="durationDescending">Duration Descending</option>
                        <option value="ratingAscending">Rating Ascending</option>
                        <option value="ratingDescending">Rating Descending</option>
                    </select>
                </div>
                <div style={this.divStyle}>  
                    <select style={this.inputStyle} value={this.state.filterByTypeVar} onChange={this.filterByType}>
                        <option selected disabled hidden value="">Filter By type of work</option>
                        <option value="fulltime">Full Time</option>
                        <option value="parttime">Part Time</option>
                        <option value="workfromhome">Work From Home</option>
                    </select>
                    
                    <input style={{...this.inputStyle, display:'auto', width:'11%'}} type="number" name="filterMinSalary" value={this.state.filterMinSalary} onChange={this.handleChange} placeholder="Min Salary"/>
                    <input style={{...this.inputStyle, display:'auto', width:'11%'}} type="number" name="filterMaxSalary" value={this.state.filterMaxSalary} onChange={this.handleChange} placeholder="Max Salary"/>
                    <button style={{...this.inputStyle, display:'auto', width:'11%', fontSize:'16px'}} onClick={this.filterBySalary}>Filter By salary</button>
        
                    <select style={{...this.inputStyle,float:'right'}} value={this.state.filterByDurationVar} onChange={this.filterByDuration}>
                        <option selected hidden disabled value="">Filter By months</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                    </select>
                </div>
                <div style={{...this.divStyle,padding:'30px', margin:'0 auto', position:'relative'}}>
                    <button style={{...this.inputStyle, width:'20%', margin:'0',position:'absolute',top:'0%'}} onClick={this.clearAllFilters}>Clear all Filters</button>
                </div>
                <div>
                    <h1>Jobs available</h1>
                    {
                        this.state.jobs!==[] && this.state.jobs.map(job=>{
                            return(
                                <div key={job._id} style={{...this.divStyle, background:'#222',position:'relative'}}>
                                    <h1 style={{...this.inputStyle,fontSize:'40px',width:'100%'}}>Title: {job.title}</h1>
                                    <h3 style={{...this.inputStyle,fontSize:'25px',width:'100%'}}>Name of Recruiter: {job.nameOfRecruiter}</h3>
                                    <h3 style={{...this.inputStyle,fontSize:'25px',width:'100%'}}>Rating of Job: {job.rating===-1?'Not rated':job.rating}</h3>
                                    <h3 style={{...this.inputStyle,fontSize:'25px',width:'100%'}}>Salary Per Month: {job.salaryPerMonth}</h3>
                                    <h3 style={{...this.inputStyle,fontSize:'25px',width:'100%'}}>Duration Of Job: {job.durationOfJob} months</h3>
                                    <h3 style={{...this.inputStyle,fontSize:'25px',width:'100%'}}>Deadline to Apply: {job.deadlineDate.substring(0,10) + '  ' + job.deadlineTime}</h3>
                                    <button 
                                        style={{...this.inputStyle,background:this.hasApplied(job._id)?'#7DF9FF':this.isFull(job)?'#f00':'#0f0',position:'absolute',top:'50%',right:'10%',width:'20%'}} 
                                        disabled={this.isDisabled() || this.isFull(job)} 
                                        onClick={e=>this.applyForJob(job._id)}>
                                        {job._id === this.state.applicantData.AcceptedJobId?'Accepted':this.hasAppliedAndRejected(job._id)?'Rejected':this.hasApplied( job._id)?'Applied':this.isFull(job)?'FULL':'Apply'}
                                    </button>
                                    <hr/>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

export default jobListings;