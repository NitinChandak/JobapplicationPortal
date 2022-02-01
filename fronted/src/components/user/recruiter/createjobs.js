import React, { Component } from 'react';
import axios from 'axios';

export class createjobs extends Component {
    constructor(props){
        super(props);
        this.state={
            title:'',
            nameOfRecruiter:'',// to be taken from recruiter database
            emailOfRecruiter:'',// to be taken from req.user
            numberOfApplications:'',
            numberOfPositions:'',
            dateOfPosting:'',// use todays date
            timeOfPosting:'',
            deadlineDate:'',
            deadlineTime:'',
            requiredSkills:[''],
            typeOfJob:'',
            durationOfJob:'',
            salaryPerMonth:''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        axios.get("http://localhost:4000/login/",{withCredentials: true})
            .then(res=>{
                axios.get("http://localhost:4000/user/recruiter/",{params:{email:res.data.user.email}, withCredentials:true})
                    .then(res=>{
                        this.setState({emailOfRecruiter: res.data.email, nameOfRecruiter: res.data.name});
                        let date = new Date().toISOString().slice(0, 10);
                        let time = new Date().toISOString().slice(11, 16);
                        this.setState({dateOfPosting: date, timeOfPosting: time})
                    })
            })
    }

    AddRows(event){
        this.setState(prevState=>({requiredSkills:[...prevState.requiredSkills,'']}));
    }

    DeleteRows(index, event){
        let array = this.state.requiredSkills.filter((skill, sindex)=>sindex !== index);
        this.setState({ requiredSkills: array});
    }

    handleChangeSkills(index, event){
        let array = [...this.state.requiredSkills];
        array[index] = event.target.value;
        this.setState({ requiredSkills: array });
    }

    handleSubmit(event){
        event.preventDefault();
        if(this.state.deadlineDate < this.state.dateOfPosting || this.state.deadlineTime < this.state.timeOfPosting)
            alert("Deadline shouldn't be before today");
        else{
            axios.post("http://localhost:4000/user/recruiter/createJobs",this.state,{withCredentials:true})
                .then(res=>{
                    console.log(res);
                    if('title' in res.data)
                        window.location.href="/user/recruiter/createdJobs";
                })
                .catch(err=>console.log(err));
        }
    }

    handleChange(event){
        const value = event.target.value;
        const name = event.target.name;
        this.setState({[name]: value});
    }

    inputStyle = {
        fontFamily: 'OpenSans-Regular',
        fontSize: '18px',
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
                <h1>Create Jobs</h1>
                <form onSubmit={this.handleSubmit}>
                    <input style={this.inputStyle} type="text" name="title" value={this.state.title} placeholder="Title" onChange={this.handleChange} required />
                    <input style={this.inputStyle} type="number" min="1" name="numberOfApplications" value={this.state.numberOfApplications} placeholder="Number of applications" onChange={this.handleChange} required />
                    <input style={this.inputStyle} type="number" min="1" name="numberOfPositions" value={this.state.numberOfPositions} placeholder="Number of positions" onChange={this.handleChange} required />
                    <h3>Deadline</h3>
                    <input style={{...this.inputStyle,display:'auto', width:'15%'}} type="date" name="deadlineDate" value={this.state.deadlineDate} placeholder="Deadline Date" onChange={this.handleChange} required />
                    <input style={{...this.inputStyle,display:'auto', width:'14%'}} type="time" name="deadlineTime" value={this.state.deadlineTime} placeholder="Deadline Time" onChange={this.handleChange} required />
                    <select style={this.inputStyle} name="typeOfJob" value={this.state.typeOfJob} onChange={this.j=this.handleChange}>
                        <option selected disabled value="">Type Of job</option>          
                        <option value="fulltime">Full Time</option>
                        <option value="parttime">Part Time</option>
                        <option value="workfromhome">Work From Home</option>
                    </select>
                    <h3>Skills Required</h3>
                    {
                        this.state.requiredSkills.map((skill,index)=>{
                            return(
                                <div key={index}>
                                    <input style={{...this.inputStyle,display: 'auto', width:'15%'}} required type="text" value={skill} onChange={this.handleChangeSkills.bind(this,index)} placeholder="Skill"/>
                                    <input style={{...this.inputStyle,display: 'auto', width:'5%' }} type="button" value="Delete" onClick={this.DeleteRows.bind(this, index)}/>
                                </div>
                            )
                        })
                    }
                    <input style={{...this.inputStyle, width:'21%'}} type="button" value="Add Skill" onClick={this.AddRows.bind(this)}/>
                    <input style={this.inputStyle} type="number" min="0" name="durationOfJob" value={this.durationOfJob} placeholder="Duration of job(In months)" onChange={this.handleChange} required />
                    <input style={this.inputStyle} type="number" min="0" name="salaryPerMonth" value={this.state.salaryPerMonth} placeholder="Salary Per Month" onChange={this.handleChange} required />
                    <input style={this.inputStyle} type="submit" value="Create Job"/>
                </form>
            </div>
        )
    }
}

export default createjobs;