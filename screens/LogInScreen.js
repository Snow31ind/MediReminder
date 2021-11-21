import React, {useEffect, useState} from "react";
import { Image, StyleSheet, View, Text, TextInput, Button, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert, ActivityIndicator } from "react-native";
import {MaterialIcons} from '@expo/vector-icons';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Ionicons} from '@expo/vector-icons';
import Logo from '../assets/MediReminderLogo.png'
import { useAuth } from "../Context/AuthContext";
import { Link } from "@react-navigation/native";

export default function LoginScreen({navigation}){
    // const { signIn } = useContext(AuthContext);
    const { login } = useAuth();

    const [secure, setSecure] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading ,setLoading] = useState(false)

    const handleClick = async () => {
        try {
            setLoading(true)
            await login(email, password)
        } catch (e) {
            console.log('Login error:', e.message);
        }

        setLoading(false)
    }

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
                        <Image source={Logo}
                            style={styles.appIcon}
                        />
                        <Text style={styles.appName}> Medireminder </Text>
                </View>

                {/* Log in form */}
                <View style={styles.logInForm}>
                         <View style={styles.input}>
							<MaterialCommunityIcons name='account-outline' size={28}/>
							<TextInput
                                style={{marginLeft: 15, width: '80%'}}
                                placeholder='Email'
                                onChangeText={ text => setEmail(text) }
							/>
						</View>

                        <View style={styles.input}>
							<Ionicons name='lock-closed-outline' size={28}/>
							<TextInput
                                secureTextEntry={secure}
                                style={{marginLeft: 15, width: '80%'}}
                                placeholder='Password'
                                onChangeText={ text => setPassword(text) }
							/>

                            <Ionicons
                            onPress={() => setSecure(!secure)}
                            name={secure ? 'eye-off-outline' : 'eye-outline'} 
                            size={20}
                            style={{alignSelf: 'center'}}
                            />
						</View>

                    <TouchableOpacity
                        // onPress={clickLogIn}
                        disabled={loading}
                        onPress={handleClick}
                    >
                        <View style={styles.logInButton}>
                            {loading ?
                            <ActivityIndicator size="large" color='black' />
                            :  
                            <Text style={{fontSize: 20, fontWeight: 'bold'}}>LOGIN</Text>
                            }
                            
                        </View>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text
                            onPress={() => navigation.navigate('Sign up')}
                            style={{
                                textAlign: 'right',
                                // fontWeight: 'bold'
                            }}
                        >
                            Not have an acocunt yet? 
                        </Text>
                        <Link to='/Sign up' style={{color: 'tomato', fontWeight: 'bold'}}> Sign up</Link>
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
        width: 80,
        height: 80,
    },
    appName: {
        fontSize: 28,
        fontWeight: "bold",
    },
    logInForm: {
        // borderWidth: 2,
        marginTop: 0,
        padding: 25,
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    logInButton: {
        marginTop: 20,
        borderWidth: 2,
        borderColor: 'black',
        height: 40,
        width: 160,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: 'white',
        alignSelf: 'center'
    },
    input: {
        flexDirection: 'row',
        // backgroundColor: 'gray'
        borderRadius: 90,
        borderColor: 'black',
        borderWidth: 2,
        padding: 14,
        marginVertical: 10,
        // justifyContent: 'space-between'
    },
    footer : {
        marginTop: 5,
        flexDirection: 'row',
        alignSelf: 'center'
    }
})

