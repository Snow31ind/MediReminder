import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View, Button, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { color } from 'react-native-reanimated'
import BarHeader from '../shared/BarHeader'
import userAvatar from '../assets/favicon.png';
import ToggleSwitch from 'toggle-switch-react-native';
import { doc, getDoc, onSnapshot, setDoc, Timestamp, updateDoc } from '@firebase/firestore'
import { useAuth } from '../Context/AuthContext'
import { db } from '../firebase/Config'
import { useUser } from '../Context/UserContext'

import {Picker} from '@react-native-picker/picker'
import DateTimePicker from 'react-native-modal-datetime-picker'

export default function AccountScreen({setOpenAccount, navigation}) {
    const [isEditing, setIsEditing] = useState(false)
    const [saveLoading, setSaveLoading] = useState(false)

    const genderRef = useRef()

    function openGenderRef() {
        genderRef.current.focus()
    }

    const [isBirthdayVisible, setBirthdayVisibility] = useState(false)

    const handleOpenBirthday = () => {
        setBirthdayVisibility(true)
    }

    const handleConfirmBirthday = (day) => {
        // console.log(day);
        var firestoreTimestampDay = Timestamp.fromDate(day)
        // console.log(x);
        // setNewInfo( prevInfo => ({...prevInfo, birthDate: firestoreTimestampDay}))
        setBirthday(day)
        handleCancelBirthday()
    }

    const handleCancelBirthday = () => {
        setBirthdayVisibility(false)
    }

    class Info {
        constructor(avatar = '', name = '', gender = '', birthday =  new Date(), phoneNumber = '', bio = '') {
            this.avatar = avatar
            this.name = name
            this.gender = gender
            this.birthday = birthday
            this.phoneNumber = phoneNumber
            this.bio = bio
        }
    }

    const [info, setInfo] = useState(new Info())

    const { currentUser } = useAuth()

    const handleClickSave =  async () => {

        try {
            setSaveLoading(true)

            await updateDoc(doc(db, 'users', currentUser.uid.toString()), {
                info: {
                    avatar: avatar,
                    name: name,
                    gender: gender,
                    birthday: Timestamp.fromDate(birthday),
                    phoneNumber: phoneNumber,
                    bio: bio
                }
            })

        } catch (e) {
            console.log('Error in saving profile', e.message);
        }

        console.log('Info saved: ', info);
        setSaveLoading(false)
        setIsEditing(false)
    }

    useEffect(
        () => {
            const unsub = onSnapshot(doc(db, 'users', currentUser.uid.toString()), doc => {
                console.log('Current user info data:', doc.data());
                const userInfo = doc.data().info

                console.log('User info at the first time:', userInfo);
                
                // Error not loading at the first time but the second time
                setInfo(prev => ({
                    avatar: userInfo.avatar,
                    name: userInfo.name,
                    gender: userInfo.gender,
                    birthday: userInfo.birthday.toDate(),
                    phoneNumber: userInfo.phoneNumber,
                    bio: userInfo.bio
                }))
                
                setAvatar(userInfo.avatar)
                setName(userInfo.name)
                setGender(userInfo.gender)
                setBirthday(userInfo.birthday.toDate())
                setPhoneNumber(userInfo.phoneNumber)
                setBio(userInfo.bio)
            })


        }
    , [])

    const handleClickEdit = () => {
        setIsEditing(true)
        // setNewInfo(info)
    }

    const handleClickBack = () => {
        setIsEditing(false)
    }

    const [avatar, setAvatar] = useState('')
    const [name, setName] = useState('') 
    const [gender, setGender] = useState('none')
    const [birthday, setBirthday] = useState(new Date())
    const [phoneNumber, setPhoneNumber] = useState('')
    const [bio, setBio] = useState('')

    return (
    <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
    >
        <View style={{flex: 1}}>
            <BarHeader navigation={navigation} header={isEditing ? 'Edit Profile' : 'Profile'}/>
            <Image source={userAvatar} style={styles.avatar} />

            <View style={styles.container}>
                <View>
                    <View style={styles.box}>
                        <Text> Name </Text>
                        <TextInput 
                        onChangeText={text => setName(text)}
                        editable={isEditing}
                        textAlign='right' 
                        placeholder='Name' 
                        style={{padding: 5}}
                        // value={info.name}
                        // defaultValue={info.name}
                        value={isEditing ? name : info.name}
                        />
                    </View>

                    <TouchableOpacity 
                        style={styles.box}
                    >
                        <Text>Gender</Text>
                        <Picker
                            style={{width: 120}}
                            onValueChange={(value, idx) => setGender(value)}
                            selectedValue={isEditing ? gender : info.gender}
                        >
                            <Picker.Item label='Male' value='male'/>
                            <Picker.Item label='Female' value='female'/>
                            <Picker.Item label='None' value='none'/>
                        </Picker>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        // disabled={isEditing}
                        style={styles.box}
                        onPress={isEditing ? handleOpenBirthday : () => {}}
                    >
                        <Text>Birth date</Text>
                        <TextInput
                        value={isEditing ? birthday.toLocaleDateString() : info.birthday.toLocaleDateString()}
                        editable={isEditing}
                        textAlign='right' 
                        placeholder='Birth date'
                        style={{padding: 5}}/>
                        <DateTimePicker
                            isVisible={isBirthdayVisible}
                            mode={'date'}
                            onCancel={handleCancelBirthday}
                            onConfirm={handleConfirmBirthday}
                        />
                    </TouchableOpacity>

                    <View style={styles.box}>
                        <Text>Phone number</Text>
                        <TextInput
                        value={isEditing ? phoneNumber : info.phoneNumber}
                        onChangeText={text => setPhoneNumber(text)}
                        editable={isEditing}
                        textAlign='right'
                        placeholder='Phone number'
                        style={{padding: 5}}/>
                    </View>

                    <View style={styles.box}>
                        <Text>Bio</Text>
                        <TextInput
                            value={isEditing ? bio : info.bio}
                            onChangeText={text => setBio(text)}
                            editable={isEditing}
                            textAlign='right'
                            placeholder='Bio'
                            style={{padding: 5}}
                        />
                    </View>
                </View>

                { !isEditing ? 
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                        style={styles.editButton}
                        onPress={handleClickEdit}
                        >
                            <Text style={styles.buttonText}>EDIT</Text>
                        </TouchableOpacity>
                    </View>
                :
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                        style={styles.editButton}
                        onPress={handleClickBack}
                        >
                            <Text style={styles.buttonText}>BACK</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                        style={styles.editButton}
                        onPress={handleClickSave}
                        >
                            {saveLoading ? <ActivityIndicator size='small' color='black' /> : <Text style={styles.buttonText}>SAVE</Text> }
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
