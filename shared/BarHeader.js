import React, {useState} from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import {MaterialIcons} from '@expo/vector-icons'
// import AccountScreen from "../screens/AccountScreen";

export default function BarHeader({navigation, header}){

    // const [openAccount, setOpenAccount] = useState(false);
    
    const openBarMenu = () => {
        navigation.openDrawer();
    }

    return (
        <View style={styles.header}>
            <MaterialIcons
                style={styles.icon}
                name='menu'
                size={30}
                onPress={openBarMenu}
            />

            <Text style={styles.headerText}>{header}</Text>

            <MaterialIcons 
                style={styles.icon}
                name='account-circle'
                size={30}
                onPress={() => navigation.navigate('Account')}
            />

        </View>
    )
};

const styles = StyleSheet.create({
    icon : {
        // marginBottom: 5
    },
    header: {
        height: 70,
        flexDirection: 'row',
        justifyContent: "space-around",
        backgroundColor: '#53cbff',
        alignItems: 'flex-end',
        padding: 10
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        width: '60%',
        textAlign: 'center'
    }
});