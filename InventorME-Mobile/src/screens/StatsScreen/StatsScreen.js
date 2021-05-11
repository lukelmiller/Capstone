import React, { Component } from "react";
import { render } from "react-dom";
import { View, Text, FlatList } from "react-native";
import ProgCircle from '../../Components/ProgCircle';
import ProgressCircle from 'react-native-progress-circle';
import styles from "../../screens/StatsScreen/StatsScreen.style";
import BoxFolderComponent from "../../Components/BoxFolderComponent";
import { Database } from '../../util/Database';
import { colors } from '../../util/colors';
import { ScrollView } from "react-native-gesture-handler";


class StatsScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      Archived_Items: [],
      loading: false,
      currentWorth: 0,
      allLength: 1,
      depreciation: 0,
      archiveLength: 0,
      fullPercent: 100,
      soldLength: 0,
      Lost: 0
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
    console.log(this.state);
    return this.state.Headers.map((key, index) => {
      return <View key={index}>{key.toUpperCase()}</View>
    })
  }

  render() {

    if (!this.state.loading) {
      return (
        //{this.state.loading ?

        <ScrollView style={styles.page}>
          <View style={styles.container}>


            <View style={styles.stat}>
              <ProgCircle
                percent={this.state.fullPercent}
                text={`$${Math.round(this.state.currentWorth)}`}
                color={colors.objects[0]}
              />
              <Text style={styles.label}> {'Net Worth '}</Text>
            </View>

            <View style={styles.stat}>
              <ProgCircle
                percent={this.state.Lost * 100}
                text={`$${(this.state.depreciation - this.state.currentWorth)}`}
                color={colors.objects[1]}
              />
              <Text style={styles.label}> {'Depreciation'} </Text>
            </View>

            <View style={styles.stat}>
              <ProgCircle
                percent={(this.state.archiveLength / this.state.allLength) * 100}
                text={`${this.state.archiveLength}`}
                color={colors.objects[2]}
              />
              <Text style={styles.label}>{'Archived Items'} </Text>
            </View>

            <View style={styles.stat} >
              <ProgCircle
                percent={100}
                text={`${this.state.allLength}`}
                color={colors.objects[3]}
              />
              <Text style={styles.label}> {'# All Items'} </Text>
            </View>
            <View style={styles.stat}>
              <ProgCircle
                percent={this.state.fullPercent}
                text={`$${this.state.depreciation}`}
                color={colors.objects[4]}
              />
              <Text style={styles.label}> {'Money Invested'} </Text>
            </View>
            <View style={styles.stat}>
              <ProgCircle
                percent={(this.state.soldLength / this.state.allLength) * 100}
                text={`${this.state.soldLength}`}
                color={colors.objects[5]}
              />
              <Text style={styles.label}> {'Items Sold'} </Text>
            </View>

            <View style={styles.stat}>
              <ProgCircle
                percent={this.state.Lost * 100}
                text={`${this.state.Lost * 100}%`}
                color={colors.objects[6]}
              />
              <Text style={styles.label}> {'% Money Lost'} </Text>
            </View>

            <View style={styles.stat}>
              <ProgCircle
                percent={ 100}
                text={`$${this.state.Costper}/Mo`}
                color={colors.objects[7]}
              />
              <Text style={styles.label}> {'Monthly Recurring Cost'} </Text>
            </View>
          </View>
        </ScrollView>

      )
    } else {
      return (
        <Text>Loading...</Text>
      )
    }
  }

}
export default StatsScreen;