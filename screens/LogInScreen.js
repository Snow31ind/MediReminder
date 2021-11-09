import React, {useContext, useEffect, useState} from "react";
import { Image, StyleSheet, View, Text, TextInput, Button, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { log } from "react-native-reanimated";
import { NavigationEvents } from "react-navigation";
import {MaterialIcons} from '@expo/vector-icons';
import { Icon } from "react-native-elements";
import { collection, getDocs } from "@firebase/firestore";
import SignUpScreen from "./SignUpScreen";
import { db, auth } from "../firebase/Config";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { AuthContext } from "../Context/AuthContext";

export default function LoginScreen({navigation}){
    const { signIn } = useContext(AuthContext);


    const [secure, setSecure] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);

    useEffect(
        () => {
            console.log('Login renders');
        }
    , [])

    return(   
        <TouchableWithoutFeedback
            onPress={() => {Keyboard.dismiss()}}
        >

            <View style={styles.container}>
                {/* Application Icon */}
                <View style={styles.appIconContainer}>
                        <Image source={require('../assets/favicon.png')}
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
                        placeholder='Email'
                        onChangeText={text => setEmail(text)}
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
                        onChangeText={text => setPassword(text)}
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
                        onPress={() => signIn(email, password)}
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
                            onPress={() => navigation.navigate('Sign up')}
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

