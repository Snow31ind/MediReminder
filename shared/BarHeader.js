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
                style={styles.accountIcon}
                name='account-circle'
                size={32}
                onPress={() => navigation.navigate('Account')}
            />

            <Text style={styles.headerText}> {header} </Text>

            <MaterialIcons
            style={styles.barIcon}
            name='menu'
            size={32}
            onPress={openBarMenu}
            />

            {/* <Modal
                visible={openAccount}
                animationType='slide'
            >
                <AccountScreen setOpenAccount={setOpenAccount}/>
            </Modal> */}
        </View>
    )
};

const styles = StyleSheet.create({
    barIcon: {
        position: 'absolute',
        right: 16
    },
    accountIcon: {
        position: 'absolute',
        left: 16,
    },
    header: {
        height: 80,
        flexDirection: 'row',
        justifyContent: "center",
        backgroundColor: '#53cbff',
        alignItems: 'center'
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold'
    }
});