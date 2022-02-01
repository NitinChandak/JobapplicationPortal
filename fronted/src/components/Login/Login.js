import React, { Component } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';

axios.defaults.withCredentials = true;

export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {email: '', password: '',type: '',redirect: false,message: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
                //console.log(res.data.isLoggedIn,this.state.redirect);
            })
            .catch(err=>{
                console.log(err);
            })
    }
    handleChange(event) { 
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});  
    }
    handleSubmit(event) {
        event.preventDefault();
        const user = {
            email: this.state.email,
            password: this.state.password,
            type: this.state.type
        };
        
        axios.post('http://localhost:4000/login/',user,{withCredentials: true})
            .then(res => {
                if(res.data === "Logged In successfully"){
                    this.setState({redirect:true});
                }else if(res.data === "Password incorrect"){
                    this.setState({message: "Password incorrect"});
                    this.setState({redirect:false});
                }else{
                    this.setState({message: "No user found"});
                    this.setState({redirect:false});
                }
                console.log(res);
            });
        this.setState({ 
            email: '',
            password: '',
            type: ''
        });
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
        color: '#fff'
    };
 
    linkStyle = {
        color: '#fff',
        textAlign: 'center',
        padding: '10px'
    };
    render() {
        this.checkLoggedInUser()
        return (
            <div style={ this.divStyle }>
                {
                    this.state.redirect && 
                        ((this.state.type === "recruiter" && <Redirect to="/user/recruiter"/>)
                        ||
                        (this.state.type === "applicant" && <Redirect to="/user/applicant"/>))
                }
                <h1>Login</h1>
                <form onSubmit={this.handleSubmit}>
                    <h3>{this.state.message}</h3>
                    <input style={ this.inputStyle } required type="email" name="email" value={this.state.email} onChange={this.handleChange} placeholder="Email"/> 
                    <input style={ this.inputStyle } required type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Password"/>                    
                    <select style={ this.inputStyle } required name="type" value={this.state.type} onChange={this.handleChange}>  
                        <option selected disabled value="">Type</option>          
                        <option value="recruiter">Recruiter</option>
                        <option value="applicant">Applicant</option>
                    </select>
                    <input style={ this.inputStyle } type="submit" value="Login" />
                </form>
                Dont have an account?<Link style={this.linkStyle} to="/register">Register</Link>
        </div>
        );
    }
};

export default Login;
