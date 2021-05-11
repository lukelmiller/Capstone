import React, { Component } from 'react';
import './StatsTable.css'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { buildStyles } from 'react-circular-progressbar';
import { Database } from '../util/Database';
import { colors } from '../util/objectColors';

class StatsTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Archived_Items: [], loading: false
    }
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.getItems();
  }

  getItems = async () => {
    const db = new Database();
    try {
      const body = await db.get();
      let archivedItems = [];
      if (body.items.length > 0)
        if (body.items.filter(item => item.itemArchived === 1)) {
          let archivedItems = [];
          archivedItems = body.items.filter(item => item.itemArchived === 1)
          this.setState({ archiveLength: archivedItems.length })
          this.setState({ allLength: body.items.length })
        }

      if (body.items.filter(item => item.itemArchived === 0)) {
        for (var i = 0; i < body.items.length; i++) {
          var obj = body.items[i];
          for (var prop in obj) {
            if (obj.hasOwnProperty(prop) && obj[prop] !== null && !isNaN(obj[prop])) {
              obj[prop] = +obj[prop];
              var output = body.items.reduce((arr, d, x) => {
                var keys = Object.keys(d);
                keys.forEach((k) => {
                  if (!arr[k]) arr[k] = 0;
                  arr[k] = arr[k] + d[k];
                })
                return arr;
              }, {});
            }
          }
          this.setState({ Lost: ((output.itemPurchaseAmount - output.itemWorth) / (output.itemPurchaseAmount)).toFixed(2) })
          this.setState({ depreciation: Math.round(output.itemPurchaseAmount) })
          this.setState({ currentWorth: Math.round(output.itemWorth) })
          this.setState({ allLength: body.items.length })
        }
        if (body.items.filter(item => item.itemSellAmount !== null)) {
          let soldItems = [];
          soldItems = body.items.filter(item => item.itemSellAmount !== null)
          this.setState({ soldLength: soldItems.length })

        }

        if (body.items.filter(item => item.itemRecurringPaymentAmount !== null)) {
          this.setState({ Costper: output.itemRecurringPaymentAmount.toFixed(2) })

        }
      }
      this.setState({ Archived_Items: archivedItems });
      this.render();
      this.setState({ loading: false });
    }
    catch (error) {
      console.log('Error pulling data', error);
    }

  }

  renderTableHeader() {
    return this.state.Headers.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>
    })
  }

  render() {

    const percentage = 100;
    return (
      <div>
        { this.state.loading ?
          <div className="loading-container-stats"> <div className="form-load-symbol" /></div>
          : null}
          <div style={{display: '-webkit-inline-box'}}>
        <div className="Circle1" style={{ width: '14%', height: '13%' }}>
          <CircularProgressbar
            value={percentage}
            text={`$${Math.round(this.state.currentWorth / this.state.allLength) * 100}`}
            styles={buildStyles({
              // Rotation of path and trail, in number of turns (0-1)
              rotation: 0.25,
              // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
              strokeLinecap: 'butt',
              // Text size
              textSize: '16px',
              // How long animation takes to go from one percentage to another, in seconds
              pathTransitionDuration: 0.5,
              // Can specify path transition in more detail, or remove it entirely
              // pathTransition: 'none',
              // Colors
              // pathColor: `rgba(14, 126, 146, ${percentage / 100})`,
              pathColor: colors.object[0],
              textColor: colors.label,
              trailColor: colors.fill,
              backgroundColor: colors.background,
            })}
          />
          <p className="Circle_1"> Net Worth </p>
        </div>
        <div className="Circle2" style={{ width: '14%', height: '13%' }}>
          <CircularProgressbar
            value={(this.state.depreciation - this.state.currentWorth) / 100}
            text={`$${(this.state.depreciation - this.state.currentWorth)}`}
            styles={buildStyles({
              // Rotation of path and trail, in number of turns (0-1)
              rotation: 0.25,
              // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
              strokeLinecap: 'butt',
              // Text size
              textSize: '16px',
              // How long animation takes to go from one percentage to another, in seconds
              pathTransitionDuration: 0.5,
              // Can specify path transition in more detail, or remove it entirely
              // pathTransition: 'none',
              // Colors
              // pathColor: `rgba(200, 200, 200, ${(this.state.depreciation - this.state.currentWorth) / 100})`,
              pathColor: colors.object[1],
              textColor: colors.label,
              trailColor: colors.fill,
              backgroundColor: colors.background,
            })}
          />
          <p className="Circle_2"> Depreciation </p>
        </div>


        
        <div className="Circle3" style={{ width: '14%', height: '13%' }}>
          <CircularProgressbar
            value={(this.state.archiveLength / this.state.allLength) * 100}
            text={`${this.state.archiveLength}`}
            styles={buildStyles({
              // Rotation of path and trail, in number of turns (0-1)
              rotation: 0.25,
              // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
              strokeLinecap: 'butt',
              // Text size
              textSize: '16px',
              // How long animation takes to go from one percentage to another, in seconds
              pathTransitionDuration: 0.5,
              // Can specify path transition in more detail, or remove it entirely
              // pathTransition: 'none',
              // Colors
              // pathColor: `rgba(14, 126, 146, ${(this.state.archiveLength / this.state.allLength) * 100})`,
              pathColor: colors.object[2],
              textColor: colors.label,
              trailColor: colors.fill,
              backgroundColor: colors.background,
            })}
          />
          <p className="Circle_3">Archived Items </p>
        </div>
        <div className="Circle4" style={{ width: '14%', height: '13%' }}>
          <CircularProgressbar
            value={100}
            text={`${this.state.allLength}`}
            styles={buildStyles({
              // Rotation of path and trail, in number of turns (0-1)
              rotation: 0.25,
              // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
              strokeLinecap: 'butt',
              // Text size
              textSize: '16px',
              // How long animation takes to go from one percentage to another, in seconds
              pathTransitionDuration: 0.5,
              // Can specify path transition in more detail, or remove it entirely
              // pathTransition: 'none',
              // Colors
              // pathColor: `rgba(14, 126, 146, ${this.state.allLength})`,
              pathColor: colors.object[3],
              textColor: colors.label,
              trailColor: colors.fill,
              backgroundColor: colors.background,
            })}
          />
          <p className="Circle_4"> # All Items </p>
        </div>
        </div> 
        <div style={{display: '-webkit-inline-box'}}>
        <div className="Circle5" style={{ width: '14%', height: '13%' }}>
          <CircularProgressbar
            value={percentage}
            text={`$${this.state.depreciation}`}
            styles={buildStyles({
              // Rotation of path and trail, in number of turns (0-1)
              rotation: 0.25,
              // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
              strokeLinecap: 'butt',
              // Text size
              textSize: '16px',
              // How long animation takes to go from one percentage to another, in seconds
              pathTransitionDuration: 0.5,
              // Can specify path transition in more detail, or remove it entirely
              // pathTransition: 'none',
              // Colors
              // pathColor: `rgba(14, 126, 146, ${percentage / 100})`,
              pathColor: colors.object[4],
              textColor: colors.label,
              trailColor: colors.fill,
              backgroundColor: colors.background,
            })}
          />
          <p className="Circle_5"> Money Invested </p>
        </div>

        <div className="Circle6" style={{ width: '14%', height: '13%' }}>
          <CircularProgressbar
            value={this.state.soldLength}
            text={`${this.state.soldLength}`}
            styles={buildStyles({
              // Rotation of path and trail, in number of turns (0-1)
              rotation: 0.25,
              // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
              strokeLinecap: 'butt',
              // Text size
              textSize: '16px',
              // How long animation takes to go from one percentage to another, in seconds
              pathTransitionDuration: 0.5,
              // Can specify path transition in more detail, or remove it entirely
              // pathTransition: 'none',
              // Colors
              // pathColor: `rgba(14, 126, 146, ${percentage / 100})`,
              pathColor: colors.object[5],
              textColor: colors.label,
              trailColor: colors.fill,
              backgroundColor: colors.background,
            })}
          />
          <p className="Circle_6"> Items Sold </p>
        </div>

        <div className="Circle7" style={{ width: '14%', height: '13%' }}>
          <CircularProgressbar
            value={this.state.Lost * 100}
            text={`${this.state.Lost * 100}%`}
            styles={buildStyles({
              // Rotation of path and trail, in number of turns (0-1)
              rotation: 0.25,
              // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
              strokeLinecap: 'butt',
              // Text size
              textSize: '16px',
              // How long animation takes to go from one percentage to another, in seconds
              pathTransitionDuration: 0.5,
              // Can specify path transition in more detail, or remove it entirely
              // pathTransition: 'none',
              // Colors
              // pathColor: `rgba(14, 126, 146, ${percentage / 100})`,
              pathColor: colors.object[6],
              textColor: colors.label,
              trailColor: colors.fill,
              backgroundColor: colors.background,


            })}
          />
          <p className="Circle_7"> % Money Lost </p>
        </div>
        
        <div className="Circle8" style={{ width: '14%', height: '13%' }}>
          <CircularProgressbar
            value={this.state.Costper}
            text={`$${this.state.Costper}/Mo`}
            styles={buildStyles({
              // Rotation of path and trail, in number of turns (0-1)
              rotation: 0.25,
              // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
              strokeLinecap: 'butt',
              // Text size
              textSize: '16px',
              // How long animation takes to go from one percentage to another, in seconds
              pathTransitionDuration: 0.5,
              // Can specify path transition in more detail, or remove it entirely
              // pathTransition: 'none',
              // Colors
              // pathColor: `rgba(14, 126, 146, ${percentage / 100})`,
              pathColor: colors.object[7],
              textColor: colors.label,
              trailColor: colors.fill,
              backgroundColor: colors.background,
            })}
          />
          <p className="Circle_8"> Monthly Recurring Cost </p>
        </div>
        </div>
      </div>
    )
  }
}
export default StatsTable;