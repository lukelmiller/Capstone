import React from "react";
import { View } from "react-native";
import { createDrawerNavigator } from '@react-navigation/drawer';
import styles from "./categories.style";
import photos from "../PhotosScreen/photos";
import completed from "../CompletedScreen/completed";
import date from "../DateScreen/date";
import settings from "../SettingsScreen/settings";
import UpperTab from "../../Components/UpperTab";
import BoxFolderComponent from "../../Components/BoxFolderComponent";
import profilePageNav from "../ProfilePage/profilePage";
import { colors } from '../../util/colors';
import StatisticsScreen from "../Statistics/StatisticsScreen";

const categoriesNav = (props) => {
    const Drawer = createDrawerNavigator();

    return (
      <Drawer.Navigator
        initialRouteName="categories"
        screenOptions={{
                header : ({scene}) => {
                    return (
                      <UpperTab
                        title={scene.descriptor.options.title}
                        nav={() => {scene.descriptor.navigation.toggleDrawer()}}
                        profileNav={()=>{props.navigation.navigate("ProfilePage")}}
                      />
                            );
                },
                headerShown : true
            }}
        drawerContentOptions={{
                activeTintColor : colors.buttonText,
                activeBackgroundColor : colors.button,
                inactiveBackgroundColor : colors.background,
                inactiveTintColor : colors.text,
                backgroundColor: colors.background
            }}
      >
        <Drawer.Screen
          options={{
                    title : "Items"
                }}
          name="Categories"
          component={categories}
        />
        <Drawer.Screen
          options={{
                    title : "Collections"
                }}
          name="Photos"
          component={photos}
        />
        <Drawer.Screen
          options={{
                    title : "Folders"
                }}
          name="Date"
          component={date}
        />
        <Drawer.Screen
          options={{
                    title : "Archive"
                }}
          name="Completed"
          component={completed}
        />
        <Drawer.Screen
          options={{
                    title : "Stats"
                }}
          name="Statistics"
          component={StatisticsScreen}
        />
        <Drawer.Screen
          options={{
                    title : "Profile"
                }}
          name="Profile"
          component={profilePageNav}
        />
      </Drawer.Navigator>
    )
}

const categories = ({navigation}) => {
  return (
    <View style={styles.container}>
      <DrawBoxes navigation = {navigation}/>
    </View>
  );  
};

const DrawBoxes = props => {
  return(
    <View style={styles.boxFolder}>
      <BoxFolderComponent
        boxType = {1} 
        title="School" 
        numItems='3' 
        style={{backgroundColor:colors.objects[0]}} 
        addPageNavigate={()=>{props.navigation.navigate("AddItemScreen")}}
        itemsNavigate = {() => {props.navigation.navigate("ItemsScreen")}}
      />
      <BoxFolderComponent
        boxType = {1} 
        title="Work" 
        numItems='17' 
        style={{backgroundColor:colors.objects[0]}} 
        addPageNavigate={()=>{props.navigation.navigate("AddItemScreen")}}
        itemsNavigate = {() => {props.navigation.navigate("ItemsScreen")}} 
      />
      <BoxFolderComponent
        boxType = {1} 
        title="Groceries" 
        numItems='20' 
        style={{backgroundColor:colors.objects[2]}}
        addPageNavigate={()=>{props.navigation.navigate("AddItemScreen")}}
        itemsNavigate = {() => {props.navigation.navigate("ItemsScreen")}}
      />
      <BoxFolderComponent
        boxType = {1} 
        title="Groceries" 
        numItems='20' 
        style={{backgroundColor:colors.objects[3]}} 
        addPageNavigate={()=>{props.navigation.navigate("AddItemScreen")}}
        itemsNavigate = {() => {props.navigation.navigate("ItemsScreen")}}
      />
      <BoxFolderComponent
        boxType = {1} 
        title="Items to buy in the future" 
        numItems='35' 
        style={{backgroundColor:colors.objects[4]}} 
        addPageNavigate={()=>{props.navigation.navigate("AddItemScreen")}}
        itemsNavigate = {() => {props.navigation.navigate("ItemsScreen")}}
      />
    </View>
  )
};

export default categoriesNav;
