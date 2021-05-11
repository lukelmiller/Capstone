import React, { Component } from 'react';
import './itemDetailsView.css';
import FormPage from '../formPage/FormPage';
import ToastMessage from '../toastMessage/ToastMessage';
import { Database } from '../../util/Database';
import { Photo } from '../../util/Photos';
import moment from 'moment';

class ItemDetailsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: this.props.editItem[0], detailsView: true, itemName: '', buyDate: null, sellDate: null, checkForm: false,
            baseURL: "https://3cv3j619jg.execute-api.us-east-2.amazonaws.com/test/inventorme-items", archive: false,
            unarchive: false, delete: false, loading: false,
            imageLoaded: false, imageData: ''
        }
        this.toggleItemMenu = this.toggleItemMenu.bind(this);
        this.toast = React.createRef();
    }

    componentDidMount() {
        if (this.state.item.itemSellDate)
            this.setState({ sellDate: moment.utc(this.state.item.itemSellDate).format("MMMM Do YYYY") })
        if (this.state.item.itemBuyDate)
            this.setState({ buyDate: moment.utc(this.state.item.itemBuyDate).format("MMMM Do YYYY") })
        if (this.props.archive)
            this.setState({ archive: true })
        this.setState({ itemName: this.state.item.itemName })
        this.getPhoto();
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
    getPhoto = async () => {
        if (this.state.imageURL !== '') {
            const photo = new Photo();
            try {
                const image = await photo.get(this.state.item.itemPhotoURL);
                this.setState({ imageData: image, imageLoaded: true });
            } catch (error) {
                console.log("Load Image error");
            }
        }
    }

    toastMessage = (message) => {
        this.toast.current.openToast(message);
    };

    toggleItemMenu() {
        this.setState({ detailsView: !this.state.detailsView });
    }

    checkForm() {
        this.setState({ checkForm: true });
    }

    toggleArchiveMenu() {
        this.setState({ unarchive: true });
    }

    closeUnarchiveForm() {
        this.setState({ unarchive: false });
    }

    toggleDeleteMenu() {
        this.setState({ delete: true });
    }

    closeDeleteForm() {
        this.setState({ delete: false });
    }

    deleteArchiveItem() {
        let payload = {
            itemID: this.state.item.itemID
        }
        this.setState({ loading: true })
        this.deleteItem(payload).catch(res => {
            this.getItems().then(res => {
                let items = [];
                if (res.length > 0) {
                    items = res.filter(item => item.itemArchived === 1)
                    items = items.filter(item => item.itemID === payload.itemID);
                }
                if (items.length === 0) {
                    this.toastMessage("Deleted Successfully.")
                    this.reloadPage();
                } else {
                    this.setState({ loading: false })
                    this.toastMessage("Error: Failed to delete item.")
                }
            })
        });
    }

    unarchiveItem() {
        this.setState({ loading: true })
        let buyDate = null;
        let sellDate = null;
        if (this.state.item.itemBuyDate)
            buyDate = moment.utc(this.state.item.itemBuyDate).format("YYYY-MM-DD")
        if (this.state.item.itemSellDate)
            sellDate = moment.utc(this.state.item.itemSellDate).format("YYYY-MM-DD")

        let itemPutPayload = {
            userEmail: this.quotes(this.state.item.userEmail),
            itemID: this.state.item.itemID,
            itemCategory: this.quotes(this.state.item.itemCategory),
            itemName: this.quotes(this.state.item.itemName),
            itemPhotoURL: this.quotes(this.state.item.itemPhotoURL),
            itemSerialNum: this.state.item.itemSerialNum,
            itemPurchaseAmount: this.quotes(this.state.item.itemPurchaseAmount),
            itemWorth: this.quotes(this.state.item.itemWorth),
            itemReceiptPhotoURL: this.quotes(this.state.item.itemReceiptPhotoURL),
            itemManualURL: this.quotes(this.state.item.itemManualURL),
            itemSellDate: this.quotes(sellDate),
            itemBuyDate: this.quotes(buyDate),
            itemLocation: this.quotes(this.state.item.itemLocation),
            itemNotes: this.quotes(this.state.item.itemNotes),
            itemSellAmount: this.quotes(this.state.item.itemSellAmount),
            itemRecurringPaymentAmount: this.quotes(this.state.item.itemRecurringPaymentAmount),
            itemEbayURL: this.quotes(this.state.item.itemEbayURL),
            itemTags: this.quotes(this.state.item.itemTags),
            itemArchived: 0,
            itemFolder: this.quotes(this.state.item.itemFolder)
        }

        this.put(itemPutPayload).catch(res => {
            this.getItems().then(res => {
                let items = [];
                if (res.length > 0) {
                    items = res.filter(item => item.itemArchived === 1)
                    items = items.filter(item => item.itemID === itemPutPayload.itemID);
                }

                if (items.length === 0) {
                    this.toastMessage("Unarchived Successfully.")
                    this.reloadPage();
                } else {
                    this.setState({ loading: false })
                    this.toastMessage("Error: Failed to unarchive.")
                }
            })
        });
    }

    closeCheckForm() {
        this.setState({ checkForm: false });
    }

    reloadPage = () => {
        setInterval(() => {
            window.location.reload(true)
        }, 2000);
    }

    quotes(value) {
        if (!value || value === "null" || value.length < 1)
            return null;
        if (!isNaN(value))
            return value;
        return "'" + value + "'";
    }

    archiveItem() {
        this.setState({ loading: true })
        let buyDate = null;
        let sellDate = null;
        if (this.state.item.itemBuyDate)
            buyDate = moment.utc(this.state.item.itemBuyDate).format("YYYY-MM-DD")
        if (this.state.item.itemSellDate)
            sellDate = moment.utc(this.state.item.itemSellDate).format("YYYY-MM-DD")

        let itemPutPayload = {
            userEmail: this.quotes(this.state.item.userEmail),
            itemID: this.state.item.itemID,
            itemCategory: this.quotes(this.state.item.itemCategory),
            itemName: this.quotes(this.state.item.itemName),
            itemPhotoURL: this.quotes(this.state.item.itemPhotoURL),
            itemSerialNum: this.state.item.itemSerialNum,
            itemPurchaseAmount: this.quotes(this.state.item.itemPurchaseAmount),
            itemWorth: this.quotes(this.state.item.itemWorth),
            itemReceiptPhotoURL: this.quotes(this.state.item.itemReceiptPhotoURL),
            itemManualURL: this.quotes(this.state.item.itemManualURL),
            itemSellDate: this.quotes(sellDate),
            itemBuyDate: this.quotes(buyDate),
            itemLocation: this.quotes(this.state.item.itemLocation),
            itemNotes: this.quotes(this.state.item.itemNotes),
            itemSellAmount: this.quotes(this.state.item.itemSellAmount),
            itemRecurringPaymentAmount: this.quotes(this.state.item.itemRecurringPaymentAmount),
            itemEbayURL: this.quotes(this.state.item.itemEbayURL),
            itemTags: this.quotes(this.state.item.itemTags),
            itemArchived: 1,
            itemFolder: this.quotes(this.state.item.itemFolder)
        }

        this.put(itemPutPayload).catch(res => {
            this.getItems().then(res => {
                let items = [];
                if (res.length > 0) {
                    items = res.filter(item => item.itemArchived === 0)
                    items = items.filter(item => item.itemID === itemPutPayload.itemID);
                }
                if (items.length === 0) {
                    this.toastMessage("Archived Successfully.")
                    this.reloadPage();
                } else {
                    this.setState({ loading: false })
                    this.toastMessage("Error: Failed to archive.")
                }
            })
        });

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

    deleteItem = async (id) => {
        var deleteData = {
            method: 'DELETE',
            body: JSON.stringify(id),
            headers: { 'Content-Type': 'application/json' }
        }

        const response = await fetch(this.state.baseURL, deleteData);
        return response.status;
    }

    openInNewTab = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }

    render() {
        return (
            <div>
                <ToastMessage ref={this.toast} />
                { this.state.detailsView ?
                    <div className="add-edit-container">

                        {this.state.loading ?
                            <div className="loading-container"> <div className="form-load-symbol" /></div>
                            : null}
                        <div className="form-header">
                            <h2 style={{ marginLeft: '40%', width: '48%' }}>Item Details</h2>
                            <h2 style={{ cursor: 'pointer' }} onClick={() => this.props.toggleDetailsView()}>X</h2>
                        </div>

                        <div className="form-container">

                            {this.state.checkForm ?
                                <div className="check-box">
                                    <p className="check-title">Are you sure?</p>
                                    <div style={{ marginTop: '2.5em', display: 'block', textAlign: 'center' }}>
                                        <button className="yes-button" onClick={() => this.archiveItem()}>Yes</button>
                                        <button className="no-button" onClick={() => this.closeCheckForm()}>No</button>
                                    </div>
                                </div> : null}

                            {this.state.unarchive ?
                                <div className="check-box">
                                    <p className="check-title">Are you sure?</p>
                                    <div style={{ marginTop: '2.5em', display: 'block', textAlign: 'center' }}>
                                        <button className="yes-button" onClick={() => this.unarchiveItem()}>Yes</button>
                                        <button className="no-button" onClick={() => this.closeUnarchiveForm()}>No</button>
                                    </div>
                                </div> : null}

                            {this.state.delete ?
                                <div className="check-box">
                                    <p className="check-title">Are you sure?</p>
                                    <div style={{ marginTop: '2.5em', display: 'block', textAlign: 'center' }}>
                                        <button className="yes-button" onClick={() => this.deleteArchiveItem()}>Yes</button>
                                        <button className="no-button" onClick={() => this.closeDeleteForm()}>No</button>
                                    </div>
                                </div> : null}

                            <div style={{ marginLeft: '1em', display: 'block' }}>
                                <div className="item-image-container" ref={this.scrollRef}>
                                    <input type="file" ref={this.hiddenFileInput} onChange={this.onImageChange} style={{ display: 'none' }} />
                                    {this.state.imageLoaded ? <img style={{ height: "9em", width: "9em", 'paddingTop': '0.4em' }} alt="No img found" src={`data:image/jpg;base64,${this.state.imageData}`} /> : ""}
                                </div>
                                <div>
                                    <h2>Name</h2>
                                    <p className="input-box21">{this.state.item.itemName}</p>
                                </div>

                                <div style={{ display: 'inline-flex', width: '100%' }}>
                                    <div style={{ display: 'block' }}>
                                        <h2>Collection</h2>
                                        <p className="input-box22">{this.state.item.itemCategory}</p>
                                    </div>
                                    <div style={{ display: 'block', marginLeft: '18em' }}>
                                        <h2>Item Location</h2>
                                        <p className="input-box22">{this.state.item.itemLocation}</p>
                                    </div>
                                </div>

                                <div style={{ display: 'inline-flex', width: '100%' }}>
                                    <div style={{ display: 'block' }}>
                                        <h2>Item Worth</h2>
                                        <p className="input-box32">${this.state.item.itemWorth}</p>
                                    </div>
                                    <div style={{ display: 'block', marginLeft: '5em' }}>
                                        <h2>Purchase Amount</h2>
                                        <p className="input-box32">${this.state.item.itemPurchaseAmount}</p>
                                    </div>
                                    <div style={{ display: 'block', marginLeft: '7em' }}>
                                        <h2>Sell Amount</h2>
                                        <p className="input-box32">${this.state.item.itemSellAmount}</p>
                                    </div>
                                </div>

                                <div style={{ display: 'inline-flex', width: '100%' }}>
                                    <div style={{ display: 'block' }}>
                                        <h2>Serial Number</h2>
                                        <p className="input-box32">{this.state.item.itemSerialNum}</p>
                                    </div>
                                    <div style={{ display: 'block', marginLeft: '5em' }}>
                                        <h2>Recurring Payment</h2>
                                        <p className="input-box32">{this.state.item.itemRecurringPaymentAmount}</p>
                                    </div>
                                    <div style={{ display: 'block', marginLeft: '7em' }}>
                                        <h2>Item Folder</h2>
                                        <p className="input-box32">{this.state.item.itemFolder}</p>
                                    </div>
                                </div>

                                <div style={{ display: 'inline-flex', width: '100%' }}>
                                    <div style={{ display: 'block' }}>
                                        <h2>Item Receipt</h2>
                                        <p className="input-box32">{this.state.item.itemReceiptPhotoURL}</p>
                                    </div>
                                    <div style={{ display: 'block', marginLeft: '5em' }}>
                                        <h2>Item Manual Url</h2>
                                        <p className="input-box32">{this.state.item.itemManualURL}</p>
                                    </div>
                                    <div style={{ display: 'block', marginLeft: '7em' }}>
                                        <h2>Online Url</h2>
                                        <p style={{ color: '#0e7e92', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => this.openInNewTab(this.state.item.itemEbayURL)}>{this.state.item.itemEbayURL}</p>
                                    </div>
                                </div>

                                <div style={{ display: 'inline-flex', width: '100%', paddingBottom: '1em' }}>
                                    <div style={{ display: 'block', width: '11.7em' }}>
                                        <h2>Buy Date</h2>
                                        <p style={{ color: 'white' }}>{this.state.buyDate}</p>
                                    </div>
                                    <div style={{ display: 'block', marginLeft: '4.5em' }}>
                                        <h2>Sell Date</h2>
                                        <p style={{ color: 'white' }}>{this.state.sellDate}</p>
                                    </div>
                                </div>

                                <div style={{ display: 'inline-flex', width: '100%', height: '13em' }}>
                                    <div style={{ display: 'block' }}>
                                        <h2>Tags</h2>
                                        <div className="input-tag2">
                                            <ul className="input-tag-tags">
                                                {this.state.item.itemTags}
                                            </ul>
                                        </div>
                                    </div>
                                    <div style={{ display: 'block', marginLeft: '16.5em' }}>
                                        <h2>Notes</h2>
                                        <p className="input-notes2">{this.state.item.itemNotes}</p>
                                    </div>
                                </div>
                                <div style={{ paddingTop: '0em', paddingBottom: '2em', paddingLeft: '5em' }}>
                                    {this.state.archive ? <div>
                                        <button className="unarchive-button" onClick={() => this.toggleArchiveMenu()}>Unarchive</button>
                                        <button className="delete-button" onClick={() => this.toggleDeleteMenu()}>Delete</button></div>
                                        :
                                        <div>
                                            <button className="save-button" onClick={() => this.toggleItemMenu()}>Edit</button>
                                            <button className="archive-button" onClick={() => this.checkForm()}>Archive</button></div>}
                                </div></div>
                        </div>
                    </div> :
                    <FormPage addItem={false} item={this.state.item} toggleItemMenu={this.toggleItemMenu} userEmail={this.state.item.userEmail} />
                }
            </div>
        );
    }
}

export default ItemDetailsView;