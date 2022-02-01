import React, { Component } from 'react';
import axios from 'axios';

export class Edit extends Component {
    constructor(props){
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        axios.get("http://localhost:4000/login/",{withCredentials:true})
            .then(res=>{
                console.log(res);
                axios.get("http://localhost:4000/user/recruiter",{params:{email: res.data.user.email},withCredentials:true})
                    .then(res=>{
                        this.setState({...res.data});
                        console.log(res);
                    })
            })
    }

    handleChange(event){
        let name = event.target.name;
        let value = event.target.value;
        this.setState({[name]: value})
    }

    handleSubmit(event){
        event.preventDefault();
        console.log(this.state);
        axios.put("http://localhost:4000/user/recruiter/edit",this.state,{withCredentials:true})
            .then(res=>{
                if(res.data === "done"){
                    window.location.href="/user/recruiter";
                }
            })
            .catch(err=>{
                console.log(err);
            })
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
                <form onSubmit={this.handleSubmit}>
                    <h2>Name:</h2><input style={ this.inputStyle } required type="text" name="name" value={this.state.name} onChange={this.handleChange} placeholder="Name"/>
                    <h2>Contact Number:</h2><input style={ this.inputStyle } required type="tel" pattern="[0-9]{10}" maxLength="10" name="contactNumber" value={this.state.contactNumber} onChange={this.handleChange} placeholder="Contact Number"/>
                    <h2>Bio:</h2><textarea style={ this.inputStyle } required type="text" name="bio" value={this.state.bio} onChange={this.handleChange} placeholder="Write about yourself"/>  
                    <input style={ this.inputStyle } type="submit" value="Submit" />                 
                </form>
            </div>
        )
    }
}

export default Edit;