import React from "react";
import { Text, View } from "react-native";
import BarHeader from "../shared/BarHeader";

export default function Notifications({navigation}){
    return (
        <View>
            <BarHeader navigation={navigation}/>

            <Text> Notifications </Text>
        </View>
    )
}