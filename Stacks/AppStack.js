import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native';
import React from 'react'
import { View, Text } from 'react-native'

import HomeScreen from '../screens/HomeScreen';
import AccountScreen from '../screens/AccountScreen';
import NotificationScreen from '../screens/NotificationScreen';
import RecordScreen from '../screens/RecordScreen';
import SettingScreen from '../screens/SettingScreen';
import LogOutScreen from '../screens/LogOutScreen';
import MedicationScreen from '../screens/MedicationScreen';

const Drawer = createDrawerNavigator();

const AppStack = () => {
    return (
        <NavigationContainer>
            <Drawer.Navigator>
                <Drawer.Screen name='Home' component={HomeScreen} />
                <Drawer.Screen name='Account' component={AccountScreen} />
                <Drawer.Screen name='Record' component={RecordScreen} />
                <Drawer.Screen name='Medication' component={MedicationScreen} />
                <Drawer.Screen name='Notification' component={NotificationScreen}/>
                <Drawer.Screen name='Setting' component={SettingScreen} />
            </Drawer.Navigator>
        </NavigationContainer>
    )
}

export default AppStack
