import axios from 'axios';
import React, { Component } from 'react'

export class MyApplications extends Component {
    constructor(props){
        super(props);
        this.state={
            isAccepted:false,
            dateOfJoining:'',
            acceptedJobId:'',
            jobs:[],
            rate:[]
        };
    }
    
    componentDidMount(){
        axios.get("http://localhost:4000/login",{withCredentials:true})
            .then(res=>{
                axios.get("http://localhost:4000/user/applicant/",{params:{email:res.data.user.email}},{withCredentials:true})
                .then(res=>{
                        this.setState({isAccepted:res.data.isAccepted});
                        if(res.data.AcceptedDate)
                            this.setState({dateOfJoining:res.data.AcceptedDate.substring(0,10)});
                        this.setState({acceptedJobId:res.data.AcceptedJobId});
                        const appliedjobs = res.data.appliedJobs;
                        const len = appliedjobs.length;
                        const jobs = [];
                        for(let i=0;i<len;i++){
                            axios.get("http://localhost:4000/user/applicant/getJobs",{params:{jobId: appliedjobs[i].jobId},withCredentials:true})
                                .then(res=>{
                                    jobs.push({...res.data,isRejected:appliedjobs[i].isRejected,jobId:appliedjobs[i].jobId});
                                    this.setState({jobs:jobs});
                                }).catch(err=>console.log(err));
                        }
                    }).catch(err=>console.log(err));
            }).catch(err=>console.log(err));
    }

    handleChange(index,event){
        let array = [...this.state.rate];
        array[index] = event.target.value;
        this.setState({rate:array});
    }

    rateJob(index){
        let rating = parseFloat(this.state.rate[index]);
        if(!rating)
            alert("No rating given");
        else{
            if(rating> 5 || rating < 0)
                alert("Correct rating not given!");
            else{
                let previousRating = this.state.jobs[index].rating;
                let jobId = this.state.jobs[index].jobId;
                let newRating = 0;
                if(previousRating === -1)
                    newRating = rating;
                else{
                    newRating = (previousRating+rating)/2;
                }
                newRating = newRating.toFixed(2);
                axios.put("http://localhost:4000/user/applicant/ratejob",{rating: newRating,jobId:jobId},{withCredentials:true})
                    .then(res=>window.location.reload())
                    .catch(err=>console.log(err))
                console.log(newRating,previousRating);
            }
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
        color: "#fff"
    };

    render() {
        return (
            <div style={this.divStyle}>
                {
                    this.state.jobs!==[] && this.state.jobs.map((job,index)=>{
                        return(
                            <div key={index} style={{position:'relative'}}>
                                <h3 style={this.inputStyle}>Title: {job.title}</h3>
                                <h3 style={this.inputStyle}>Date of Joining: {this.state.isAccepted && this.state.acceptedJobId === job.jobId?this.state.dateOfJoining:'--'}</h3>
                                <h3 style={this.inputStyle}>Salary Per month: {job.salary}</h3>
                                <h3 style={this.inputStyle}>Name of Recruiter: {job.nameOfRecruiter }</h3>
                                <h3 style={this.inputStyle}>Stage: {this.state.isAccepted&&this.state.acceptedJobId === job.jobId?'Accepted':job.isRejected?'Rejected':'Pending'}</h3>
                                <input style={{...this.inputStyle, width:'10%',display:'auto',position:'absolute',top:'10%',right:'25%'}} onChange={this.handleChange.bind(this,index)} type="number" value={this.state.rate[index]} min="0" max="5" placeholder="Rate"/>
                                <input style={{...this.inputStyle,width:'10%',display:'auto',position:'absolute',top:'40%',right:'25%'}} value="Rate" type="submit" onClick={e=>this.rateJob(index)}/>
                                <hr/>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

export default MyApplications
