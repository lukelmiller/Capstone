import React, { Component } from 'react';
import './AboutPage.css';
import InventorLogo from '../../images/InventorMeLogo.png';
import NavBanner from '../NavBanner';

class AboutPage extends Component{

    render(){
    return (
        <div>
          <NavBanner/>
          <div className="home-title">
            <img src={InventorLogo} className="center" alt="" />
            <p className = 'primary'>InventorMe is a new, revolutionary management app that prioritizes and streamlines efficiency for
            digital photos, documents, and other items that you need to oversee.
            You now have the power to manage all of your belongings with just the tip of your fingers.  </p>
          </div>
        </div>
      );
    }
}

export default AboutPage;