import axios from 'axios';
import React, { Component } from 'react'

export class applyForJobs extends Component {
    constructor(props){
        super(props);
        this.state={
            SOP:''
        }
        this.handleChange = this.handleChange.bind(this); 
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event){
        const val = event.target.value;
        const nam = event.target.name;
        this.setState({[nam]:val});
    }

    handleSubmit(event){
        const search = this.props.location.search;
        const params = new URLSearchParams(search); 
        const IdFromURL = params.get('jobId'); 
        const EmailFromURL = params.get('email'); 
        axios.put("http://localhost:4000/user/applicant/apply",{jobId:IdFromURL, email: EmailFromURL,SOP:this.state.SOP},{withCredentials:true})
            .then(res=>{
                console.log(res);
                window.location.href = "/user/applicant/jobListings";
            })
            .catch(err=>console.log(err));
    }

    inputStyle = {
        fontFamily: 'OpenSans-Regular',
        fontSize: '20px',
        width: '40%',
        padding: '10px',
        margin: '8px',
        marginLeft:'auto',
        marginRight:'auto',
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
                <textarea style={{...this.inputStyle}} onChange={this.handleChange} name="SOP" value={this.state.SOP} rows="10" placeholder="Statement Of Purpose..."/>
            <button style={{...this.inputStyle}} onClick={this.handleSubmit}>Submit SOP</button>
            </div>
        )
    }
}

export default applyForJobs;