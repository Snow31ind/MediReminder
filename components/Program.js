import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
// import App from '../App';
import { AuthProvider, useAuth } from '../Context/AuthContext';
import SplashScreen from '../screens/SplashScreen';
import AppStack from '../Stacks/AppStack';
import AuthStack from '../Stacks/AuthStack';
import { Scheduling } from './PushNotification';

export default function Program() {
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth()
    Scheduling()
    useEffect(() => {
      
      return setTimeout(() => setLoading(false), 1000);
    }, [])

    const { state } = useAuth();

    return (
        <>
        {loading ? <SplashScreen />
        : currentUser  ? <AppStack /> : <AuthStack />
        }
        </>
    )
}

const styles = StyleSheet.create({})
