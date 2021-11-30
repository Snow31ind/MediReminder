import React, { useEffect } from "react";
import { StyleSheet, View,  Text} from "react-native";
import BarHeader from "../shared/BarHeader";
import Calendar from "../components/Calendar";
import { useAuth } from "../Context/AuthContext";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen({navigation}) {

    useEffect(
        () => {
            console.log('Home renders');
        }
    , [])
    
    const { currentUser } = useAuth();

    return (
        <View style={styles.calendar}>
            <BarHeader navigation={navigation} header={'Home'} />
            {/* <Text>{currentUser.uid}</Text>         */}
            <Calendar navigation={navigation} currentUserId={currentUser.uid} />
        </View>
    )
};

const styles = StyleSheet.create({
    calendar: {
        flex: 1
    }
})



