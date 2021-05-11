import React, { Component } from 'react';
import InventorLogo from '../images/InventorLogo.png';
import './NavBanner.css';
import OverlayMenu from 'react-overlay-menu';
import { Link } from "react-router-dom";
import FormPage from '../components/formPage/FormPage';
import { Auth } from 'aws-amplify';
import { MdSearch } from "react-icons/md";
import {IoIosMenu} from "react-icons/io";
import { Photo } from '../util/Photos';


class NavBanner extends Component {

    constructor(props) {
       super(props);
       this.state = { response: '', isOpen: false, showItemMenu: false, showProfileMenu: false, show: true, 
       firstName: '', userEmail: '',
       imageLoaded: false,
       profilePic: "",
       photoType: "image/jpg",
       style : {
        width : 150,
        height: 0,
        visibility: "hidden"
    }};
       this.toggleMenu = this.toggleMenu.bind(this);
       this.toggleItemMenu = this.toggleItemMenu.bind(this);
       this.profileMenu = React.createRef();
       this.handleClickOutside = this.handleClickOutside.bind(this);
       this.showProfileMenu = this.showProfileMenu.bind(this);
       this.closeProfileMenu = this.closeProfileMenu.bind(this);
       this.logoutUser = this.logoutUser.bind(this);
       this.toast = React.createRef();
    }

    async componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        try{
            const data = await Auth.currentUserInfo();
            this.setState({ firstName: data.attributes.name })
            this.setState({ userEmail: data.attributes.email })
        }catch(error){
            console.log(error);
            this.toastMessage("Error: No user found, please sign in again");
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

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    componentDidUpdate = () => {     
        const { callChildReset } = this.props;
        if (callChildReset > 0) {
            this.showProfileMenu()
        }
    }

    handleClickOutside(event) {
        if (this.profileMenu && !this.profileMenu.current.contains(event.target)) {
            this.closeProfileMenu();
        }
    }

    toggleMenu() {
       this.setState({ isOpen: !this.state.isOpen });
    }

    toggleItemMenu() {
        this.setState({ showItemMenu: !this.state.showItemMenu });
    }

    showProfileMenu() {
        const style = { width : 150, height: 140 };
        this.setState({ style });
    }

    closeProfileMenu() {
        const style = { width : 150, height: 0, visibility: "hidden" };
        this.setState({ style });
    }
    async logoutUser(){
        try {
            await Auth.signOut();
            console.log("User Signed Out");
            window.location.href="/signin-page";
          }
          catch (error) {
            console.log("user sign out error");
            alert("ERROR: Could Not Sign Out, Please Try Again...");
          }
        
        
    }

    toastMessage = (message) => {
        this.toast.current.openToast(message);
      };

    render() {
        return (
        <div style={{marginBottom: '3%'}}>
            <div className="NavBanner">
                <div className="menu">
                    <IoIosMenu onClick={this.toggleMenu} style={{color: "white", textDecoration: 'none'}} size={50}/>
                </div>
                <div className="title">
                    <div className="inventor-title">InventorME</div>
                    <img src={InventorLogo} className="inventor-logo" alt="" />
                </div>
                <div style={{ backgroundColor: 'white', borderRadius: '1em', textAlign: 'center', marginTop: '2em', cursor: 'pointer', fontSize: '0.6em', height: '3em', width: '7.2em'}}>
                    <div className="add-item-button" onClick={() => this.toggleItemMenu()}>Add Item</div>
                </div>
                <div className="search-icon">
                    <Link to = "/search-page" style={{ textDecoration: 'none' }}>
                        <MdSearch style={{color: "white", textDecoration: 'none'}} size={40}/>
                    </Link>
                </div>

                <div className="profile" onClick={this.showProfileMenu}>
                    <img style={{borderRadius: "40em", height: "2.5em", width: "2.5em", 'paddingTop': '0.4em'}} alt="" src={`data:${this.state.photoType};base64,${this.state.profilePic}`} />
                    <p className="firstName-profile"> {this.state.firstName}</p>
                </div>
                </div>
            <OverlayMenu
            open={this.state.isOpen}
            onClose={this.toggleMenu}>
                <div className="side-menu">
                    <Link to = "/items-page" style={{ textDecoration: 'none' }}>
                    <div><h1 className="menu-text">Items</h1></div>
                    </Link>
                    <Link to = "/collections" style={{ textDecoration: 'none' }}>
                    <div><h1 className="menu-text">Collections</h1></div>
                    </Link>
                    <Link to = "/folderpage" style={{ textDecoration: 'none' }}>
                    <div><h1 className="menu-text">Folders</h1></div>
                    </Link>
                    <Link to ="/archivepage" style={{ textDecoration: 'none' }}>
                    <div><h1 className="menu-text">Archive</h1></div>
                    </Link>
                    <Link to = "/statspage" style={{ textDecoration: 'none' }}>
                    <div><h1 className="menu-text">Stats</h1></div>
                    </Link>
                    <Link to="/about-page" style={{ textDecoration: 'none' }}>
                    <div><h1 className="menu-text">About</h1></div>
                    </Link>
                </div>
            </OverlayMenu>            
            <div>
               <div ref={this.profileMenu}
                className = "overlay"
                style = {this.state.style}>
                    <Link to="/profile-page" style={{ textDecoration: 'none' }}>
                    <div><p>Profile</p></div>
                    </Link>
                    <div onClick={this.logoutUser} style={{cursor: 'pointer'}}>
                        <p>Logout</p>
                    </div>
                </div>
          </div>
          <div>
            { this.state.showItemMenu ?
            <div style={{marginTop: '3%'}}><FormPage toggleItemMenu = {this.toggleItemMenu} userEmail={this.state.userEmail} addItem = {true}/></div> : null }
          </div>
        </div>
        );
    }
}

export default NavBanner;