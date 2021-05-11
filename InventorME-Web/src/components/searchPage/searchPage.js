import React, { Component } from 'react';
import { Database } from '../../util/Database';
import upload from '../../images/upload-button.png'
import './searchPage.css';
import ItemDetailsView from '../itemDetailsView/itemDetailsView';
import BackButton from '../../images/back-button.png'
import { Link } from 'react-router-dom';
import { Photo } from '../../util/Photos';

class searchPage extends Component {
    constructor(props) {
        super(props);
        this.state = {search: '',  editItem: false, loading: false, Current_Items: [], All_Items: [],
        Headers: ['Name', 'Collection', 'Notes', 'Image']}

        this.toggleDetailsView = this.toggleDetailsView.bind(this);
    }

    componentDidMount(){
        this.setState({loading: true})
        this.getItems();
    }
    
    getItems = async () => {
        const db = new Database();
        try {
            const body = await db.get();
            let items = [];
            if(body.items.length > 0)
              items = body.items.filter(item => item.itemArchived === 0)
            this.setState({ Current_Items: items, All_Items: items});
            this.render();
            this.setState({loading: false});
            this.getPhotos();
        }
        catch (error) {
            console.log('Error pulling data', error);
        }
    }
    getPhotos = async () => {
      const photo = new Photo();
      for (const item of this.state.Current_Items) {
        item.imageFound = false;
        if (item.itemPhotoURL !== null) {
          try {
            const data = await photo.get(item.itemPhotoURL);
            item.photoData = data;
            if (data !== "Error executing file IO")
              item.imageFound = true;
          } catch (error) {
            console.log("error finding image");
          }
        }
      }
      this.setState({ imageLoaded: true });
    }

    searchBar = (event) => {
        let input = event.target.value;
        this.setState({search: input});
  
        if(input.length < 1) {
          this.setState({Current_Items: this.state.All_Items});
        } else {
          let itemNames = this.state.All_Items;
          let itemCollections = this.state.All_Items;
          let itemFolders = this.state.All_Items;
          let itemNotes = this.state.All_Items;
          let itemTags = this.state.All_Items;
  
          itemNames = itemNames.filter(item => item.itemName.toUpperCase().includes(input.toUpperCase()));
          itemCollections = itemCollections.filter(item => {
            if(item.itemCategory) {
              return item.itemCategory.toUpperCase().includes(input.toUpperCase())
            } return null});
          itemFolders = itemFolders.filter(item => {
            if(item.itemFolder) {
              return item.itemFolder.toUpperCase().includes(input.toUpperCase())
            } return null;
          });
          itemNotes = itemNotes.filter(item => {
            if(item.itemNotes) {
              return item.itemNotes.toUpperCase().includes(input.toUpperCase())
            } return null;
          });
          itemTags = itemTags.filter(item => {
            if(item.itemTags) {
              return item.itemTags.toUpperCase().includes(input.toUpperCase())
            } return null
          });
          
          let combinedItems = itemNames.concat(itemCollections, itemFolders, itemNotes, itemTags)
          combinedItems = combinedItems.filter((item,index)=>{
            return (combinedItems.indexOf(item) === index)
         })
          this.setState({Current_Items: combinedItems});
        }
    }

    toggleDetailsView() {
        this.setState({ editItem: !this.state.editItem });
    }

    filterItemByID(ID) {
        this.setState({item: this.state.Current_Items.filter(item => item.itemID === ID), editItem: true});
    }

    renderTableHeader(){
        return this.state.Headers.map((key,index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

render() {
    return (
    <div style={{overflowY: 'scroll', height: '100vh'}}>
        { this.state.loading ?
        <div className="load-container"> <div className="load-symbol"/></div>
        : null }
        <div className="profile-banner">
        <Link to="/items-page" style={{ textDecoration: 'none' }}>
          <img src={BackButton} className="profile-back" alt="back" />
        </Link> 
        <h2>InventorME</h2>   
        </div>
        { this.state.editItem ? 
        <div style={{marginTop: '2%'}}><ItemDetailsView toggleDetailsView = {this.toggleDetailsView} editItem = {this.state.item}/></div> : null }

        <div className="search-overlay">
            <input className="input-search" onChange={e => this.searchBar(e)} placeholder="Search by name, notes, collection, folder, tags" value={this.state.search}/> 
        </div> 

        <div>
                <table id= 'Current_Items' style={{ marginBottom: '12em', cursor: 'pointer'}}>
                <tbody>
                <tr>{this.renderTableHeader()}</tr>
                { this.state.Current_Items ? this.state.Current_Items.map((Current_Item) => (
                <tr key = {Current_Item.itemID} onClick={() => this.filterItemByID(Current_Item.itemID)}>
                <td>{Current_Item.itemName}</td> 
                <td>{Current_Item.itemCategory}</td>
                <td>{Current_Item.itemNotes}</td>
                <td>{ Current_Item.imageFound ?  <img src={`data:image/jpg;base64,${Current_Item.photoData}`} alt="" width="40" height="30"/> :
                    <img src={upload} alt="" width="40" height="30"/>}</td>   
                </tr>
                )) : null}
                </tbody>
                </table>
        </div>         
    </div>
    );
  }
}

export default searchPage;