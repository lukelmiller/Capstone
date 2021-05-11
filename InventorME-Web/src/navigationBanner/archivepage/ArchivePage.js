import React, { Component } from 'react';
import './ArchivePage.css';
import NavBanner from '../NavBanner.js';
import Table from '../Table.js'
class ArchivePage extends Component {
    

    render() {
      
        return (
            <div>
              <NavBanner/>
              <div style={{height: '100vh'}}>
              <Table/>
              </div>
            </div>          
          )
               
               
        
    }
}
    export default ArchivePage;