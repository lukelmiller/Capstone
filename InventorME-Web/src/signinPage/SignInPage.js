import React, { Component } from 'react';
import './SignInPage.css';
// import ProfileBox from '../images/profile-box.png';
import ToastMessage from '../components/toastMessage/ToastMessage';
import { Auth } from 'aws-amplify';



class SignInPage extends Component{

    constructor(props) {
        super(props);
        this.state = { response: '', post: '', email: '', password: '', loading: false };
        this.setPassword = this.setPassword.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.validateUser = this.validateUser.bind(this);
        this.submit = this.submit.bind(this);
        this.toast = React.createRef();
      }
      
      async componentDidMount() {
        try{
          await Auth.currentSession();
          window.location.href="/items-page";
        }
        catch(error){
          console.log('could not find user :(', error);
        }
      }

      setEmail(event){
        this.setState({ email: event.target.value});
        event.preventDefault();
      }
      setPassword(event){
        this.setState({ password: event.target.value});
        event.preventDefault();
      }
      validateUser(){
        this.setState({ loading: true})
        if(this.state.email === ""){
          this.setState({ loading: false});
          this.toastMessage("Error: Please Type Email");
        }
        else if(this.state.password === ""){
          this.setState({ loading: false});
          this.toastMessage("Error: Please Type Password");
        }
        else
          this.submit();
      };

      submit = async () =>{
        try{
          const user = await Auth.signIn(this.state.email, this.state.password);
          console.log('Logged in!', user);
          window.location.href="/items-page";
        }catch(error){
          this.setState({ loading: false});
          this.toastMessage('Error: Password or Email is incorrect');
        }
      };

      toastMessage = (message) => {
        this.toast.current.openToast(message);
      };


   render(){
       return(
    <div className="signin-title">
      { this.state.loading ?
      <div className="loading-container-sign"> <div className="form-load-symbol-sign"/></div>
      : null }
    <div className="signin-inventor-title">
    <h2>InventorME</h2>
    </div>
    <ToastMessage ref={this.toast}/>
    <div  className="login-box">
    {/* <img class = "lbox"img style = {this.state.style} src={ProfileBox} alt=""/> */}
    <p className ="Password"> Password: </p>
    <input type="password" className = "password" 
      value={this.state.password} 
      onChange={this.setPassword}/>
    <p className ="Email"> Email: </p>
    <input type="text" className = "email" 
     value={this.state.email} 
     onChange={this.setEmail}/>
        <button className="login-account" onClick={this.validateUser}>Log in</button>
        <p className ="or-message"> Don't have an account?</p>
        <button className="create-account" onClick={event =>  window.location.href="/createacct-page"}>Create an Account</button>
      </div>
      </div>      
       );
  }
}
   
    
export default SignInPage;