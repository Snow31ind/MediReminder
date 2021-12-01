import React, {useEffect, useState} from "react";
import { Image, StyleSheet, View, Text, TextInput, Button, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert, ActivityIndicator } from "react-native";
import {MaterialIcons} from '@expo/vector-icons';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Ionicons} from '@expo/vector-icons';
import Logo from '../assets/MediReminderLogo.png'
import { useAuth } from "../Context/AuthContext";
import { Link } from "@react-navigation/native";
import { GlobalStyles } from "../shared/GlobalStyles";

export default function LoginScreen({navigation}){
    // const { signIn } = useContext(AuthContext);
    const { login, error, setError, currentUser } = useAuth();

    const [secure, setSecure] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading ,setLoading] = useState(false)
    // const [error, setError] = useState()
    const [passwordError, setPasswordError] = useState()

    const handleClick = async () => {
        // setError()

        try {
            setLoading(true)
            await login(email, password)
        } catch (e) {
            // setError('Invalid email or password')
            console.log('Login error:', e.message);
        }

        setLoading(false)
    }

    useEffect(
      () => {
        if (password.length > 0 && password.length < 6) {
          setPasswordError('Your password must be at least 6 characters')
        } else setPasswordError()

      }
    , [password])

    useEffect(
        () => {
            return () => {
                setSecure(false)
                setEmail('')
                setPassword('')
                setPasswordError('')
            }
        }
    , [currentUser])

    return(   
        <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
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
                    onFocus={() => setError()}
                  />
                </View>

                <View style={styles.input}>
                  <Ionicons name='lock-closed-outline' size={28}/>
                  <TextInput
                      secureTextEntry={secure}
                      style={{marginLeft: 15, width: '80%'}}
                      placeholder='Password'
                      onChangeText={ text => setPassword(text)}
                      onFocus={() => setError()}
                  />

                  <Ionicons
                    onPress={() => setSecure(!secure)}
                    name={secure ? 'eye-off-outline' : 'eye-outline'} 
                    size={20}
                    style={{alignSelf: 'center'}}
                  />
						    </View>

                {passwordError && <Text style={GlobalStyles.warning}>{passwordError}</Text>}
            
                {error ? <Text style={[GlobalStyles.error, {alignSelf: 'center'}]}>{error}</Text> : <></>}

                <TouchableOpacity disabled={loading} onPress={handleClick}>
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
                    <Text onPress={() => {setError(); navigation.navigate('Sign up')}} style={{color: 'tomato', fontWeight: 'bold'}}> Sign up</Text>
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

