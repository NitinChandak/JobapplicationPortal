import axios from 'axios';
import React, { Component } from 'react'

export class ViewJobApplicants extends Component {
    constructor(props){
        super(props);
        this.state = {
            emailOfRecruiter:'',
            applicants:[]
        };
        this.sortApplicants = this.sortApplicants.bind(this);
    }

    componentDidMount(){
        const search = this.props.location.search;
        const params = new URLSearchParams(search); 
        const IdFromURL = params.get('jobId'); 
        axios.get("http://localhost:4000/user/recruiter/viewJobApplicants",{params:{id:IdFromURL},withCredentials:true})
            .then(res=>{
                this.setState({emailOfRecruiter:res.data[0].emailOfRecruiter});
                const peopleWhoApplied = res.data[0].peopleWhoApplied;
                const len = peopleWhoApplied.length;
                const applicants=[];
                for(let i=0;i<len;i++){
                    axios.get("http://localhost:4000/user/recruiter/getApplicant",{params:{email:peopleWhoApplied[i].email},withCredentials:true})
                        .then(res=>{
                            applicants.push({...res.data[0],SOP: peopleWhoApplied[i].SOP, isRejected: peopleWhoApplied[i].isRejected,dateOfApplication:peopleWhoApplied[i].dateOfApplication});
                            this.setState({applicants:applicants});
                        })
                        .catch(err=>console.log(err));
                }
            }).catch(err=>console.log(err));
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

    sortApplicants(event){
        let array = [...this.state.applicants];
        const val = event.target.value;
        if(val === "nameAscending"){
            array.sort((a,b)=>(a.name > b.name)? 1 : (a.name < b.name)? -1 : 0);
        }else if(val === "nameDescending"){
            array.sort((a,b)=>(b.name > a.name)? 1 : (b.name < a.name)? -1 : 0);
        }else if(val === "dateAscending"){
            array.sort((a,b)=>{
                if(a.dateOfApplication>b.dateOfApplication)
                    return 1;
                else if(a.dateOfApplication<b.dateOfApplication)
                    return -1;
                else 
                    return 0;
            });
        }else if(val === "dateDescending"){
            array.sort((a,b)=>{
                if(b.dateOfApplication>a.dateOfApplication)
                    return 1;
                else if(b.dateOfApplication<a.dateOfApplication)
                    return -1;
                else 
                    return 0;
            });
        }else if(val === "ratingAscending"){
            array.sort((a,b)=>a.rating - b.rating);
        }else if(val === "ratingDescending"){
            array.sort((a,b)=>b.rating - a.rating);
        }    
        this.setState({applicants:array});
    }

    accept(applicantEmail, isAccepted){
        if(isAccepted)
            alert("Cannot accept, Already accepted by you or other recruiter!")
        else{
            const search = this.props.location.search;
            const params = new URLSearchParams(search); 
            const IdFromURL = params.get('jobId'); 
            const emailOfRecruiter = this.state.emailOfRecruiter;
            axios.put("http://localhost:4000/user/recruiter/accept",{email:applicantEmail, jobId:IdFromURL,emailOfRecruiter:emailOfRecruiter},{withCredentials:true})
                .then(res=>{
                    window.location.reload();
                }).catch(err=>console.log(err));
        }
    }

    reject(applicantEmail, isAccepted){
        if(isAccepted)
            alert("Cannot reject, Already accepted by you or other recruiter!")
        else{
            const search = this.props.location.search;
            const params = new URLSearchParams(search); 
            const IdFromURL = params.get('jobId'); 
            axios.put("http://localhost:4000/user/recruiter/reject",{email: applicantEmail, jobId:IdFromURL},{withCredentials:true})
                .then(res=>{
                    window.location.reload();
                }).catch(err=>console.log(err));
        }
    }

    render() {
        return (
            <div style={this.divStyle}>
                <select style={{...this.inputStyle,width:'30%'}} onChange={this.sortApplicants}>
                    <option disabled selected value="">Sort Applicants</option>
                    <option value="nameAscending">Name Ascending</option>
                    <option value="nameDescending">Name Descending</option>
                    <option value="dateAscending">Date of Application Ascending</option>
                    <option value="dateDescending">Date of Application Descending</option>
                    <option value="ratingAscending">Rating Ascending</option>
                    <option value="ratingDescending">Rating Descending</option>
                </select>
                {
                    this.state.applicants!==[] && this.state.applicants.map((applicant,index)=>{
                        return(
                            !applicant.isRejected && <div key={index} style={{position:'relative'}}>
                                <h3 style={this.inputStyle}>Name: {applicant.name}</h3>
                                <h3 style={this.inputStyle}>Skills:</h3>
                                {
                                    applicant.skills.map((skill,index)=>{
                                        return (<h3 key={index} style={this.inputStyle}>{index+1}. {skill}</h3>)
                                    })
                                }
                                <h3 style={this.inputStyle}>Date of Application: {applicant.dateOfApplication}</h3>
                                <h3 style={this.inputStyle}>Education:</h3>
                                {
                                    applicant.education.map((edu,index)=>{
                                        return(
                                            <div key={index}>
                                                <h3 style={this.inputStyle}>Institution Name: {edu.institutionName}</h3>
                                                <h3 style={this.inputStyle}>From {edu.startYear} To {edu.endYear?edu.endYear:'-'}</h3>
                                            </div>
                                        )
                                    })
                                }
                                <h3 style={this.inputStyle}>SOP: {applicant.SOP}</h3>
                                <h3 style={this.inputStyle}>Rating: {applicant.rating===-1?'Not rated':applicant.rating}</h3>
                                <h3 style={this.inputStyle}>Stage Of Applicant: {applicant.isAccepted?'Accepted':'Shortlisted'}</h3>
                                <button style={{...this.inputStyle,background:'#0f0',width:'20%',position:'absolute',top:'40%',right:'10%'}} onClick={e=>this.accept(applicant.email,applicant.isAccepted)}>Accept</button>
                                <button style={{...this.inputStyle,background:'#f00',width:'20%',position:'absolute',top:'50%',right:'10%'}} onClick={e=>this.reject(applicant.email,applicant.isAccepted)}>Reject</button>
                                <hr/>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

export default ViewJobApplicants;