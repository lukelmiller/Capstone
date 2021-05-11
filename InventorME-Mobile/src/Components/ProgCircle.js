import React from "react";
import ProgressCircle from 'react-native-progress-circle';
import { View, Text } from "react-native";
import { colors } from '../util/colors';
 
const ProgCircle = (props) =>  {
    
    return(
        <View style={{alignItems: 'center',
        justifyContent: 'center', width: '100%'}}>
        <ProgressCircle
            percent={props.percent}
            radius={80}
            borderWidth={12}
            color={props.color}
            shadowColor={colors.fill}
            bgColor={colors.background}
        >
            <Text style={{ fontSize: 30, color: colors.label }}>{props.text}</Text>
        </ProgressCircle>
        </View>
    );
   

}
export default ProgCircle;