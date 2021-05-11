import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Alert, ActivityIndicator} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import styles from "./scanItem.style";
import { colors } from '../../util/colors';


const axios = require('axios');

let upc = '';
let info;
const ScanItem = (props) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [info, setInfo]=useState('');
  const [noConnection,setNoConnection]= useState(true);


  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);


  const handleBarCodeScanned = async ({ type, data }) => {
    console.log("getter called")
    setScanned(true);
    upc = data;
    console.log("data", data);
    console.log(info);
    await getter();
    console.log(info);
    console.log(noConnection);
    
    if(info!==undefined){
      console.log("We are here");
      if(info.request_info.success){
        Alert.alert(`${info.product.title} \n Do you want to add this item?`,' ',
            [
              {
                text:'Cancel' ,
                onPress:()=>{
                  console.log("###########CANCEL######################");
                  setScanned(false);
                },
              },
              {
                text:'Yes' ,
                onPress:()=>{
                  const description=info.product.description.replace(/['"]+/g, '');
                  const title=info.product.title.replace(/['"]+/g, '');
                  const category= info.product.categories[0].name.replace(/['"]+/g, '');
                  const link= info.product.categories[1].link.replace(/['"]+/g, '');
                  const price= info.product.buybox_winner.price.value;
                  const serialNumber = info.request_parameters.gtin;
                  const itemCreated=true;
                  const scanned = true;
                  console.log(description);
                  console.log(title);
                  console.log(category);
                  console.log(price);
                  // send image
                  props.navigation.navigate("EditItemScreen",{description,title,category,price,itemCreated,serialNumber,scanned,link});
                },
              },
            ],
            {
              calcelable:false,
            },
          );
        }else{
          Alert.alert('The Item Was not found ',' ',
            [
              {
                text:'Retry' ,
                onPress:()=>{
                  
                  console.log("###########CANCEL######################");
                  console.log(`Info ${ info.request_info.success }`);
                },
              },
              {
                text:'Add Item Manually' ,
                onPress:()=>{
                  const itemCreated = false;
                  const scannedItem = false;
                  props.navigation.navigate("addItem",scannedItem);
                },
              },
            ],  
            {
              cancelable:false,
            }
          );    
        }
    }else{
      Alert.alert('There seems to be a problem with your connection, please make sure you have an internet connection and try again',"",
          [
            {
              text:'Ok' ,
              onPress:()=>{
                setScanned(false);
              },
            },
          ]  
    );
    } 
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }


  // set up the request parameters
  const params = {
    api_key: "06216450BA1844B4A86EC6E8C8D8DE05",
    type: "product",
    amazon_domain: "amazon.com",
    gtin: upc,
    device: "mobile"
  }


  const getter = async () => {
    setLoading(true);
    setNoConnection(true);
    const queryURL = `${"https://api.rainforestapi.com/request" + "?api_key="}${  params.api_key  }&type=product&amazon_domain=amazon.com&gtin=${  upc}`;
    
     await axios.get(queryURL)
    .then(response => {
      // print the JSON response from Rainforest API
      // console.log(response.data,0,2);
      info = response.data,0,2;
    }).catch(error => {
      console.log(error);
      info=undefined;
  });
  setLoading(false);
  }
  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && loading&& <ActivityIndicator size="large" color={colors.accent} /> }
      {scanned && loading&& <Text style={styles.text}>Please Wait</Text>}
    </View>
  );
}

export default ScanItem;