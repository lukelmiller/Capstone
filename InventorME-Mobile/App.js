/* eslint-disable react/jsx-indent */
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { AppearanceProvider } from 'react-native-appearance';
import HomeScreen from "./src/screens/LogInScreen/LogIn";
import MainPageNav from "./src/screens/MainPage/mainPage";
import CreateAccountScreen from "./src/screens/CreateAccountScreen/CreateAccount";
import ProfilePageNav from "./src/screens/ProfilePage/profilePage";
import addItemScreen from './src/screens/addItemScreen/addItem';
import EditProfilePage from "./src/screens/EditProfilePage/editProfilePage";
import Items from "./src/screens/ItemsScreen/Items";
import Amplify from 'aws-amplify';
import config from './src/config.json';
import EditItemScreen from "./src/screens/EditItemScreen/EditItem";
import {colors} from "./src/util/colors";
import StatsScreen from "./src/screens/StatsScreen/StatsScreen";

Amplify.configure({
  Auth: {
    mandatorySignId: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  }
});


const Stack = createStackNavigator();

function myStack() {
  return (
    <AppearanceProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="HomeScreen"
        >
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen
            name="MainPage"
            component={MainPageNav}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen
            name="CreateAccountScreen"
            component={CreateAccountScreen}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen
            name="ProfilePage"
            component={ProfilePageNav}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen
            name="AddItemScreen"
            component={addItemScreen}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen
            name="StatsScreen"
            component={StatsScreen}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen
          name="EditItemScreen"
          component={EditItemScreen}
          options = {{
            headerShown : false
          }}
        />
          <Stack.Screen
            name="EditProfilePage"
            component={EditProfilePage}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen
            name="ItemsScreen"
            component={Items}
            options={{
              headerStyle: { backgroundColor: colors.navigator },
              headerBackImage: () => { return <FontAwesome name="arrow-left" color={colors.icon} size={25} /> },
              headerBackTitleVisible: false,
              headerTitleStyle: {color: colors.title},
              headerLeftContainerStyle: { marginLeft: "2%" }
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppearanceProvider>
  );
}

export default myStack;