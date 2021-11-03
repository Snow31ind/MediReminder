import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'

export default function Account({setOpenAccount}) {
    return (
        <View>
            <Button 
                title='Close'
                onPress={() => setOpenAccount(false)}
            />
            <Text> Account </Text>
        </View>
    )
}

const styles = StyleSheet.create({

})
