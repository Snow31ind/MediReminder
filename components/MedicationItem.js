import React, { useState } from 'react'
import { Image, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Button } from 'react-native'
import pillImg from '../assets/medicationPill.png';

function ReminderModal({openReminderInf, setOpenReminderInf, name, time, img, quantity}){
    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={openReminderInf}
            >
                <View style={{backgroundColor: 'rgba(52, 52, 52, 0.8)', flex: 1}}>
                    <View style={styles.medicationInfModal}>
                        <View>
                            <Text style={{fontSize: 30}}> {name} </Text>
                        </View>

                        <View style={
                            {
                                marginTop: '80%',
                                marginHorizontal: 20,
                                flexDirection: 'row',
                                justifyContent: 'center',
                            }
                        }>
                            <View style={
                                {
                                    width: 80,
                                    marginRight: 60
                                }
                            }>
                                <Button
                                    title='Back'
                                    onPress={() => setOpenReminderInf(!openReminderInf)}
                                />
                            </View>
                            
                            <View style={{
                                width: 80
                            }}>
                                <Button
                                    title='Confirm'
                                    onPress={() => {
                                        setOpenReminderInf(!openReminderInf);
                                    }}
                                />
                            </View>
                        </View>

                    </View>
                </View>
            </Modal>
    )
}

export default function MedicationItem({reminder}) {
    function addZero(i) {
        if (i < 10) {
            i = '0' + i
        }

        return i
    }

    const [openReminderInf, setOpenReminderInf] = useState(false);

    const medicationId = reminder.id;
    const medicationName = reminder.name;

    const reminderId = reminder.reminder;
    const image = reminder.reminder.image;
    const isMissed = reminder.reminder.isMissed;
    const isTaken = reminder.reminder.isTaken;
    const quantity = reminder.reminder.quantity;
    const timestamp = reminder.reminder.timestamp.toDate();

    const hour = addZero(timestamp.getHours()) + ':' + addZero(timestamp.getMinutes());

    return (
        <View>
            <TouchableOpacity onPress={() => {setOpenReminderInf(!openReminderInf)}}>
                <View style={styles.textContainer}>
                    <Image source={pillImg}
                        style={{maxWidth: 40, maxHeight: 40}}
                    />
                    <View style={{paddingHorizontal: 10 ,flexDirection: 'row', flex: 1, justifyContent: 'space-between'}}>

                        <Text style={styles.text}>
                            {medicationName}
                        </Text>
                        
                            <Text style={styles.time}> {hour} </Text>
                    </View>
                </View>
            </TouchableOpacity>

            <ReminderModal  openReminderInf={openReminderInf} setOpenReminderInf={setOpenReminderInf} name={medicationName}/>

        </View>
    )
}



const styles = StyleSheet.create({
    textContainer: {
        flexDirection: 'row',
        backgroundColor: 'beige',
        margin: 20,
        padding: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'tomato',
        borderStyle: 'solid',

        alignItems:'center',
        // justifyContent: 'space-between'
    },
    medicationInfModal: {
        backgroundColor: 'beige',
        marginTop: '50%',
        marginBottom: '50%',
        height: '50%',
        marginHorizontal: 40,
        borderRadius: 10,
    },
    text: {
        fontSize: 16,
    },
    time: {
        fontSize: 16,
    }
    
})
