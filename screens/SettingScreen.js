import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BarHeader from "../shared/BarHeader";
import {MaterialIcons} from '@expo/vector-icons';
import { waitForPendingWrites } from "@firebase/firestore";
import ToggleSwitch from 'toggle-switch-react-native';
import { useAuth } from "../Context/AuthContext";

export default function SettingScreen({navigation}){
    const { signout } = useAuth()

    const OptionButton = ({title, description, ...rest}) => {
        return (
            <TouchableOpacity
                {...rest}
                style={styles.button}
            >
                <View>
                    <Text style={styles.functionText}>{title} </Text>
                    <Text style={styles.descriptionText}>{description}</Text>
                </View>
                <MaterialIcons color={'#dcdcdc'} name='chevron-right' size={28} />
            </TouchableOpacity>
        )
    }

    const ToggleSwitchButton = ({title, description, ...rest}) => {
        const [openToggleSwitch, setOpenToggleSwitch] = useState(false);

        return (
            <TouchableOpacity
            onPress={() => {}}
            style={styles.button}
            >
                <View>
                    <Text style={styles.functionText}>{title}</Text>
                    <Text style={styles.descriptionText}>{description}</Text>
                </View>

                <ToggleSwitch
                    isOn={openToggleSwitch}
                    onColor='green'
                    offColor='gray'
                    onToggle={() => setOpenToggleSwitch(!openToggleSwitch)}
                />
            </TouchableOpacity>
        )
    }

    return (
        <View style={{flex: 1}}>
            <BarHeader navigation={navigation} header={'Settings'}/>

            <ScrollView style={styles.container}>
                <View style={styles.block}>
                    <Text style={styles.blockHeader}>NOTIFICATION SETUP</Text>
                    <OptionButton title='Snooze time' description=''/>
                    <OptionButton title='Medtones' description=''/>
                </View>

                <View style={styles.block}>
                    <Text style={styles.blockHeader}>BACKGROUND</Text>
                    <ToggleSwitchButton title='Dark mode' description='' />
                </View>

                <View style={styles.block}>
                    <Text style={styles.blockHeader}>PREMIUM SETTINGS</Text>
                    <OptionButton title='Upgrade to Premium' />
                </View>

                <View style={styles.block}>
                    <Text style={styles.blockHeader}>ACCOUNT</Text>
                    <OptionButton title='Manage Account' description=''/>
                    <OptionButton title='Language' description=''/>
                    <OptionButton title='About' />

                    <OptionButton title='Log out' onPress={() => signout()}/>
                </View>
            </ScrollView>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    block : {
        backgroundColor: 'black'
    },
    blockHeader : {
        color: '#dcdcdc',
        fontWeight: '600',
        paddingHorizontal: 5,
        paddingVertical: 10
    },
    button: {
        borderColor: 'gray',
        borderTopWidth: 2,
        borderBottomWidth: 2,
        flexDirection: 'row',
        backgroundColor: '#696969',
        alignItems: 'center',
        justifyContent:'space-between',
        padding: 5,
    },
    functionText: {
        fontSize: 20,
        fontWeight: "700",
        color: 'white'
    },
    descriptionText : {
        fontSize: 12,
        color: '#dcdcdc'
    }
});