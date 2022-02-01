import axios from 'axios';
import React, { Component } from 'react'

export class AcceptedJobApplicants extends Component {
    constructor(props){
        super(props);
        this.state={
            rate:[],
            AcceptedPeople:[]
        };
        this.sortApplicants = this.sortApplicants.bind(this);
    }

    sortApplicants(event){
        let value = event.target.value;
        let array = [...this.state.AcceptedPeople];
        if(value === "nameAscending"){
            array.sort((a,b)=>(a.name > b.name)?1:(a.name < b.name)?-1:0);
        }else if(value === "nameDescending"){
            array.sort((a,b)=>(b.name > a.name)?1:(b.name < a.name)?-1:0);
        }else if(value === "dateAscending"){
            array.sort((a,b)=>(a.dateOfJoining > b.dateOfJoining)?1:(a.dateOfJoining < b.dateOfJoining)?-1:0);
        }else if(value === "dateDescending"){
            array.sort((a,b)=>(b.dateOfJoining > a.dateOfJoining)?1:(b.dateOfJoining < a.dateOfJoining)?-1:0);
        }else if(value === "titleAscending"){
            array.sort((a,b)=>(a.jobTitle > b.jobTitle)?1:(a.jobTitle < b.jobTitle)?-1:0);
        }else if(value === "titleDescending"){
            array.sort((a,b)=>(b.jobTitle > a.jobTitle)?1:(b.jobTitle < a.jobTitle)?-1:0);
        }else if(value === "ratingAscending"){
            array.sort((a,b)=>a.rating - b.rating);
        }else if(value === "ratingDescending"){
            array.sort((a,b)=>b.rating - a.rating);
        }
        this.setState({AcceptedPeople:array});
    }

    componentDidMount(){
        axios.get("http://localhost:4000/login",{withCredentials:true})
            .then(res=>{
                axios.get("http://localhost:4000/user/recruiter/",{params:{email:res.data.user.email}},{withCredentials:true})
                    .then(res=>{
                        const peopleAccepted = res.data.acceptedApplicants;
                        let len = peopleAccepted.length;
                        const AcceptedPeople = []
                        for(let i=0;i<len;i++){
                            axios.get("http://localhost:4000/user/recruiter/acceptedApplicant",{params:{email:peopleAccepted[i]}},{withCredentials:true})
                            .then(res=>{
                                AcceptedPeople.push(res.data);
                                this.setState({AcceptedPeople:AcceptedPeople});
                            }).catch(err=>console.log(err));
                        }
                    }).catch(err=>console.log(err));
            }).catch(err=>console.log(err));
    }

    handleChange(index,event){
        let array = [...this.state.rate];
        array[index] = event.target.value;
        this.setState({rate:array});
    }

    rateApplicant(index){
        let rating = parseFloat(this.state.rate[index]);
        if(!rating)
            alert("No rating given");
        else{
            if(rating> 5 || rating < 0)
                alert("Correct rating not given!");
            else{
                let previousRating = this.state.AcceptedPeople[index].rating;
                let applicantEmail = this.state.AcceptedPeople[index].email;
                let newRating = 0;
                if(previousRating === -1)
                    newRating = rating;
                else{
                    newRating = (previousRating+rating)/2;
                }
                newRating = newRating.toFixed(2);
                axios.put("http://localhost:4000/user/recruiter/rateApplicant",{rating: newRating,email:applicantEmail},{withCredentials:true})
                    .then(res=>window.location.reload())
                    .catch(err=>console.log(err))
                console.log(newRating,previousRating,applicantEmail);
            }
        }
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
    
    render() {
        return (
            <div style={this.divStyle}>
                <select style={{...this.inputStyle,width:'30%',position:'relative',left:'35%'}} onChange={e=>this.sortApplicants}>
                    <option selected disabled value="">Sort Applicants</option>
                    <option value="nameAscending">Name Ascending</option>
                    <option value="nameDescending">Name Descending</option>
                    <option value="dateAscending">Date Ascending</option>
                    <option value="dateDescending">Date Descending</option>
                    <option value="titleAscending">Title Ascending</option>
                    <option value="titleDescending">Title Descending</option>
                    <option value="ratingAscending">Rating Ascending</option>
                    <option value="ratingDescending">Rating Descending</option>
                </select>
                {
                    this.state.AcceptedPeople!==[] && this.state.AcceptedPeople.map((person,index)=>{
                        return(
                            <div key={index} style={{position:'relative'}}>
                                <h3 style={this.inputStyle}>Name: {person.name}</h3>
                                <h3 style={this.inputStyle}>Date of joining: {person.dateOfJoining.substring(0,10)}</h3>
                                <h3 style={this.inputStyle}>Job type: {person.jobType}</h3>
                                <h3 style={this.inputStyle}>Job title: {person.jobTitle}</h3>
                                <input style={{...this.inputStyle, width:'10%',display:'auto',position:'absolute',top:'10%',right:'25%'}} onChange={this.handleChange.bind(this,index)} type="number" value={this.state.rate[index]} min="0" max="5" placeholder="Rate"/>
                                <input style={{...this.inputStyle,width:'10%',display:'auto',position:'absolute',top:'40%',right:'25%'}} value="Rate" type="submit" onClick={e=>this.rateApplicant(index)}/>
                                <hr/>
                            </div>
                        )
                    })
                }      
            </div>
        )
    }
}

export default AcceptedJobApplicants;