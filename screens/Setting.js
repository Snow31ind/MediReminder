import React from "react";
import { StyleSheet, Text, View } from "react-native";
import BarHeader from "../shared/BarHeader";

export default function Setting({navigation}){
    return (
        <View>
            <BarHeader navigation={navigation}/>

            <Text>
                Settings Page
            </Text>
        </View>
    )
};

const style = StyleSheet.create({

});