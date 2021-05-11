import React, { Component } from 'react';
import './FormPage.css';
import UploadButton from '../../images/upload-button.png'
import ToastMessage from '../toastMessage/ToastMessage';
import DatePicker from 'react-date-picker';
import CurrencyInput from 'react-currency-input-field';
import moment from 'moment';
import { Database } from '../../util/Database';
import { Photo } from '../../util/Photos';

class FormPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: {}, barcodeNumber: '',
      imageURL: '', userEmail: this.props.userEmail, name: '',
      category: '', itemLocation: '',
      itemWorth: '', purchaseAmount: '', sellAmount: '',
      serialNum: '', recurringAmount: '',
      itemReceipt: '', itemManual: '', onlineUrl: '',
      buyDate: '', sellDate: '',
      tags: [], notes: '',
      itemCreationDate: '', itemArchived: '', addItem: this.props.addItem, addCollection: false, itemFolder: '',
      showForm: false, loading: false, itemID: '', imageData: '', imageLoaded: false,
      baseURL: "https://3cv3j619jg.execute-api.us-east-2.amazonaws.com/test/inventorme-items"
    };
    this.hiddenFileInput = React.createRef();
    this.scrollRef = React.createRef()
    this.toast = React.createRef();
    this.onChangeBuyDate = this.onChangeBuyDate.bind(this);
    this.onChangeSellDate = this.onChangeSellDate.bind(this);
    this.onImageChange = this.onImageChange.bind(this);
    this.getPhoto = this.getPhoto.bind(this);
  }

  componentDidMount() {

    if (this.props.item) {
      let buyDate = "";
      let sellDate = "";
      if (this.props.item.itemPurchaseAmount)
        this.setState({ purchaseAmount: this.props.item.itemPurchaseAmount })
      if (this.props.item.itemSellAmount)
        this.setState({ sellAmount: this.props.item.itemSellAmount })
      if (this.props.item.itemRecurringPaymentAmount)
        this.setState({ recurringAmount: this.props.item.itemRecurringPaymentAmount })
      if (this.props.item.itemWorth)
        this.setState({ itemWorth: this.props.item.itemWorth })
      if (this.props.item.itemBuyDate) {
        buyDate = new Date(this.props.item.itemBuyDate)
        buyDate.setDate(buyDate.getDate() + 1)
      }
      if (this.props.item.itemSellDate) {
        sellDate = new Date(this.props.item.itemSellDate);
        sellDate.setDate(sellDate.getDate() + 1)
      }
      if (this.props.item.itemTags)
        this.setState({ tags: this.props.item.itemTags.split(',') })
      if (this.props.item.itemPhotoURL) {
        this.setState({ imageURL: this.props.item.itemPhotoURL });
        this.getPhoto(this.props.item.itemPhotoURL);
      }
      if (this.props.item.itemSerialNum)
        this.setState({ serialNum: this.props.item.itemSerialNum })
      if (this.props.item.itemReceiptPhotoURL)
        this.setState({ itemReceipt: this.props.item.itemReceiptPhotoURL })
      if (this.props.item.itemManualURL)
        this.setState({ itemManual: this.props.item.itemManualURL })
      if (this.props.item.itemLocation)
        this.setState({ itemLocation: this.props.item.itemLocation })
      if (this.props.item.itemNotes)
        this.setState({ notes: this.props.item.itemNotes })
      if (this.props.item.itemEbayURL)
        this.setState({ onlineUrl: this.props.item.itemEbayURL })

      this.setState({
        category: this.props.item.itemCategory,
        name: this.props.item.itemName,
        sellDate: sellDate,
        buyDate: buyDate,
        itemFolder: this.props.item.itemFolder,
        itemID: this.props.item.itemID
      })
    }
    if (!this.props.addItem)
      this.setState({ showForm: true })
    if (this.props.addCollection)
      this.setState({ showForm: true, addItem: true, addCollection: true })
    if (this.props.collection)
      this.setState({ category: this.props.collection })
  }

  getItems = async () => {
    const db = new Database();
    try {
      const body = await db.get();
      let items = null;
      if (body.items.length > 0) {
        items = body.items
      }
      return items;
    }
    catch (error) {
      console.log('Error pulling data', error);
      return null;
    }
  }

  getPhoto = async (url) => {
   if (this.state.imageURL !== '') {
      const photo = new Photo();
      try {
        const image = await photo.get(this.state.imageURL);
        this.setState({ imageData: image, imageLoaded: true });
      } catch (error) {
        console.log("Load Image error", error);
      }
    } else if (url !== null) {
      const photo = new Photo();
      try {
        const image = await photo.get(url);
        this.setState({ imageData: image, imageLoaded: true });
      } catch (error) {
        console.log("Load Image error", error);
      }
    }
  }


  searchBarcodeItem() {
    this.getBarcodeItem().then(res => {
      if (Object.keys(res).length === 0) {
        this.toastMessage('Item not found. Please try again.')
      } else {
        this.setState({
          response: res, tags: res.tags, name: res.name, category: res.category,
          imageURL: res.imageURL, serialNum: this.state.barcodeNumber,
          itemWorth: res.price, onlineUrl: res.onlineUrl
        });
        this.showForm(true);
      }
      this.setState({ loading: false })
    }).catch(err => {
      console.log(err)
      this.setState({ loading: false })
      this.toastMessage('Failed to search for item.')
    })
  }

  getBarcodeItem = async () => {
    this.setState({ loading: true })
    var data = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }
    const response = await fetch('/api/getBarcodeItem?code=' + this.state.barcodeNumber, data);
    const body = await response.json();
    if ((response.status === 200) || (response.status === 304)) {
      console.log('body ', body)
      return body;
    }
    else {
      console.log(body.message);
      this.setState({ loading: false })
      this.toastMessage('Failed to search for item.')
    }
  };

  onChange = (event) => {
    const attribute = event.target.getAttribute('name');
    this.setState({ [attribute]: event.target.value });
  }

  onNumberChange = (event) => {
    const attribute = event.target.getAttribute('name');
    const format = /^[0-9\b]+$/;
    if (event.target.value === '' || format.test(event.target.value)) {
      this.setState({ [attribute]: event.target.value })
    }
  }

  toastMessage = (message) => {
    this.toast.current.openToast(message);
  };


  inputKeyDown = (e) => {
    const val = e.target.value;
    if (e.key === 'Enter' && val) {
      if (this.state.tags.find(tag => tag.toLowerCase() === val.toLowerCase())) {
        return;
      }
      this.setState({ tags: [...this.state.tags, val] });
      this.tagInput.value = null;
    }
  }

  removeTag = (i) => {
    const newTags = [...this.state.tags];
    newTags.splice(i, 1);
    this.setState({ tags: newTags });
  }

  onChangeBuyDate(event) {
    this.setState({ buyDate: event });
  }

  onChangeSellDate(event) {
    this.setState({ sellDate: event });
  }

  showForm() {
    this.setState({ showForm: true });
  }

  cancelForm() {
    // this.scrollRef.current.scrollIntoView()
    // if(!this.state.addItem || this.state.addCollection)
    this.props.toggleItemMenu();
    this.setState({
      showForm: true, imageURL: '', name: '', category: '', itemLocation: '', itemWorth: '', purchaseAmount: '', sellAmount: '',
      serialNum: '', recurringAmount: '', itemReceipt: '', itemManual: '', onlineUrl: '', barcodeNumber: '',
      buyDate: '', sellDate: '', tags: [], notes: ''
    });
  }

  handleClick = () => {
    this.hiddenFileInput.current.click();
  };

  onDollarChange = (value, name) => {
    this.setState({ [name]: value });
  }

  onImageChange = async (event) => {
    if (event.target.files && event.target.files[0]) {
      const photo = new Photo();
      const file = event.target.files[0];
      const pName = await photo.generateNewItemName("jpg");
      await photo.uploadFile(file, pName, file.type);
      this.setState({ imageURL: pName });
      this.getPhoto();
    }
  }

  quotes(value) {
    if (!value || value === "null" || value.length < 1)
      return null;
    if (!isNaN(value))
      return value;
    return "'" + value + "'";
  }

  validatePayload(item) {
    if (item.itemName === null) {
      this.toastMessage("Error: Please Type Item Name");
    } else if (item.itemCategory === null) {
      this.toastMessage("Error: Please Type Item Collection");
    } else if (item.itemFolder === null) {
      this.toastMessage("Error: Please Type Item Folder");
    }
    else {
      return true;
    }
    this.setState({ loading: false })
    return false;
  };

  saveItem() {
    this.setState({ loading: true })
    let buyDate = null;
    let sellDate = null;
    if (this.state.buyDate)
      buyDate = moment(this.state.buyDate).format("YYYY-MM-DD")
    if (this.state.sellDate)
      sellDate = moment(this.state.sellDate).format("YYYY-MM-DD")

    let itemPutPayload = {
      userEmail: this.quotes(this.state.userEmail),
      itemID: this.state.itemID,
      itemCategory: this.quotes(this.state.category),
      itemName: this.quotes(this.state.name),
      itemPhotoURL: this.quotes(this.state.imageURL),
      itemSerialNum: this.quotes(this.state.serialNum),
      itemPurchaseAmount: this.quotes(this.state.purchaseAmount),
      itemWorth: this.quotes(this.state.itemWorth),
      itemReceiptPhotoURL: this.quotes(this.state.itemReceipt),
      itemManualURL: this.quotes(this.state.itemManual),
      itemSellDate: this.quotes(sellDate),
      itemBuyDate: this.quotes(buyDate),
      itemLocation: this.quotes(this.state.itemLocation),
      itemNotes: this.quotes(this.state.notes),
      itemSellAmount: this.quotes(this.state.sellAmount),
      itemRecurringPaymentAmount: this.quotes(this.state.recurringAmount),
      itemEbayURL: this.quotes(this.state.onlineUrl),
      itemTags: this.quotes(this.state.tags.join()),
      itemArchived: 0,
      itemFolder: this.quotes(this.state.itemFolder)
    }

    let itemPostPayload = {
      userEmail: this.quotes(this.state.userEmail),
      itemCategory: this.quotes(this.state.category),
      itemName: this.quotes(this.state.name),
      itemPhotoURL: this.quotes(this.state.imageURL),
      itemSerialNum: this.quotes(this.state.serialNum),
      itemPurchaseAmount: this.quotes(this.state.purchaseAmount),
      itemWorth: this.quotes(this.state.itemWorth),
      itemReceiptPhotoURL: this.quotes(this.state.itemReceipt),
      itemManualURL: this.quotes(this.state.itemManual),
      itemSellDate: this.quotes(sellDate),
      itemBuyDate: this.quotes(buyDate),
      itemLocation: this.quotes(this.state.itemLocation),
      itemNotes: this.quotes(this.state.notes),
      itemSellAmount: this.quotes(this.state.sellAmount),
      itemRecurringPaymentAmount: this.quotes(this.state.recurringAmount),
      itemEbayURL: this.quotes(this.state.onlineUrl),
      itemTags: this.quotes(this.state.tags.join()),
      itemArchived: 0,
      itemFolder: this.quotes(this.state.itemFolder)
    }
    if (this.state.addItem) {
      if (this.validatePayload(itemPostPayload)) {
        this.post(itemPostPayload).then(res => {
          if ((res === 200) || (res === 0)) {
            this.toastMessage("Saved Successfully.")
            this.reloadPage();
          } else {
            this.setState({ loading: false })
            this.toastMessage("Error: Failed to save.")
          }
        });
      }
    }
    else {
      if (this.validatePayload(itemPutPayload)) {
        this.put(itemPutPayload).catch(res => {
          this.getItems().then(res => {
            let items = [];
            if (res.length > 0) {
              items = res.filter(item => item.itemArchived === 0)
              items = items.filter(item => item.itemID === itemPutPayload.itemID);
            }
            if (items.length === 1) {
              this.toastMessage("Saved Successfully.")
              this.reloadPage();
            } else {
              this.setState({ loading: false })
              this.toastMessage("Error: Failed to save.")
            }
          });
        })
      }
    }
  }

  reloadPage = () => {
    setInterval(() => {
      window.location.reload(true)
    }, 2000);
  }

  post = async (item) => {
    var postData = {
      method: 'POST', mode: 'no-cors',
      body: JSON.stringify(item),
      headers: { 'Content-Type': 'application/json' }
    }
    const response = await fetch(this.state.baseURL, postData);
    return response.status;
  }

  put = async (item) => {
    var putData = {
      method: 'PUT',
      body: JSON.stringify(item),
      headers: { 'Content-Type': 'application/json' }
    }

    const response = await fetch(this.state.baseURL, putData);
    return response.status;
  }

  render() {
    return (
      <div className="add-edit-container">
        { this.state.loading ?
          <div className="loading-container"> <div className="form-load-symbol" /></div>
          : null}
        <ToastMessage ref={this.toast} />
        { this.state.addItem ?
          <div className="form-header">
            <h2 style={{ marginLeft: '40%', width: '48%' }}>Add Item</h2>
            <h2 style={{ cursor: 'pointer' }} onClick={() => this.props.toggleItemMenu()}>X</h2>
          </div> :
          <div className="form-header">
            <h2 style={{ marginLeft: '40%', width: '48%' }}>Edit Item</h2>
            <h2 style={{ cursor: 'pointer' }} onClick={() => this.props.toggleItemMenu()}>X</h2>
          </div>
        }
        { this.state.showForm ?
          <div className="form-container">
            <div style={{ marginLeft: '1em', display: 'block' }}>
              <div className="item-image-container" ref={this.scrollRef}>
                <input type="file" accept="image/jpg,image/jpeg" ref={this.hiddenFileInput} onChange={this.onImageChange} style={{ display: 'none' }} />
                {this.state.imageLoaded ? <img style={{ height: "9em", width: "9em", 'paddingTop': '0.4em' }} alt="Upload item img" src={`data:image/jpg;base64,${this.state.imageData}`} /> : ""}
                <img onClick={this.handleClick} src={UploadButton} className="item-upload" alt="" />
              </div>
              <div>
                <h2>Name*</h2>
                <input className="input-box" name="name" value={this.state.name} onChange={this.onChange} type="text" placeholder="Name" />
              </div>

              <div style={{ display: 'inline-flex', width: '100%' }}>
                <div style={{ display: 'block' }}>
                  <h2>Collection*</h2>
                  <input className="input-box2" name="category" value={this.state.category} onChange={this.onChange} type="text" placeholder="Collection" />
                </div>
                <div style={{ display: 'block', marginLeft: '18.5em' }}>
                  <h2>Item Location</h2>
                  <input type="text" name="itemLocation" className="input-box2" placeholder="Enter item location"
                    onChange={this.onChange} value={this.state.itemLocation} />
                </div>
              </div>

              <div style={{ display: 'inline-flex', width: '100%' }}>
                <div style={{ display: 'block' }}>
                  <h2>Item Worth</h2>
                  <CurrencyInput
                    prefix="$"
                    name="itemWorth"
                    className="input-box3"
                    placeholder="$0.00"
                    value={this.state.itemWorth}
                    decimalsLimit={2}
                    onValueChange={(value, name) => this.onDollarChange(value, name)} />
                </div>
                <div style={{ display: 'block', marginLeft: '5em' }}>
                  <h2>Purchase Amount</h2>
                  <CurrencyInput
                    prefix="$"
                    name="purchaseAmount"
                    className="input-box3"
                    placeholder="$0.00"
                    value={this.state.purchaseAmount}
                    decimalsLimit={2}
                    onValueChange={(value, name) => this.onDollarChange(value, name)} />
                </div>
                <div style={{ display: 'block', marginLeft: '7em' }}>
                  <h2>Sell Amount</h2>
                  <CurrencyInput
                    prefix="$"
                    name="sellAmount"
                    className="input-box3"
                    placeholder="$0.00"
                    value={this.state.sellAmount}
                    decimalsLimit={2}
                    onValueChange={(value, name) => this.onDollarChange(value, name)} />
                </div>
              </div>

              <div style={{ display: 'inline-flex', width: '100%' }}>
                <div style={{ display: 'block' }}>
                  <h2>Serial Number</h2>
                  <input type="text" pattern="[0-9]*" name="serialNum" className="input-box3" placeholder="123456789"
                    onChange={this.onNumberChange} value={this.state.serialNum} />
                </div>
                <div style={{ display: 'block', marginLeft: '5em' }}>
                  <h2>Recurring Payment</h2>
                  <CurrencyInput
                    prefix="$"
                    name="recurringAmount"
                    className="input-box3"
                    placeholder="$0.00"
                    value={this.state.recurringAmount}
                    decimalsLimit={2}
                    onValueChange={(value, name) => this.onDollarChange(value, name)} />
                </div>
                <div style={{ display: 'block', marginLeft: '7em' }}>
                  <h2>Item Folder*</h2>
                  <input type="text" name="itemFolder" className="input-box3" placeholder="Enter folder name"
                    onChange={this.onChange} value={this.state.itemFolder} />
                </div>
              </div>

              <div style={{ display: 'inline-flex', width: '100%' }}>
                <div style={{ display: 'block' }}>
                  <h2>Item Receipt</h2>
                  <input type="text" name="itemReceipt" className="input-box3" placeholder="Enter receipt url"
                    onChange={this.onChange} value={this.state.itemReceipt} />
                </div>
                <div style={{ display: 'block', marginLeft: '5em' }}>
                  <h2>Item Manual Url</h2>
                  <input type="text" name="itemManual" className="input-box3" placeholder="Enter manual url"
                    onChange={this.onChange} value={this.state.itemManual} />
                </div>
                <div style={{ display: 'block', marginLeft: '7em' }}>
                  <h2>Online Url</h2>
                  <input type="text" name="onlineUrl" className="input-box4" placeholder="Enter online url"
                    onChange={this.onChange} value={this.state.onlineUrl} />
                </div>
              </div>

              <div style={{ display: 'inline-flex', width: '100%', paddingBottom: '1em' }}>
                <div style={{ display: 'block', width: '11.7em' }}>
                  <h2>Buy Date</h2>
                  <DatePicker onChange={this.onChangeBuyDate}
                    value={this.state.buyDate} />
                </div>
                <div style={{ display: 'block', marginLeft: '5em' }}>
                  <h2>Sell Date</h2>
                  <DatePicker onChange={this.onChangeSellDate}
                    value={this.state.sellDate} />
                </div>
              </div>

              <h2>Tags</h2>
              <input className="input-tags-box" type="text" placeholder="Add tag" onKeyDown={this.inputKeyDown} ref={c => { this.tagInput = c; }} />
              <div className="input-tag">
                <ul className="input-tag-tags">
                  {this.state.tags.map((tag, i) => (
                    <li key={tag}>
                      {tag}
                      <button type="button" onClick={() => { this.removeTag(i); }}>x</button>
                    </li>))}
                </ul>
              </div>
              <div style={{ marginBottom: "2.5em" }}>
                <h2>Notes</h2>
                <textarea name="notes" className="input-notes" value={this.state.notes} type="textarea" onChange={this.onChange} placeholder="Notes" />
              </div>
              <div style={{ paddingTop: '2em', paddingBottom: '2em' }}>
                <button className="save-button" onClick={() => this.saveItem()}>Save</button>
                <button className="cancel-button" onClick={() => this.cancelForm()}>Cancel</button>
              </div>
            </div>
          </div>
          :
          <div>
            <div style={{ marginTop: '19em', marginLeft: '30%', width: '60%' }}>
              <input type="text" name="barcodeNumber" className="searchCode-box" placeholder="Enter barcode" onChange={this.onChange} value={this.state.barcodeNumber} />
              <button className="searchCode-button" onClick={() => this.searchBarcodeItem()} ref={this.hiddenInput}>Search</button>
              <p className="orText">or</p>
              <button className="enter-manually" onClick={() => this.showForm(true)}>Enter manually</button>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default FormPage;