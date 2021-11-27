import React, {useRef, useState} from "react";
import { Image, StyleSheet, View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert, Modal, ActivityIndicator } from "react-native";
import {MaterialIcons} from '@expo/vector-icons';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Ionicons} from '@expo/vector-icons';

import Logo from '../assets/MediReminderLogo.png'
import { useAuth } from "../Context/AuthContext";
import { Link } from "@react-navigation/native";

export default function SignUpScreen({navigation}) {

	const [secure, setSecure] = useState(true)
    const [loading, setLoading] = useState(false)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    
    const { signup } = useAuth()


    const handleClick = async () => {
        try {
            setLoading(true)
            
            await signup(
                email,
                password,
                confirmPassword
            )
        } catch (e) {
            console.log('Sign up error:', e.message);
        }

        setLoading(false)
    }

{
    const CustomTextInput = ({name, placeholder, setText, ...rest}) => {
        return (
            <View style={styles.input}>
                <MaterialIcons name={name} size={28} />
                <TextInput
                    // ref={ref}
                    style={{marginLeft: 15, width: '80%'}}
                    placeholder={placeholder}
                    onChange={ text => setText(text) }
                />
            </View>
        )
    }

    return (
	<TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>            
		<View style={styles.container}>
			<View style={styles.headerBar}>
					<MaterialIcons name='arrow-back' size={20} onPress={() => navigation.goBack()}/>
			</View>

			<View>
					<View style={styles.header}>
							<Image source={Logo} style={styles.logo}/>
							<Text>Let's get started</Text>
							<Text>Create an account to MediReminder get all features</Text>
					</View>

					<View style={styles.inputContainer}>
						{/* <View style={styles.input}>
							<MaterialCommunityIcons name='account-outline' size={28}/>
							<TextInput
									style={{marginLeft: 15, width: '80%'}}
									placeholder='Full name'
									onChangeText={ text => setName(text) }
							/>
						</View> */}

						<View style={styles.input}>
							{/* <MaterialCommunityIcons name='email-outline' size={28}/> */}
							<MaterialCommunityIcons name='account-outline' size={28}/>
							<TextInput
									style={{marginLeft: 15, width: '80%'}}
									placeholder='Email'
									onChangeText={ text => setEmail(text) }
							/>
						</View>
								
						{/* <View style={styles.input}>
							<MaterialIcons name='phone-iphone' size={28} />
							<TextInput
									style={{marginLeft: 15, width: '80%'}}
									placeholder='Phone number'
									onChangeText={ text => setPhoneNumber(text) }
							/>
						</View> */}
						
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

						<View style={styles.input}>
							<Ionicons name='lock-closed-outline' size={28}/>
							<TextInput
                                    secureTextEntry={secure}
									style={{marginLeft: 15, width: '80%'}}
									placeholder='Confirm password'
									onChangeText={ text => setConfirmPassword(text) }
							/>

							<Ionicons
								onPress={() => setSecure(!secure)}
								name={secure ? 'eye-off-outline' : 'eye-outline'} 
								size={20}
								style={{alignSelf: 'center'}}
							/>
						</View>
								
						<View>
                            <TouchableOpacity
                            // onPress={clickLogIn}
                            disabled={loading}
                            onPress={handleClick}
                            >
                                <View style={styles.logInButton}>
                                {loading ?
                                    <ActivityIndicator size="large" color='black'/>
                                    :  
                                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>SIGN UP</Text>
                                }
                                </View>
                            </TouchableOpacity>
					
							<View style={styles.footer}>
									<Text>Already have an acount?</Text>
									<Link to='/Login' style={{color: 'tomato', fontWeight: 'bold'}}> Login here</Link>
							</View>
						</View>

					</View>
				</View>
			</View>
		</TouchableWithoutFeedback>
    )
}
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#53CBFF',
        // justifyContent: 'space-evenly'
        // padding: 10,
    },
    headerBar: {
        // backgroundColor: 'tomato',
        padding: 20,
        justifyContent: 'center'
    },  
    header: {
        // backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
        // marginVertical: 20
    },
    inputContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    input: {
        flexDirection: 'row',
        // backgroundColor: 'gray'
        borderRadius: 90,
        borderColor: 'black',
        borderWidth: 2,
        padding: 15,
        marginVertical: 10
    },
    buttonContainer : {
        backgroundColor: 'white',
        borderRadius: 90,
        width: '30%',
        padding: 10,
        alignItems: 'center',
        justifyContent:'center',
        alignSelf: 'center',
    },
    logo: {
        width: 60,
        height: 60
    },
    footer: {
        marginTop: 5,
        flexDirection: 'row',
        // backgroundColor: 'gray',
        alignSelf: 'center'
    },
    inputContainer : {
        padding: 20,
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
})
