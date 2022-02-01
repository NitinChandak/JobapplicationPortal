import axios from 'axios';
import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';

export class Register extends Component {
    constructor(props){
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            type: '',
            ApplicantEducation: [{institutionName: '', startYear: '', endYear: ''}],
            ApplicantSkill: [],
            RecruiterContact: '',
            RecruiterBio: '',
            extraVar: '',
            loginredirect: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addRowsEdu = this.addRowsEdu.bind(this);
        this.DeleteRows = this.DeleteRows.bind(this);
        this.addRowsSkills = this.addRowsSkills.bind(this);
        this.checkLoggedInUser = this.checkLoggedInUser.bind(this);
    }
    // Skill that the applicant can choose from. He/She can add more skill using add skill button.
    skills = [
        {skill: "php", isChecked: false},
        {skill:"python", isChecked: false},
        {skill:"c", isChecked: false},
        {skill:"c++", isChecked: false},
        {skill:"java", isChecked: false}
    ];

    checkLoggedInUser(event){
        axios.get("http://localhost:4000/login/",{withCredentials: true})
            .then(res => {
                if(res.data.isLoggedIn){
                    if(res.data.user.type === "recruiter")
                        window.location.href="/user/recruiter";
                    else
                        window.location.href="/user/applicant";
                }
                //console.log(res.data.isLoggedIn);
            })
            .catch(err=>{
                console.log(err);
            })
    }
     
    // Add and delete rows for applicants education.
    DeleteRows(index ,event){
        let array = this.state.ApplicantEducation.filter((edu, sindex)=>sindex !== index);
        this.setState({ ApplicantEducation: array});
    }
    addRowsEdu(event){
        this.setState(prevState => ({ ApplicantEducation: [...prevState.ApplicantEducation, {institutionName: '', startYear: '', endYear: ''}]}))
    }

    // Add new skills which are not in the given list.
    addRowsSkills(event){
        this.skills.push({skill: this.state.extraVar, isChecked: false});
        this.setState({ extraVar:''});
    }

    // Handle changes in the respective input areas.
    handleChangeApplicant(index, event){
        let array = [...this.state.ApplicantEducation];
        array[index].institutionName = event.target.value;
        this.setState({ ApplicantEducation: array });
    }
    handleChangeApplicantStartYear(index, event){
        let array = [...this.state.ApplicantEducation];
        array[index].startYear = event.target.value;
        this.setState({ ApplicantEducation: array });
    }
    handleChangeApplicantEndYear(index, event){
        let array = [...this.state.ApplicantEducation];
        array[index].endYear = event.target.value;
        this.setState({ ApplicantEducation: array });
    }
    handleChange(event){
        let name = event.target.name;
        let value = event.target.value;
        this.setState({[name]: value})
    }

    // changes the value of is checked to true or false
    changeCheck(index, event){
        this.skills[index].isChecked = !this.skills[index].isChecked;
        //console.log(this.skills);
    }

    // Handle onSubmit event.
    handleSubmit(event){
        event.preventDefault();
        
        this.skills.forEach(Skill => {
            if(Skill.isChecked)
                this.state.ApplicantSkill.push(Skill.skill)
        });

        if(this.state.password === this.state.confirmPassword){
            axios.post('http://localhost:4000/register',this.state,{withCredentials: true})
            .then(res => {
                this.setState({loginredirect: true});
                alert("Created user ");
            })
            .catch(err => {
                alert("Email already exists")
            });
            this.setState({
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                type: '',
                ApplicantEducation: [{institutionName: '', startYear: '', endYear: ''}],
                ApplicantSkill: [],
                RecruiterContact: '',
                RecruiterBio: '',
                extraVar: ''
            });
        }
        else{
            alert("Password and confirmed password do not match");
        }
        
    }

    // CSS for input boxes.
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
    linkStyle = {
        color: '#fff',
        textAlign: 'center',
        padding: '10px'
    };

    render() {
        this.checkLoggedInUser()
        return (
            <div style={this.divStyle}>
                <h1>Register</h1>
                <form onSubmit={this.handleSubmit}>
                    <input style={ this.inputStyle } required type="text" name="name" value={this.state.name} onChange={this.handleChange} placeholder="Name"/>
                    <input style={ this.inputStyle } required type="email" name="email" value={this.state.email} onChange={this.handleChange} placeholder="Email"/>
                    <input style={ this.inputStyle } required type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Password"/>
                    <input style={ this.inputStyle } required type="password" name="confirmPassword" value={this.state.confirmPassword} onChange={this.handleChange} placeholder="Confirm Password"/>
                    <select style={ this.inputStyle } required name="type" value={this.state.type} onChange={this.handleChange}>  
                        <option selected disabled value="">Type</option>          
                        <option value="recruiter">Recruiter</option>
                        <option value="applicant">Applicant</option>
                    </select>
                    {
                        this.state.type === "applicant" && <div>
                            <h2>Applicant</h2>
                            {
                                this.state.ApplicantEducation.map((education,index)=>{
                                    return(
                                        <div key={index}>
                                            <input style={{...this.inputStyle,display: 'auto' }} required type="text" value={education.institutionName} onChange={this.handleChangeApplicant.bind(this, index)} placeholder="Institution Name"/>
                                            <input style={{...this.inputStyle,display: 'auto', width:'10%' }} required type="number" value={education.startYear} onChange={this.handleChangeApplicantStartYear.bind(this, index)} placeholder="Start Year"/>
                                            <input style={{...this.inputStyle,display: 'auto', width:'10%' }} type="number" value={education.endYear} onChange={this.handleChangeApplicantEndYear.bind(this, index)} placeholder="End Year"/>
                                            <input style={{...this.inputStyle,display: 'auto', width:'5%' }} type="button" value="Delete" onClick={this.DeleteRows.bind(this, index)}/>
                                        </div>
                                    )
                                })
                            }
                            <input style={ this.inputStyle } type="button" value="addRows" onClick={this.addRowsEdu}/>
                            <h2>Skills</h2>
                            {
                                this.skills.map((Skill,index)=>{
                                    return(
                                        <div>
                                            <input style={{...this.inputStyle, display:'auto',width:'5%'}} onChange={this.changeCheck.bind(this,index)} type="checkbox" value={Skill.skill} />{Skill.skill.toUpperCase()}
                                        </div>
                                    )
                                })
                            }
                            <input style={{ ...this.inputStyle,display: 'auto'}} type="text" value={this.state.extraVar} name="extraVar" onChange={this.handleChange} placeholder="Add new skill"/>
                            <input style={{...this.inputStyle, display:'auto', width:'10%'}} type="button" value="Add skill" onClick={this.addRowsSkills}/>
                        </div>
                    }
                    {
                        this.state.type === "recruiter" && <div>
                            <h2>Recruiter</h2>
                            <input style={ this.inputStyle } required type="tel" pattern="[0-9]{10}" maxLength="10" name="RecruiterContact" value={this.state.RecruiterContact} onChange={this.handleChange} placeholder="Contact Number"/>
                            <textarea style={ this.inputStyle } required type="text" name="RecruiterBio" value={this.state.RecruiterBio} onChange={this.handleChange} placeholder="Write about yourself"/>
                        </div>
                    }
                    <input style={ this.inputStyle } type="submit" value="Register" />
                    {
                        this.state.loginredirect && <Redirect exact to="/login"/>
                    }
                </form>
                Already having an account?<Link style={this.linkStyle} to="/login">Login</Link>
            </div>
        )
    }
}

export default Register;
