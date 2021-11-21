import React from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'

const SplashScreen = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator
                color='53bceff'
                size={60}
            />
            <Text>Welcome to MediReminder!</Text>
        </View>
    )
}

export default SplashScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems :'center'
    }
})
