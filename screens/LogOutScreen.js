import React, { useContext } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { AuthContext } from '../Context/AuthContext'

export default function LogOutScreen() {
    const { signOut } = useContext(AuthContext);

    return (
        <View>
            {signOut()}
        </View>
    )
}

const styles = StyleSheet.create({

})
