import React, { Component } from 'react';
import './ProfilePage.css';
import ReactRoundedImage from "react-rounded-image"
import UploadButton from '../../images/upload-button.png'
import PhoneInput from 'react-phone-input-2'
import ToastMessage from '../../components/toastMessage/ToastMessage';
import BackButton from '../../images/back-button.png'
import { Link } from "react-router-dom";
import { Auth } from 'aws-amplify';
import { Photo } from '../../util/Photos';


class ProfilePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false, profile: true,
      userID: null,
      firstName: '',
      lastName: '',
      userEmail: '',
      userProfilePic: '',
      userPhone: '',
      phoneFormat: '',
      oldPass: '',
      newPass: '',
      passwordForm: false,
      imageLoaded: false,
      profilePic: "",
      photoType: "image/jpg"
    }
    this.toggleForm = this.toggleForm.bind(this);
    this.saveProfile = this.saveProfile.bind(this);
    this.validateUser = this.validateUser.bind(this);
    this.hiddenFileInput = React.createRef();
    this.toast = React.createRef();
  }

  async componentDidMount() {
    this.setState({ loading: true });

    try {
      const data = await Auth.currentUserInfo();
      this.setState({ response: data })
      this.setState({ firstName: data.attributes.name })
      this.setState({ lastName: data.attributes.family_name })
      this.setState({ userEmail: data.attributes.email })
      this.setState({ userPhone: data.attributes.phone_number })
      this.setState({ phoneFormat: this.formatPhoneNumber(data.attributes.phone_number) })
      this.setState({ loading: false });
    }
    catch (error) {
      console.log('could not find user :(', error);
      window.location.href = "/signin-page";
    }
    try{
      const photo = new Photo();
      const photoURL = String(this.state.userEmail) + ".jpg";
      const image = await photo.get(photoURL);
      this.setState({profilePic: image});
      this.setState({imageLoaded: true});
    }catch (error) {
      console.log('could not find image', error);
    }
  }

  formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      var intlCode = (match[1] ? '+1 ' : '')
      return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
    }
    return null
  }

  changePassword() {
    const error = "Attempt limit exceeded, please try after some time.";
    if (this.validatePass()) {
      this.setState({ loading: true });
      Auth.currentAuthenticatedUser()
        .then(user => {
          return Auth.changePassword(user, this.state.oldPass, this.state.newPass);
        })
        .then(data => {
          this.toastMessage("Password changed successfully")
          this.reloadPage();
        })
        .catch(err => {
          this.setState({ loading: false });
          if (err.message === error)
            this.toastMessage("Failed to save. Please try again at a later time.")
          else
            this.toastMessage("Incorrect old password")
        });
    }
  }

  closePasswordForm() {
    this.setState({ passwordForm: false });
  }

  openPasswordForm() {
    this.setState({ passwordForm: true });
  }

  toggleForm() {
    this.setState({ profile: !this.state.profile });
  }

  firstNameOnChange = (event) => {
    this.setState({ firstName: event.target.value });
  }

  oldPassOnChange = (event) => {
    this.setState({ oldPass: event.target.value });
  }

  newPassOnChange = (event) => {
    this.setState({ newPass: event.target.value });
  }

  lastNameOnChange = (event) => {
    this.setState({ lastName: event.target.value });
  }

  phoneOnChange = (event) => {
    var cleaned = ('' + event).replace(/\D/g, '');
    cleaned = '+' + cleaned;
    cleaned = cleaned.substring(0, 12);
    this.setState({ userPhone: cleaned });
    var format = '';
    if (cleaned.length < 6)
      format = '+1 (' + cleaned.substring(2, 5);
    else if (cleaned.length < 9)
      format = '+1 (' + cleaned.substring(2, 5) + ') ' + cleaned.substring(5, 8);
    else
      format = '+1 (' + cleaned.substring(2, 5) + ') ' + cleaned.substring(5, 8) + '-' + cleaned.substring(8, 12);
    this.setState({ phoneFormat: format });
  }

  onImageChange = async (event) => {
    if (event.target.files && event.target.files[0]) {
        const photo = new Photo();
        const file = event.target.files[0];
        const pName = String(this.state.userEmail) + ".jpg";
        await photo.uploadFile(file, pName, file.type);
    }
  }

  upperCheck(str) {
    if (str.toLowerCase() === str) {
      return false;
    }
    return true;
  }

  lowerCheck(str) {
    if (str.toUpperCase() === str) {
      return false;
    }
    return true;
  }

  alphCheck(str) {
    var regex = /[a-zA-Z]/g;
    return regex.test(str);
  }

  numCheck(str) {
    var regex = /\d/g;
    return regex.test(str);
  }

  phoneCheck(num) {
    var regex = /^(\+1\d{3}\d{3}\d{4}$)/g
    return regex.test(num);
  }

  emailCheck(str) {
    var regex = /^[a-zA-Z]+[0-9_.+-]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/g
    return regex.test(str);
  }

  validatePass() {
    if (this.state.newPass.length < 8) {
      this.toastMessage("Error: Password Must Be At Least 8 Characters Long");
      return false;
    } else if (!this.alphCheck(this.state.newPass)) {
      this.toastMessage("Error: Password Must Contain Letter");
      return false;
    } else if (!this.upperCheck(this.state.newPass)) {
      this.toastMessage("Error: Password Must Contain One Upper-Case Letter");
      return false;
    } else if (!this.lowerCheck(this.state.newPass)) {
      this.toastMessage("Error: Password Must Contain One Lower-Case Letter");
      return false;
    } else if (!this.numCheck(this.state.newPass)) {
      this.toastMessage("Error: Password Must Contain One Number");
      return false;
    } else {
      return true;
    }

  };

  validateUser() {
    if (this.state.firstName === "") {
      this.toastMessage("Error: Please Type First Name");
    } else if (this.state.lastName === "") {
      this.toastMessage("Error: Please Type Last Name");
    } else if (!this.phoneCheck(this.state.userPhone)) {
      this.toastMessage("Error: Please Type A Valid Phone Number");
    }
    else {
      return true;
    }
    return false;
  };


  setToastStyle(style) {
    this.setState({ toastStyle: style });
    clearInterval(this.start);
  }

  closeToast = () => {
    this.start = setInterval(() => {
      const toastStyle = { width: '0%', height: '12%' };
      this.setToastStyle(toastStyle);
    }, 3000);
  }

  reloadPage = () => {
    setInterval(() => {
      window.location.reload(true)
    }, 2000);
  }


  saveProfile = async (event) => {
    // const { getSession } = this.context;

    if (!this.validateUser()) {
      event.preventDefault();
    } else {
      this.setState({ loading: true });
      event.preventDefault();
      const attributes = {
        'name': this.state.firstName,
        'phone_number': this.state.userPhone,
        'family_name': this.state.lastName
      }
      try {
        const user = await Auth.currentAuthenticatedUser();
        await Auth.updateUserAttributes(user, attributes);

        this.toastMessage('Saved Successfully! ㋡');
        this.reloadPage();
      } catch (error) {
        this.setState({ loading: false });
        this.toastMessage('Error: Failed to save profile.');
      }
    }
  }

  toastMessage = (message) => {
    this.toast.current.openToast(message);
  };

  handleClick = () => {
    this.hiddenFileInput.current.click();
  };

  render() {
    return (
      <div>
        { this.state.loading ?
          <div className="load-container"> <div className="load-symbol" /></div>
          : null}
        <div className="profile-banner">
          <Link to="/items-page" style={{ textDecoration: 'none' }}>
            <img src={BackButton} className="profile-back" alt="back" />
          </Link>
          <h2>InventorME</h2>
        </div>
        { this.state.passwordForm ?
          <div className="check-box2">
            <p className="check-title">Change Password</p>
            <div style={{ marginTop: '2.5em', display: 'block' }}>
              <p className="edit-oldPass"> Old Password: </p>
              <input className="edit-oldPass-input" type="text" onChange={this.oldPassOnChange} value={this.state.oldPass} />
              <p className="edit-newPass"> New Password: </p>
              <input className="edit-newPass-input" type="text" onChange={this.newPassOnChange} value={this.state.newPass} />
            </div>
            <button className="savePass-button" onClick={() => this.changePassword()}>Save</button>
            <button className="cancelPass-button" onClick={() => this.closePasswordForm()}>Cancel</button>
          </div> : null}
        <div className="profile-container">
          <ToastMessage ref={this.toast} />

          {this.state.profile ?
            <div>
              <div style={{ display: 'block', width: '100%', height: '20%' }}>
                
                <div className="profile-image-container">
                {this.state.imageLoaded ? 
                <ReactRoundedImage
                roundedColor='#333333'
                imageWidth="170"
                imageHeight="160"
                roundedSize="1"
                image={`data:${this.state.photoType};base64,${this.state.profilePic}`} />
                :
                  ""
                }
                  
                </div>
                <h1 className="profile-name" style={{ display: 'inline-flex' }}>
                  <div style={{ paddingRight: '1em' }}>{this.state.firstName}</div>
                  <div>{this.state.lastName}</div>
                </h1>
              </div>

              <div style={{ display: 'inline-flex', marginTop: '2%', width: '100%', height: '25%' }}>
                <div className="edit-email-input">
                  <h3 className="edit-email"> Email: </h3>
                  <p className="user-email-value">{this.state.userEmail}</p>
                </div>
                <div className="edit-phone-input">
                  <h3 className="edit-phone"> Phone Number: </h3>
                  <p className="phone-number-value">{this.formatPhoneNumber(this.state.userPhone)}</p>
                </div>
              </div>

              <div style={{ display: 'inline-flex', width: '100%', height: '5%', marginTop: '4em' }}>
                <button className="update-profile" onClick={() => this.toggleForm()}>UPDATE PROFILE</button>
                <button className="change-pass" onClick={() => this.openPasswordForm()}>CHANGE PASSWORD</button>
              </div>
            </div>
            :
            <form style={{ height: '100vh' }}>
              <div style={{ display: 'inline-flex', width: '100%', height: '20%' }}>
                <div className="profile-image-container">
                  <input type="file" accept="image/jpg,image/jpeg" ref={this.hiddenFileInput} onChange={this.onImageChange} style={{ display: 'none' }} />
                  <ReactRoundedImage
                    roundedColor='#333333'
                    imageWidth="170"
                    imageHeight="160"
                    roundedSize="1"
                    image={`data:${this.state.photoType};base64,${this.state.profilePic}`} />
                  <img onClick={this.handleClick} src={UploadButton} className="file-upload" alt="" />
                </div>
              </div>

              <div style={{ display: 'inline-flex', width: '100%', height: '20%', marginLeft: '31%', paddingTop: '2em' }}>
                <div className="edit-first-input">
                  <p className="edit-first"> First Name: </p>
                  <input className="first-input" type="text" onChange={this.firstNameOnChange} value={this.state.firstName} />
                </div>
                <div className="edit-last-input">
                  <p className="edit-last"> Last Name: </p>
                  <input type="text" className="last-input" value={this.state.lastName} onChange={this.lastNameOnChange} />
                </div>
              </div>

              <div style={{ display: 'inline-flex', width: '100%', height: '22%' }}>
                <div class="edit-phone-input2">
                  <p class="edit-phone"> Phone Number: </p>
                  <PhoneInput country='us' countryCodeEditable={false} withCountryCallingCode={true} class="phone-input" value={this.state.phoneFormat} onChange={this.phoneOnChange} />
                </div>
              </div>

              {/* <p class = "Password2"> Password: </p>
            <input type="password"  input class = "password2" onChange={this.handleChange}/> */}
              <div style={{ display: 'inline-flex', width: '100%', height: '5%' }}>
                <button type='submit' className="save-profile" onClick={this.saveProfile}>SAVE</button>
                <button className="cancel-profile" onClick={() => window.location.reload(true)}>CANCEL</button>
              </div>
            </form>
          }
        </div>
      </div>
    );
  }
}

export default ProfilePage;