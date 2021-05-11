/* eslint-disable no-use-before-define */
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { colors } from '../util/colors';

const BoxFolderComponent = props => {

  const type = props.boxType;
  boxHeight = useWindowDimensions().height;

  if (type == 1) {
    return (
      
      <TouchableOpacity 
        style={{...styles.Box1, ...props.style, height : boxHeight / 5}}
        onPress = {props.itemsNavigate}
    
      >
        <View style={{padding: "2%"}}>
          <TouchableOpacity
            onPress={props.addPageNavigate}
          >
            <AntDesign name='pluscircle' size={30} color={colors.icon} style={{marginLeft: "80%"}} />
          </TouchableOpacity>
        </View>
       
        <View style={styles.boxText1}>
          <Text style={styles.textStyle1}>{props.title}</Text>
        </View>
        <View style={styles.itemCountContainer}>
          <Text style={styles.itemsText}>
            {props.numItems}
          </Text>
        </View>
        </TouchableOpacity>
        
    );
  }

  else {
    return (
      <TouchableOpacity
        style = {{...styles.Box2, ...props.style, height : boxHeight / 7}}
        onPress = {props.detailsNavigate}
      >
        <View style = {styles.boxText2}>
          <Text style = {styles.textStyle2} numberOfLines = {1}>{props.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
    itemsText:{
      color: colors.objectsText,
    },
    itemCountContainer:{
      flexDirection:'row-reverse',
      padding : "5%"
    }, 
    Box1 : {
      //flex:1,
      margin : '2%',
      width : '46%',
      backgroundColor : colors.background,
      padding:5,
      borderRadius:20,
    },
    Box2 : {
      //margin : "2%",
      width : "100%",
      borderBottomColor : colors.text,
      borderBottomWidth : 2
    }, 
    boxText1 :{
      flex:1,
      // justifyContent:'center',
      // alignItems:"center"
    },
    boxText2 :{
      flex:1,
      justifyContent : 'center',
      alignItems : "center",
      backgroundColor: colors.background
    },
    textStyle1 :{
      fontSize:25,
      paddingTop: 9,
      color: colors.objectsText
    },
    textStyle2 : {
      fontSize : 30,
      color : colors.text,
      backgroundColor: colors.background
    }
});
export default BoxFolderComponent;