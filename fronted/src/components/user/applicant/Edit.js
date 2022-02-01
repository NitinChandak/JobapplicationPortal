import React, { Component } from 'react'
import axios from 'axios';

export class Edit extends Component {
    constructor(props){
        super(props);
        this.state = {extraVar:''};
        this.handleChange = this.handleChange.bind(this);
        this.addRowsEdu = this.addRowsEdu.bind(this);
        this.DeleteRows = this.DeleteRows.bind(this);
        this.addRowsSkills = this.addRowsSkills.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    skills = [];
    flag = true;
    
    handleChangeApplicant(index, event){
        let array = [...this.state.education];
        array[index].institutionName = event.target.value;
        this.setState({ education: array });
    }
    handleChangeApplicantStartYear(index, event){
        let array = [...this.state.education];
        array[index].startYear = event.target.value;
        this.setState({ education: array });
    }
    handleChangeApplicantEndYear(index, event){
        let array = [...this.state.education];
        if(!('endYear' in array[index])){
            array[index] = {...array[index],endYear:0};
        }
        array[index].endYear = parseInt( event.target.value);
        this.setState({ education: array });
        console.log(this.state);
    }
    handleChange(event){
        let name = event.target.name;
        let value = event.target.value;
        this.setState({[name]: value})
    }

    handleSubmit(event){
        event.preventDefault();
        console.log(this.state);
        axios.put("http://localhost:4000/user/applicant/edit",this.state,{withCredentials:true})
            .then(res=>{
                console.log(res);
                if(res.data === "done"){
                    window.location.href="/user/applicant";
                }
            })
            .catch(err=>{
                console.log(err);
            })
    }

    DeleteRows(index ,event){
        let array = this.state.education.filter((edu, sindex)=>sindex !== index);
        this.setState({ education: array});
    }
    addRowsEdu(event){
        this.setState(prevState => ({ education: [...prevState.education, {institutionName: '', startYear: '', endYear: ''}]}))
    }

    // Add new skills which are not in the given list.
    addRowsSkills(event){
        this.setState(prevState => ({skills: [...prevState.skills,this.state.extraVar]}));
        this.setState({ extraVar:''});
    }

    changeCheck(event){
        const skill = event.target.value;
        if(this.state.skills.includes(skill)){
            let array = this.state.skills.filter(skill=>skill !== event.target.value);
            this.setState({skills: array});
        }
        else{
            this.state.skills.push(skill);
        }
    }

    componentDidMount(){
        axios.get("http://localhost:4000/login/",{withCredentials: true})
        .then(res=>{
            console.log(res);
            axios.get("http://localhost:4000/user/applicant/",{params:{email:res.data.user.email},withCredentials:true})
            .then(res=>{
                this.setState({...res.data})
                console.log(this.state);
            })
            .catch(err=>{
                console.log(err);
            })
        })
        .catch(err=>{
            console.log(err);
        })
    }

    // CSS 
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
                <h1>Edit</h1>
                <form onSubmit={this.handleSubmit}>
                    <input style={ this.inputStyle } required type="text" name="name" value={this.state.name} onChange={this.handleChange} placeholder="Name"/>
                    {
                        <div>
                        <h2>Education</h2>
                        {
                            this.state.education !== undefined && this.state.education.map((education,index)=>{
                                return(
                                    <div key={index}>
                                        <input style={{...this.inputStyle,display: 'auto' }} required type="text" value={education.institutionName} onChange={this.handleChangeApplicant.bind(this, index)} placeholder="Institution Name"/>
                                        <input style={{...this.inputStyle,display: 'auto', width:'10%' }} required type="number" value={education.startYear} onChange={this.handleChangeApplicantStartYear.bind(this, index)} placeholder="Start Year"/>
                                        <input style={{...this.inputStyle,display: 'auto', width:'10%' }} type="number" value={education.endYear } onChange={this.handleChangeApplicantEndYear.bind(this, index)} placeholder="End Year"/>
                                        <input style={{...this.inputStyle,display: 'auto', width:'10%' }} type="button" value="Delete" onClick={this.DeleteRows.bind(this, index)}/>
                                    </div>
                                )
                            })
                        }
                        <input style={ this.inputStyle } type="button" value="addRows" onClick={this.addRowsEdu}/>
                        <h2>Skills</h2>
                        {
                            this.state.skills !== undefined && this.state.skills.map((Skill,index)=>{
                                return(
                                    <div>
                                        <input style={{...this.inputStyle, display:'auto',width:'5%'}} onChange={this.changeCheck.bind(this)} type="checkbox" value={Skill} checked='checked'/>{Skill.toUpperCase()}
                                    </div>
                                )
                            })
                        }
                        <input style={{ ...this.inputStyle,display: 'auto'}} type="text" value={this.state.extraVar} name="extraVar" onChange={this.handleChange} placeholder="Add new skill"/>
                        <input style={{...this.inputStyle, display:'auto', width:'10%'}} type="button" value="Add skill" onClick={this.addRowsSkills}/>
                    </div>
                    } 
                    <input style={ this.inputStyle } type="submit" value="Submit" />               
                </form>
            </div>
        )
    }
}

export default Edit;