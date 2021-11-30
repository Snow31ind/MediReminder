import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useAuth } from "../Context/AuthContext";
import BarHeader from "../shared/BarHeader";

export default function NotificationScreen({navigation}){

    return (
        <View style={{flex: 1}}>
            <BarHeader navigation={navigation} header={'Notifications'}/>

        </View>
    )
}

const styles = StyleSheet.create({

})