import React, { useState } from 'react'
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Button } from 'react-native'

export default function MedicationItem({medication, clearMedication}) {
    const [openReminderInf, setOpenReminderInf] = useState(false);

    
    return (
        <View>
            <TouchableOpacity onPress={() => {setOpenReminderInf(!openReminderInf)}}>
                <View style={styles.textContainer}>
                    <Text>
                        {medication.medication}
                    </Text>
                <View style={{flex: 1}}>
                    <Text style={{textAlign: 'right'}}> {medication.time} </Text>
                </View>
                </View>
            </TouchableOpacity>

            <Modal
            animationType='fade'
            transparent={true}
            visible={openReminderInf}
            >
                <View style={{backgroundColor: 'rgba(52, 52, 52, 0.8)', flex: 1}}>
                    <View style={styles.medicationInfModal}>
                        <View>
                            <Text style={{fontSize: 30}}> {medication.medication} </Text>
                        </View>

                        <View style={
                            {
                                marginTop: '80%',
                                marginHorizontal: 20,
                                flexDirection: 'row',
                                // borderColor: 'orange',
                                // borderWidth: 2,
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
                                width: 80,

                                // justifyContent: 'flex-end',
                                // alignItems: 'flex-end',
                                // paddingLeft: 140,
                            }}>
                                <Button
                                    title='Confirm'
                                    onPress={() => {
                                        setOpenReminderInf(!openReminderInf);
                                        clearMedication(medication.key);
                                    }}
                                />
                            </View>
                        </View>

                    </View>
                </View>
            </Modal>
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
        borderColor: 'green',
        borderStyle: 'dotted'
    },
    medicationInfModal: {
        backgroundColor: 'beige',
        marginTop: '50%',
        marginBottom: '50%',
        height: '50%',
        marginHorizontal: 40,
        borderRadius: 10,
    }
})
