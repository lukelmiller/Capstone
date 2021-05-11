/* eslint-disable react/jsx-equals-spacing */
/* eslint-disable no-use-before-define */
import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons,MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Searchbar } from "react-native-paper";
import { colors } from '../util/colors';
import { Database } from "../util/Database";
import { renderContext } from "../screens/MainPage/mainPage";



const UpperTab = (props) => {
  const [showSearchBar,setshowSearchBar]=useState(false);
  const [search,setSearch]=useState("");
  const [loading, setLoading] = useState(false);
  const data = useContext(renderContext);


  let searchedList = [];

  
  const searchForData =()=>{
    if (data != null) {
      for (let i = 0; i < data.items.length; i++) {
        let searchString=JSON.stringify(data.items[i]);
        const lowerCaseSearch=search.toLowerCase();
        searchString=searchString.toLowerCase();
        if(searchString.includes(lowerCaseSearch)){
          searchedList.push(data.items[i]);
        } 
      } 
    }
    // console.log(data);
  }
  const searching=(text)=>{
    // console.log(text);
    setSearch(text);
  }
  const submitData=()=>{
    searchForData();
    setshowSearchBar(false);
    setSearch("");
    const finalSearch=searchedList;
    searchedList=[];
    // console.log(finalSearch);
    setLoading(false);
    props.itemsNavigate(finalSearch);
  }
    return (
      <View style={styles.container}>
        <View style={styles.buttonLeftStyle}>
          <TouchableOpacity
            onPress={props.nav}
          >
            {!showSearchBar?<Ionicons name="menu" size={30} color={colors.icon} />:undefined}
          </TouchableOpacity>
        </View>
        <View style={{alignItems:'center'}}>
          {!showSearchBar?<Text style={styles.textStyle}>{props.title}</Text>:undefined}
        </View>
        <View style={styles.buttonRightStyle}>
          <TouchableOpacity
            onPress={() => {
              setshowSearchBar(!showSearchBar);
              setLoading(true);
                }}
          >
            {showSearchBar? (
              <View style={styles.Searchbar}>
                <Searchbar 
                  style={styles.search} 
                  onChangeText={(text)=>searching(text)} 
                  onSubmitEditing={submitData}
                  value={search}
                  icon={()=> <MaterialCommunityIcons name='magnify' size={25} />}
                />
              </View>
          ) 
            :<MaterialCommunityIcons name='magnify' size={30} color={colors.icon} />}
            
          </TouchableOpacity>
        </View>
      </View>
    );
}
const styles = StyleSheet.create({
    Searchbar : {
      flexDirection:'row',
      justifyContent:'flex-end',
      alignItems:'flex-end'
    },
    search : {
      flexDirection:'row',
      justifyContent:'flex-end',
      alignItems:'flex-end',
      maxWidth:'98%',
      marginTop:'3%',
      marginRight: 0,
      marginLeft: 0,
      borderRadius: 12
      },
    container : {
        // flex:.1,
        height : "13%",
        backgroundColor : colors.theme,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'flex-end',
    },
    textStyle:{
        color: colors.title,
        fontSize: 20,
        fontWeight: "bold",
        height: 30,
        alignItems: "stretch",
    },
    buttonLeftStyle:{
      alignItems:'flex-start',
      padding:5,
      left:10,
    },
    buttonRightStyle:{
      alignItems:'flex-start',
      padding:5,
      right:10,
    }      
});
export default UpperTab;