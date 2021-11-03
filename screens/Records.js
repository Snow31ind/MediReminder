import React from "react";
import { StyleSheet, Text, View } from "react-native";
import BarHeader from "../shared/BarHeader";

export default function Records({navigation}){
    return (
        <View>
            <BarHeader navigation={navigation}/>

            <Text> Records </Text>
        </View>
    )
};

const styles = StyleSheet.create({

})