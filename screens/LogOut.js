import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function LogOut({setIsSignedIn}) {
    return (
        <View>
            {setIsSignedIn(false)}
        </View>
    )
}

const styles = StyleSheet.create({

})
