import React, { Component } from 'react'
import './StatsPage.css'
import NavBanner from '../NavBanner.js'
import StatsTable from '../StatsTable.js'

class StatsPage extends Component {
    render() {
        return (
        <div>
            <NavBanner/>
                <div>
                <div style={{ height: '87vh', width:'100%', textAlign: 'center'}}>
                <StatsTable/>
                </div>
            </div>
              </div>  
        );
      }
    }
 
  

export default StatsPage;