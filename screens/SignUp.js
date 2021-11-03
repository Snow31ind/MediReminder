import React, {useState} from "react";
import { Image, StyleSheet, View, Text, TextInput, Button, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { log } from "react-native-reanimated";
import { NavigationEvents } from "react-navigation";
import {MaterialIcons} from '@expo/vector-icons';
import { Icon } from "react-native-elements";
import firestore from "../firebase/Config";
import { addDoc, collection, getDocs } from "@firebase/firestore";

export default function SignUp({incrementRefreshCount, usersColRef, users, setIsSignedUp}) {
    const [secure, setSecure] = useState(true);
    const [newPhoneNumber, setNewPhoneNumber] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newConfirmPassword, setNewConfirmPassword] = useState('');


    const signUpNewAccount = async () => {
        console.log('Register phone number:', newPhoneNumber);
        console.log('Register password:', newPassword);
        
        if (newPhoneNumber == '') {
            Alert.alert('Error', 'Please assign your phone number');
            return;
        } else if (newPassword == '' || newConfirmPassword == '') {
            Alert.alert('Error', 'Please correct your password.');
            return;
        }

        if (newPassword != newConfirmPassword) {
            Alert.alert('Error', 'The confirmed password is different from the entered password.')
            return;
        }

        for(let user of users) {
            console.log(user.id);
            console.log(user.phoneNumber);
            console.log(user.password); 

            if (user.phoneNumber == newPhoneNumber) {
                Alert.alert('The phone number already exists');
                return;
            }
        }

        try {
            await addDoc(usersColRef, {
                phoneNumber: newPhoneNumber,
                password: newPassword
            })   
        } catch (error) {
            console.log('Error in adding data: ', error);
        }

        Alert.alert('Success', 'Your new account has been successfully registered\n. Welcome! Now let\'s login Reminder.');
        incrementRefreshCount();
        setIsSignedUp(false);
    }
    
    return (
        <TouchableWithoutFeedback
        onPress={() => {Keyboard.dismiss()}}
    >
    <View style={styles.container}>
            <MaterialIcons
                style={{marginTop: 30, marginLeft: 10}}
                name='arrow-back'
                size={28}
                onPress={() => setIsSignedUp(false)}
            />

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
                onChangeText={(val) => setNewPhoneNumber(val)}
                />
            </View>
            
            <View style={{
                    flexDirection: 'row',
                    marginVertical: 10,
                    padding: 10,
                    borderStyle: 'solid',
                    borderWidth: 2,
                    borderRadius: 20,
                    borderWidth: 2
                }}>

                <TextInput
                style={{width: '90%'}}
                secureTextEntry={secure}
                placeholder='Password'
                onChangeText={(val) => setNewPassword(val)}
                />
                <MaterialIcons

                    style={{alignSelf: 'center'}}
                    size={20}
                    name='remove-red-eye'
                    onPress={() => setSecure(!secure)}
                />


                
            </View>

            <View style={{
                    flexDirection: 'row',
                    marginVertical: 10,
                    padding: 10,
                    borderStyle: 'solid',
                    borderWidth: 2,
                    borderRadius: 20,
                    borderWidth: 2
                }}>

                <TextInput
                style={{width: '90%'}}
                secureTextEntry={secure}
                placeholder='Confirm password'
                onChangeText={(val) => setNewConfirmPassword(val)}
                />
                <MaterialIcons

                    style={{alignSelf: 'center'}}
                    size={20}
                    name='remove-red-eye'
                    onPress={() => setSecure(!secure)}
                />


                
            </View>

            <TouchableOpacity
                onPress={signUpNewAccount}
            >
                <View style={styles.logInButton}>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: 'bold'
                    }}> SIGN UP </Text>
                </View>
            </TouchableOpacity>
        </View>


    </View>
    </TouchableWithoutFeedback>
    )
}

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
        padding: 40,
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
