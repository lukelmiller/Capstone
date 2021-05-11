import React from "react";
import { View, Image, ActivityIndicator } from "react-native";

const Loading = () => {
    return (
        <View style = {{flex : 1, justifyContent : "center", alignItems : "center"}}>
            <Image source = {require("../../assets/appImages/InventorMELogo.png")}/>
            <ActivityIndicator size = "small"/>
        </View>
    )
}

export default Loading;