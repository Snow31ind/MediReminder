import React, {useState} from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import {MaterialIcons} from '@expo/vector-icons'
import Account from "../screens/Account";
export default function BarHeader({navigation}){

    const [openAccount, setOpenAccount] = useState(false);
    
    const openBarMenu = () => {
        navigation.openDrawer();
    }

    return (
        <View style={styles.header}>
            <MaterialIcons 
                style={styles.accountIcon}
                name='account-circle'
                size={32}
                onPress={() => setOpenAccount(true)}
            />

            <Text style={styles.headerText}> MediReminder </Text>

            <MaterialIcons
            style={styles.barIcon}
            name='menu'
            size={32}
            onPress={openBarMenu}
            />

            <Modal
                visible={openAccount}
                animationType='slide'
            >
                <Account setOpenAccount={setOpenAccount}/>
            </Modal>

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
        backgroundColor: 'cyan',
        alignItems: 'center'
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold'
    }
});