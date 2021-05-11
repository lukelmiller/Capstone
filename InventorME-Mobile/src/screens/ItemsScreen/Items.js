import React from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import BoxFolderComponent from "../../Components/BoxFolderComponent";
import {colors} from "../../util/colors"
const Items = (props) => {

  let itemsToRender = [];
  const createItem = false;

  if (props.hasOwnProperty("itemsToRender")) {
    itemsToRender = props.itemsToRender;
  }
  else {
    itemsToRender = props.route.params.itemsToRender;
  }

    return (
      <FlatList
      style={{ backgroundColor: colors.background }}
        data = {itemsToRender}
        
        renderItem = {({item}) => (
          
              <BoxFolderComponent
                
                title = {item.itemName}
                detailsNavigate = {() => {props.navigation.navigate("EditItemScreen", {details : {item}},createItem)}}
              />
        )}
        keyExtractor = {(item, index) => item.itemID.toString()}
      />
    );
}

export default Items;