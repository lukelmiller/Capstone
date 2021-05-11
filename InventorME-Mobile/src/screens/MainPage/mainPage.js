import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useRoute } from '@react-navigation/native';
import addItem from "../addItemScreen/addItem";
import scanItem from "../scanItemScreen/scanItem";
import archived from "../ArchivedScreen/archived";
import UpperTab from "../../Components/UpperTab";
import collections from "../CollectionsScreen/collections"
import recent from "../RecentScreen/recent";
import profilePageNav from "../ProfilePage/profilePage";
import Folder from "../FolderScreen/Folder";
import { colors } from '../../util/colors';
import { Database } from "../../util/Database";
import StatsScreen from "../StatsScreen/StatsScreen";

export const renderContext = React.createContext();


const mainNav = (props) => {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator
      initialRouteName="Collections"
      screenOptions={{
        header: ({ scene }) => {
          return (
            <UpperTab
              title={scene.descriptor.options.title}
              nav={() => { scene.descriptor.navigation.toggleDrawer() }}
              profileNav={() => { props.navigation.navigate("ProfilePage") }}
              itemsNavigate={(items) => { props.navigation.navigate("ItemsScreen", { itemsToRender: items }) }}
            />
          );
        },
        headerShown: true
      }}
      drawerContentOptions={{
        activeTintColor: colors.buttonText,
        activeBackgroundColor: colors.button,
        inactiveBackgroundColor: colors.background,
        inactiveTintColor: colors.text,
        backgroundColor: colors.background

      }}
      style={{ backgroundColor: colors.background }}
    >
      <Drawer.Screen
        options={{
          title: "Collections"
        }}
        name="Collections"
        component={collections}
      />
      <Drawer.Screen
        options={{
          title : "Folders"
        }}
        name="Folders"
        component={Folder}
      />
      <Drawer.Screen
        options={{
          title: "Archived"
        }}
        name="Archived"
        component={archived}
      />
      <Drawer.Screen
        options={{
          title: "Items"
        }}
        name="Recent"
        component={recent}
      />
      <Drawer.Screen
        options={{
          title: "Stats"
        }}
        name="StatsScreen"
        component={StatsScreen}
      />
      <Drawer.Screen
        options={{
          title: "Profile"
        }}
        name="Profile"
        component={profilePageNav}
      />
    </Drawer.Navigator>
  )
};





const MainPageNav = () => {
  // Once the user is logged in we will have to get the information from the database using an array of titles just 
  // to have an Idea
  const Tab = createBottomTabNavigator();

  const db = new Database();

  const [data, setData] = useState(null);
  const route = useRoute();

  async function getter() {
    try {
      setData(await db.get());
    }
    catch (error) {
      // console.log(error);
    }
  }

  useEffect(() => {
    getter();
  }, [route]);

  return (
    <renderContext.Provider value={data}>

      <Tab.Navigator
        initialRouteName="mainNav"
        backBehavior="none"
        tabBarOptions={{
          activeTintColor: colors.dock,
          inactiveTintColor: colors.title,
          activeBackgroundColor: colors.title,
          inactiveBackgroundColor: colors.dock,
          style: {
            borderTopColor: colors.navigator,
            backgroundColor: colors.navigator,

          },
          showLabel: false

        }}
      >
        <Tab.Screen
          name="scanItem"
          component={scanItem}
          options={{
            tabBarIcon: ({ color, size }) => {
              return (<MaterialCommunityIcons name="barcode" size={size} color={color} />)
            }
          }}
        />
        <Tab.Screen
          name="mainNav"
          component={mainNav}
          options={{
            tabBarIcon: ({ color, size }) => {
              return (<FontAwesome name="home" size={size} color={color} />);
            }
          }}
        />
        <Tab.Screen
          name="addItem"
          component={addItem}
          options={{
            tabBarIcon: ({ color, size }) => {
              return (<AntDesign name="plus" size={size} color={color} />);
            }
          }}
        />


      </Tab.Navigator>
    </renderContext.Provider>
  );
};

export default MainPageNav;