import React, { Component } from 'react'
import axios from 'axios';

export class EditJobDetails extends Component {
    constructor(props){
        super(props);
        this.state={};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event){
        event.preventDefault();
        axios.put("http://localhost:4000/user/recruiter/jobDetails/",this.state,{withCredentials:true})
            .then(res=>{
                console.log(res.data);
                if(res.data === "done")
                    window.location.href = "/user/recruiter/createdJobs"
                else
                    console.log(res);
            }).catch(err=>console.log(err));
    }

    handleChange(event){
        const name = event.target.name;
        const value = event.target.value;
        this.setState({[name]: value});
    }

    componentDidMount(){
        const search = this.props.location.search;
        const params = new URLSearchParams(search); 
        const IdFromURL = params.get('jobId'); 
        axios.get("http://localhost:4000/user/recruiter/jobDetails",{params:{id: IdFromURL},withCredentials:true})
            .then(res=>{
                const date = res.data[0].deadlineDate.substring(0,10);
                this.setState({...res.data[0],deadlineDate: date});
                console.log(this.state);
            }).catch(err=>console.log(err));
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
            <div style={this.divStyle}>
                <form onSubmit={this.handleSubmit}>
                    <h3 style={this.inputStyle}>Maximum number of Applicants:</h3>
                    <input style={this.inputStyle} name="numberOfApplications" value={this.state.numberOfApplications} placeholder="Max no. of applicants" onChange={this.handleChange}/>
                    <h3 style={this.inputStyle}>Maximum number of positions:</h3>
                    <input style={this.inputStyle} name="numberOfPositions" value={this.state.numberOfPositions} placeholder="Max no. of positions" onChange={this.handleChange}/>
                    <h3 style={this.inputStyle}>Deadline:</h3>
                    <input style={{...this.inputStyle,display:'auto', width:'15%'}} type="date" name="deadlineDate" value={this.state.deadlineDate} placeholder="Deadline Date" onChange={this.handleChange} required />
                    <input style={{...this.inputStyle,display:'auto', width:'14%'}} type="time" name="deadlineTime" value={this.state.deadlineTime} placeholder="Deadline Time" onChange={this.handleChange} required />
                    <input style={this.inputStyle} type="submit" value="Update" />
                </form>
            </div>
        )
    }
}

export default EditJobDetails;