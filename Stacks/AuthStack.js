import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import LoginScreen from '../screens/LogInScreen'
import SignUpScreen from '../screens/SignUpScreen'
const Drawer = createDrawerNavigator();

const AuthStack = () => {
    return (
      <NavigationContainer>
        <Drawer.Navigator>
            <Drawer.Screen name='Login' component={LoginScreen} />
            <Drawer.Screen name='Sign up' component={SignUpScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    )
}

export default AuthStack

const styles = StyleSheet.create({})
