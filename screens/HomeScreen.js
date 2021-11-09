import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View,  Text, Button } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import BarHeader from "../shared/BarHeader";
import Calendar from "../components/Calendar";
import { AuthContext } from "../Context/AuthContext";

export default function HomeScreen({navigation}) {
    const {userId} = useContext(AuthContext);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [refresh, setRefresh] = useState(0);

    useEffect(
        () => {
            console.log('Home renders');
            // console.log(getUserId());
            // setUserId( () => getUserId() );
            console.log('User id in home screen:', userId);

            // refreshData();
        }
    , [])

    return (
        <View style={styles.calendar}>
            <BarHeader navigation={navigation}/>
            {/* <Text> {userId} </Text> */}
            <Calendar currentUserId={userId} />
        </View>
    )
};

const styles = StyleSheet.create({
    calendar: {
        flex: 1
    }
})



