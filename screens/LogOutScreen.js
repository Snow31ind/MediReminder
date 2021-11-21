import React from 'react'
import { StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAuth } from '../Context/AuthContext'

export default function LogOutScreen() {
    const { signout } = useAuth();

    const handleClick = async () => {
        try {
            await signout()
        } catch (error) {
            console.log('Log out error:', error.emssage);
        }
    }

    return (
        <View>
            
        </View>
    )
    // return signOut();
}

const styles = StyleSheet.create({

})
