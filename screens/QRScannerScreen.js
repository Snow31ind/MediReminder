import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { NavigationContainer } from '@react-navigation/native';
// import HomeScreen from '../screens/HomeScreen';
import { addDoc, collection, collectionGroup, Timestamp } from '@firebase/firestore';
import { db } from '../firebase/Config';
import { useAuth } from '../Context/AuthContext';
import { confirmPushNotification, schedulePushNotification, Scheduling } from '../components/PushNotification';

export default function QRScannerScreen({navigation, setOpenQRCodeScanner}) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    Scheduling();

    useEffect(() => {
        (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
        })();
    }, []);

    const { currentUser, medications, setMedications } = useAuth()

    const handleBarCodeScanned = async ({ type, data }) => {
        setScanned(true);
        alert(`Data scanned: ${data}`);
        data = JSON.parse(data)
        console.log(data);
        
        // Add data to BE & FE
        const medicationNewDoc = {
            name: data.name,
            pillsInStock: data.pillsInStock,
            refill: data.refill,
            createdAt: Timestamp.fromDate(new Date()),
            updatedAt: Timestamp.fromDate(new Date()),
            startDate: Timestamp.fromDate(new Date(data.startDate)),
            endDate: data.endDate ? Timestamp.fromDate(new Date(data.endDate)) : null
        }

        const medicationDocRef = collection(db, 'users', currentUser.uid, 'medications')
        await addDoc(medicationDocRef, medicationNewDoc).then( async medicationDoc => {
            const remindersDocRef = collection(db, 'users', currentUser.uid, 'medications', medicationDoc.id, 'reminders')
            
            let array = []

            for(var i = 0; i < data.reminders.length; ++i) {
                const reminderNewDoc = {
                    quantity: data.reminders[i].quantity,
                    note: data.reminders[i].note,
                    isConfirmed: false,
                    isMissed: false,
                    timestamp: Timestamp.fromDate(new Date(data.reminders[i].timestamp)),
                    // createdAt: Timestamp.fromDate(new Date()),
                    updatedAt: Timestamp.fromDate(new Date())
                }

                await addDoc(remindersDocRef, reminderNewDoc).then( reminderDoc => {
                    array.push({
                        ...reminderDoc,
                        id: reminderDoc.id,
                        timestamp: new Date(data.reminders[i].timestamp),
                        createdAt: new Date(),
                        updatedAt: new Date()
                    })
                })
                const hour = new Date(data.reminders[i].timestamp).getHours();
                const minute = new Date(data.reminders[i].timestamp).getMinutes();

                schedulePushNotification(hour, minute, data.pillsInStock)
            }

            setMedications(prevMedications => [...prevMedications, {
                ...medicationNewDoc,
                id: medicationDoc.id,
                createdAt: new Date(),
                updatedAt: new Date(),
                reminders: array
            }])
        })
        
        confirmPushNotification();
    };

    const handleClickBack = () => {
        setOpenQRCodeScanner(false)
    }

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <BarCodeScanner 
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
            {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
            <Button title={'Back to Home'} onPress={handleClickBack} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },

});