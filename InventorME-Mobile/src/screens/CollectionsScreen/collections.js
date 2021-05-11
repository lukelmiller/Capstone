import React, { useContext } from "react";
import { View, Text, FlatList } from "react-native";
import styles from "./collections.style";
import BoxFolderComponent from "../../Components/BoxFolderComponent";
import Loading from "../../Components/Loading";
import { renderContext } from "../MainPage/mainPage";
import { colors } from '../../util/colors';

const collections = (props) => {

  const data = useContext(renderContext);
  const categoriesList = [];
  const countList = [];
 
  if (data != null) {
    for (let i = 0; i < data.items.length; i++) {
      if (!categoriesList.includes(data.items[i].itemCategory)) {
        categoriesList.push(data.items[i].itemCategory);
      }
    }

    for (let i = 0; i < categoriesList.length; i++) {
      const itemsToRender = [];
      let object = {}
      
      if (categoriesList[i] == "") {
        object = { name: "Miscellaneous", count : 0, itemsToRender, key: "Miscellaneous", colorNum: 0 };
      }
      else {
        object = { name: categoriesList[i], count: 0, itemsToRender, key: categoriesList[i], colorNum: 0 };
      }

      for (let j = 0; j < data.items.length; j++) {
        if (data.items[j].itemCategory == categoriesList[i]) {
          object.count += 1;
          object.itemsToRender.push(data.items[j]);
        }
      }
      object.colorNum = (i%8);

      countList.push(object);
    }
  }
  
  if (data == null) {
    return (
      <Loading/>
    );
  }
  
  
  return (
    <View style={styles.container}>
      <FlatList
        data={countList}
        renderItem={({ item }) => (
          <BoxFolderComponent
            boxType={1}
            title={item.name}
            numItems={item.count}
            style={{ backgroundColor: colors.objects[item.colorNum] }}
            addPageNavigate={() => { props.navigation.navigate("AddItemScreen") }}
            itemsNavigate={() => { props.navigation.navigate("ItemsScreen", {itemsToRender : item.itemsToRender})}}
          />
        )}
        numColumns={2}
        keyExtractor={(item, index) => item.name}
      />
    </View>
  );
  
};

export default collections;
