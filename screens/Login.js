import React, {useEffect, useState} from "react";
import { Image, StyleSheet, View, Text, TextInput, Button, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { log } from "react-native-reanimated";
import { NavigationEvents } from "react-navigation";
import {MaterialIcons} from '@expo/vector-icons';
import { Icon } from "react-native-elements";
import firestore from "../firebase/Config";
import { collection, getDocs } from "@firebase/firestore";
import SignUp from "./SignUp";

export default function Login({setIsSignedIn}){
    const [secure, setSecure] = useState(true);

    const [currentPhoneNumber, setCurrentPhoneNumber] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [users, setUsers] = useState([]);
    const [refreshCount, setRefreshCount] = useState(0);

    const incrementRefreshCount = () => {
        setRefreshCount(refreshCount + 1);
    }

    const usersColRef = collection(firestore, 'users');

    const getUsers = async () => {
        try {
            const querySnapshot = await getDocs(usersColRef);
            const listUsers = querySnapshot.docs.map(
                user => ({...user.data(), id: user.id})
            )
            setUsers(listUsers);
        } catch (e) {
            console.log('Error in reading data: ', e);
        }
    }

    const LogIn = () => {
        console.log(currentPhoneNumber);
        console.log(currentPassword);
        
        if (currentPassword != '' && currentPhoneNumber != '') {
            let accountFound = false;

           for(let user of users) {
                if (currentPhoneNumber == user.phoneNumber && currentPassword == user.password) {
                    accountFound = true;
                    break;
                }
           }

            if (accountFound) setIsSignedIn(true);
            else Alert.alert('Account not found', 'Invalid phone number/ password.')
        } else if (currentPhoneNumber != '' && currentPassword == '') {
            Alert.alert('Invalid password', 'Please assign your accurate password.');
        } else if (currentPassword != '' && currentPhoneNumber == '') {
            Alert.alert('Invalid phone number', 'Please assign your accurate phone number.')
        } else {
            Alert.alert('Error', 'Please assign your accurate phone number and password.')
        }
    }
    const [isSignedUp, setIsSignedUp] = useState(false);

    const openSignUp = () => {
        setIsSignedUp(true);
    }

    useEffect(
        () => {
            getUsers();
        }
    , [refreshCount])

    return(
        isSignedUp == false ? (
            <TouchableWithoutFeedback
            onPress={() => {Keyboard.dismiss()}}
        >

        <View style={styles.container}>

            {/* Application Icon */}
            <View style={styles.appIconContainer}>
                    <Image
                        
                        source={require('../assets/favicon.png')}
                        style={styles.appIcon}
                    />

                    <Text style={styles.appName}> Medireminder </Text>
            </View>

            {/* Log in form */}
            <View style={styles.logInForm}>
                <View style={{
                    marginVertical: 10,
                    padding: 10,
                    borderStyle: 'solid',
                    borderWidth: 2,
                    borderRadius: 20
                }}> 
                    <TextInput
                    style={{width: '90%'}}
                    keyboardType='numeric'
                    placeholder='Phone number'
                    onChangeText={(val) => setCurrentPhoneNumber(val)}
                    />
                </View>
                
                <View style={{
                        flexDirection: 'row',
                        marginVertical: 10,
                        padding: 10,
                        borderStyle: 'solid',
                        borderWidth: 2,
                        borderRadius: 20
                    }}>
                    <TextInput
                    style={{width: '90%'}}
                    secureTextEntry={secure}
                    placeholder='Password'
                    onChangeText={(val) => setCurrentPassword(val)}
                    />

                    <MaterialIcons

                        style={{alignSelf: 'center'}}
                        size={20}
                        name='remove-red-eye'
                        onPress={() => setSecure(!secure)}
                    />


                    
                </View>

                <TouchableOpacity
                    // onPress={clickLogIn}
                    onPress={LogIn}
                >
                    <View style={styles.logInButton}>
                        <Text style={{
                            fontSize: 20,
                            fontWeight: 'bold'
                        }}> LOGIN </Text>
                    </View>
                </TouchableOpacity>

                <View style={{}}>
                    <Text
                        onPress={openSignUp}
                        style={{
                            textAlign: 'right',
                            // fontWeight: 'bold'
                        }}
                    >
                        Not have an acocunt yet? 
                    </Text>
                </View>

            </View>
        </View>
        </TouchableWithoutFeedback>
        ) : (
            <SignUp 
                users={users}
                setIsSignedUp={setIsSignedUp}
                usersColRef={usersColRef}
                incrementRefreshCount={incrementRefreshCount}
            />
        )
        
)};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#53CBFF',
    },
    appIconContainer: {
        // marginTop: '50%',
        // marginBottom: '100%',
        marginTop: '50%',
        flexDirection: 'column',
        // borderWidth: 3,
        alignItems: 'center'
    },
    appIcon: {
        width: 60,
        height: 60,
    },
    appName: {
        fontSize: 28,
        fontWeight: "bold",
    },
    logInForm: {
        // borderWidth: 2,
        marginTop: 0,
        padding: 40
    },
    logInButton: {
        marginTop: 40,
        borderWidth: 2,
        borderColor: 'black',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: 'white'
    }
})

