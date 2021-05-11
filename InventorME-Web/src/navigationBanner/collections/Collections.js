import React, { Component } from 'react';
import './Collections.css';

import NavBanner from '../NavBanner.js';
import { AiFillPlusCircle } from "react-icons/ai";
import { Database } from '../../util/Database';
import { colors } from '../../util/objectColors';
import FormPage from '../../components/formPage/FormPage';
import { Auth } from 'aws-amplify';
import arrow from '../../images/arrow.png'
import CollectionPage from './CollectionPage.js';
import BackButton from '../../images/back-button.png'

var color = 0;

class Collections extends Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [],
      editItem: false,
      item: null,
      showItemMenu: false,
      collection: '',
      toggledetails: false,
      userEmail: '', loading: false
    }
    this.toggleTableView = this.toggleTableView.bind(this);
    this.closeItemMenu = this.closeItemMenu.bind(this);
    this.scrollRef = React.createRef();
  }
  async componentDidMount() {
    this.setState({ loading: true });
    this.getItems();
    try {
      const data = await Auth.currentUserInfo();
      this.setState({ userEmail: data.attributes.email })
      this.setState({ loading: false });
    }
    catch (error) {
      console.log('could not find user :(', error);
      window.location.href = "/signin-page";
    }
  }

  filterItemByID(ID, collectionName) {
    this.setState({ item: this.state.items[collectionName].filter(item => item.itemID === ID), editItem: true });
  }
  //------------------------------------
  toggleTableView(prop) {
    this.setState({ toggledetails: !this.state.toggledetails, collection: prop });
    this.scrollRef.current.scrollIntoView()
  }



  //----------------------------------------------
  closeItemMenu() {
    this.setState({ showItemMenu: false });
  }

  openItemMenu(prop) {
    this.setState({ showItemMenu: true, collection: prop });
  }

  getItems = async () => {
    const db = new Database();
    try {
      const body = await db.get();

      let collectionItems = [];
      if (body.items.length > 0)
        collectionItems = body.items.filter(item => item.Collections !== null)
      collectionItems = collectionItems.filter(item => item.itemArchived === 0)

      var groupBy = function (xs, key) {
        return xs.reduce(function (rv, x) {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {});
      };

      var groubedByTeam = groupBy(collectionItems, 'itemCategory')
      this.setState({ items: groubedByTeam })
      this.setState({ collectionTittle: Object.keys(groubedByTeam) })

      this.render();
      this.setState({ loading: false });
    }
    catch (error) {
      console.log('Error pulling data', error);
    }
  }


  // this is where the boxes are created, we want to put the arrow button in the bottom left corner
  renderFolders = (props) => {
    return (
      <div className='area' style={{ backgroundColor: props.color }}>
        <AiFillPlusCircle onClick={() => this.openItemMenu(props.tittle)} className={'icon'} />
        <img className="c_arrow" alt="forward arrow" src={arrow} onClick={() => this.toggleTableView(props.tittle)} />
        <div className='textTittle'>{props.tittle}</div>
        <div className='textAmount'>{props.amount}</div>
      </div>
    );
  }

  getColors() {
    color++;
    return colors.object[color % 8];
  }

  render() {
    return (
      <div className='container' ref={this.scrollRef}>
        <NavBanner />
        { this.state.loading ?
          <div className="loading-container"> <div className="form-load-symbol" /></div> : null}
        { this.state.showItemMenu ?
          <div style={{ marginTop: '3%' }}><FormPage toggleItemMenu={this.closeItemMenu} userEmail={this.state.userEmail} collection={this.state.collection} addCollection={true} /></div> : null}
        {this.state.toggledetails ?

          <div> <CollectionPage name={this.state.collection} /> <img className="backer" alt="Go Back" src={BackButton} onClick={event => window.location.href = '/collections'} /></div> :

          <div className='container2'>
            {this.state.collectionTittle ? this.state.collectionTittle.map((collTittle) => (
              <this.renderFolders tittle={collTittle} amount={this.state.items[collTittle].length} color={this.getColors()} />
            )) : null}
          </div>
        }</div>
    );
  }
}

export default Collections;