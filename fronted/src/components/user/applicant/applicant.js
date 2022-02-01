import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export class applicant extends Component {
    constructor(props){
        super(props);
        this.logOut = this.logOut.bind(this);
    }

    componentDidMount(){
        axios.get("http://localhost:4000/login/",{withCredentials: true})
            .then(res => {
                if(!res.data.isLoggedIn){
                    window.location.href="/login";
                }else if(res.data.user.type === "recruiter"){
                    window.location.href = "/user/recruiter"
                }
            })
            .catch(err=>{
                console.log(err);
            })
    }

    logOut(event){
        console.log("hello");
        axios.get("http://localhost:4000/login/logout",{withCredentials: true})
            .then(res=>{
                console.log("bye");
                window.location.href = "/";
            })
            .catch(err=>{
                console.log(err);
            })
    }

    buttonStyle = {
        marginLeft: 'auto',
        border: 'none',
        padding: '10px',
        background: '#333',
        color: '#fff',
        cursor:'pointer',
        fontSize: '20px'
    };

    divStyle = {
        display: 'flex',
        margin: '0px',
        padding: '10px',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#333',
        color: '#fff'
    };

    linkStyle = {
        color: '#fff',
        textAlign: 'center',
        padding: '20px',
        textDecoration: 'none',
        fontSize:'20px'
    };
    
    render() {
        return (
            <div>
                <div style={this.divStyle}>
                    <h1>Welcome Applicant</h1>
                    <button style={this.buttonStyle} onClick={this.logOut}>Log Out</button> 
                </div>
                <div style={this.divStyle}>
                    <Link style={this.linkStyle} to="/user/applicant">Home</Link>
                    <Link style={this.linkStyle} to="/user/applicant/edit">Edit</Link>
                    <Link style={this.linkStyle} to="/user/applicant/jobListings">View jobs</Link>
                    <Link style={this.linkStyle} to="/user/applicant/myApplications">My Applications</Link>
                </div>
            </div>
        )
    }
}

export default applicant;
