import React, { Component } from 'react';
import ItemDetailsView from '../components/itemDetailsView/itemDetailsView';
import archived from '../images/archived.png'
import './Table.css';
import { Database } from '../util/Database';

class Table extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Archived_Items: [], loading: false,
            Headers: ['Name', 'Collection', 'Notes', 'Archived'], item: [], editItem: false
        }
        this.toggleDetailsView = this.toggleDetailsView.bind(this);
        this.getItems = this.getItems.bind(this);
    }

    componentDidMount() {
        this.setState({ loading: true })
        this.getItems();

    }

    toggleDetailsView() {
        this.setState({ editItem: !this.state.editItem });
    }

    getItems = async () => {
        const db = new Database();
        try {
            const body = await db.get();
            let archivedItems = [];
            if (body.items.length > 0)
                archivedItems = body.items;
            this.setState({ Archived_Items: archivedItems.filter(item => item.itemArchived === 1)});
            this.render();
            this.setState({loading: false});
        }
        catch (error) {
            console.log('Error pulling data', error);
        }
    }

    filterItemByID(ID) {
        this.setState({ item: this.state.Archived_Items.filter(item => item.itemID === ID), editItem: true });
    }

    renderTableHeader() {
        return this.state.Headers.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    render() {
        return (
            <div>
                { this.state.editItem ?
                    <ItemDetailsView toggleDetailsView={this.toggleDetailsView} editItem={this.state.item} archive={true} /> :
                    null}
                <h1 id='title'>Archive</h1>
                { this.state.loading ?
                    <div className="loading-container"> <div className="form-load-symbol" /></div>
                    : null}
                <table id='Archived_Items' style={{ marginBottom: '12em', cursor: 'pointer' }}>
                    <tbody>
                        <tr>{this.renderTableHeader()}</tr>
                        {this.state.Archived_Items ? this.state.Archived_Items.map((Archived_Item) => (
                            <tr key={Archived_Item.itemName} onClick={() => this.filterItemByID(Archived_Item.itemID)}>
                                <td>{Archived_Item.itemName}</td>
                                <td>{Archived_Item.itemCategory}</td>
                                <td>{Archived_Item.itemNotes}</td>
                                <td><img src={archived} alt="" width="40" height="20" /></td>
                            </tr>
                        )) : null}
                    </tbody>
                </table>
            </div>
        )
    }

}
export default Table;