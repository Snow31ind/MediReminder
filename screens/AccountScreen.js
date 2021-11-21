import React, { useState } from 'react'
import { StyleSheet, Text, View, Button, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { color } from 'react-native-reanimated'
import BarHeader from '../shared/BarHeader'
import avatar from '../assets/favicon.png';
import ToggleSwitch from 'toggle-switch-react-native';

export default function AccountScreen({setOpenAccount, navigation}) {
    const [isEditing, setIsEditing] = useState(false);
        
    return (
    <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
    >
        <View style={{flex: 1}}>
            <BarHeader navigation={navigation} header={isEditing ? 'Edit Profile' : 'Profile'}/>
            <Image source={avatar} style={styles.avatar} />

            <View style={styles.container}>
                <View>
                    <View style={styles.box}>
                        <Text> First name </Text>
                        <TextInput editable={isEditing}  textAlign='right' placeholder='First name' style={{padding: 5}}></TextInput>
                    </View>
                    
                    <View style={styles.box}>
                        <Text> Last name </Text>
                        <TextInput editable={isEditing} textAlign='right' placeholder='Last name' style={{padding: 5}}></TextInput>
                    </View>

                    <View style={styles.box}>
                        <Text> Gender </Text>
                        <TextInput editable={isEditing} textAlign='right' placeholder='Gender' style={{padding: 5}}></TextInput>
                    </View>
                    
                    <View style={styles.box}>
                        <Text> Birth date</Text>
                        <TextInput editable={isEditing} textAlign='right' placeholder='Birth date' style={{padding: 5}}></TextInput>
                    </View>

                    <View style={styles.box}>
                        <Text> Email</Text>
                        <TextInput editable={isEditing} textAlign='right' placeholder='Email date' style={{padding: 5}}></TextInput>
                    </View>
                </View>

                { !isEditing ? 
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => setIsEditing(true)}
                        >
                            <Text style={styles.buttonText}>EDIT</Text>
                        </TouchableOpacity>
                    </View>
                :
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => setIsEditing(false)}
                        >
                            <Text style={styles.buttonText}>BACK</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => setIsEditing(false)}
                        >
                            <Text style={styles.buttonText}>SAVE</Text>
                        </TouchableOpacity>
                    </View>
                    
                }
            </View>


        </View>
    </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        justifyContent: 'space-between',
        // alignItems :'center'
    },
    box: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 10,
        borderBottomWidth: 1,
        marginVertical: 5
        // backgroundColor: 'gray'
    },
    avatar: {
        alignSelf :'center',
        marginTop: 20,
        // backgroundColor: 'gray',
        borderRadius: 90,
        width: 100,
        height: 100,
    },
    editButton: {
        width: '40%',
        backgroundColor: '#53cbff',
        alignSelf: 'center',
        padding: 10,
        borderRadius: 10,
        justifyContent: 'center'
    },
    buttonText: {
        alignSelf: 'center',
        fontSize: 20
    },
    buttonContainer : {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    }
})
