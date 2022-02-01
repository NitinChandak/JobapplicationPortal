import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export class NavigationBar extends Component {
    constructor(props){
        super(props);
        this.checkLoggedInUser = this.checkLoggedInUser.bind(this);
    }
    checkLoggedInUser(event){
        axios.get("http://localhost:4000/login/",{withCredentials: true})
            .then(res => {
                if(res.data.isLoggedIn){
                    if(res.data.user.type === "recruiter")
                        window.location.href="/user/recruiter";
                    else
                        window.location.href="/user/applicant";
                }
                console.log(res.data.isLoggedIn,this.state.redirect);
            })
            .catch(err=>{
                console.log(err);
            })
    }
    headerStyle = {
        margin: '0px',
        padding: '10px',
        textAlign: 'center',
        background: '#333',
        color: '#fff'
    };

    linkStyle = {
        color: '#fff',
        textAlign: 'center',
        padding: '10px',
        textDecoration: 'none',
    };
    render() {
        this.checkLoggedInUser()
        return (
            <div className="Header" style={ this.headerStyle }>
                <h1>Jobs Search</h1>
                <Link to="/login" style={ this.linkStyle }>Login</Link> | <Link to="/register" style={ this.linkStyle }>Register</Link> 
                <div className="Header">
                    <h1>
                        Welcome to Job Portal
                    </h1>
                </div>
            </div>
        )
    }
}

export default NavigationBar;
