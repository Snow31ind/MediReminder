import React, { useState } from "react";
import { StyleSheet, View,  Text, Button } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import BarHeader from "../shared/BarHeader";
import Calendar from "../components/Calendar";

export default function Homepage({navigation}) {

    return (
        <View style={styles.calendar}>
            <BarHeader navigation={navigation}/>

            <Calendar />
        </View>
    )
};

const styles = StyleSheet.create({
    calendar: {
        flex: 1
    }
})