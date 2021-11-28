import React, { useState } from 'react'
import { Image, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Button } from 'react-native'
import { confirmReminder, unconfirmReminder } from '../api/ReminderApi';
import pillImg from '../assets/medicationPill.png';
import { useAuth } from '../Context/AuthContext';
import {MaterialIcons} from '@expo/vector-icons'

export default function MedicationItem({setRefresh, reminder}) {

    const [openModal, setOpenModal] = useState(false);

    const reminderId = reminder.id
    const medicationName = reminder.name
    const quantity = reminder.quantity
    const time = (
        (reminder.timestamp.getHours() < 10 ? '0' : '')
        + reminder.timestamp.getHours()
        + ':'
        + (reminder.timestamp.getMinutes() < 10 ? '0' : '')
        + reminder.timestamp.getMinutes()
    )
    const isConfirmed = reminder.isConfirmed
    const isMissed = reminder.isMissed

    const { currentUser } = useAuth()

    const handleClickBack = () => {
        setOpenModal(false)
    }

    const handleClickConfirm = () => {
        confirmReminder(currentUser.uid.toString(), reminder.medicationId, reminder.id)
        setOpenModal(false)
        setRefresh()
    }

    const handleClickUnconfirm = () => {
        unconfirmReminder(currentUser.uid.toString(), reminder.medicationId, reminder.id)
        setOpenModal(false)
        setRefresh()
    }

    return (
        <View style={styles.container}>
            <Text style={styles.time}>{time}</Text>
            <TouchableOpacity onPress={() => {setOpenModal(!openModal)}}>
                <View style={styles.contentContainer}>
                    <View style={{padding: 5}}>
                        <Image
                            source={pillImg}
                            style={{width: 40, height: 40}}
                        />
                    </View>
                    
                    <View style={styles.reminderInf}>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>{medicationName}</Text>
                            <Text>Take {quantity}</Text>
                            {/* <View style={styles.timeContainer}>
                                <Text style={styles.time}>{time}</Text>
                            </View> */}
                        </View>

                        {/* <View> */}
                        { reminder.isConfirmed ? <MaterialIcons name='check-circle' color='green' size={22}/> : <></>}
                            {/* <Text style={styles.quantity}>x{quantity}</Text> */}
                        {/* </View> */}
                    </View>
                </View>
            </TouchableOpacity>

						<Modal
							visible={openModal}
							animationType='fade'
							transparent={true}
						>
							<View style={styles.modal}>
								<View style={styles.modalContainer}>
									<View style={styles.modalHeader}>
										<Image source={pillImg} style={{maxHeight: 80, maxWidth: 80}}/>

										<View style={[styles.textContainer, {marginLeft: 60, alignItems: 'center'}]}>
											<Text style={styles.text}>{medicationName}</Text>

											<View style={styles.timeContainer}>
												<Text style={{fontSize: 20, fontWeight: 'bold'}}>{time}</Text>
											</View>
										</View>

									</View>

									<Text style={[styles.modalQuantity, styles.quantity]}>Take {quantity}</Text>

									<View style={styles.buttonsContainer}>
										<TouchableOpacity
                                            style={[styles.modalButton, {backgroundColor: 'tomato'}]}
                                            onPress={handleClickBack}
                                        >
											<Text>Back</Text>
										</TouchableOpacity>
										<TouchableOpacity
                                            style={[styles.modalButton, {backgroundColor: '#53cbff'}]}
                                            onPress={reminder.isConfirmed ? handleClickUnconfirm  : handleClickConfirm}
                                        >
											<Text>{reminder.isConfirmed ? 'Unconfirm' : 'Confirm'}</Text>
										</TouchableOpacity>
									</View>

								</View>
							</View>
						</Modal>
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    contentContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        // margin: 20,
        padding: 15,
        borderRadius: 20,
        // borderWidth: 2,
        // borderColor: 'tomato',
        // borderStyle: 'solid',
        alignItems:'center',
        // justifyContent: 'space-between'
    },
    text: {
        fontSize: 20,
    },
    time: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
        marginBottom: 5
    },
    reminderInf : {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,

    },
    textContainer: {
        // backgroundColor: 'gray'
    },
    text : {
        fontSize: 16,
        fontWeight:'bold',
    },
    timeContainer : {
        backgroundColor: '#23AAE3',
        flexDirection: 'row',
        padding: 5,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        width: 80
        // backgroundColor: 'yellow'
    },
    quantity : {
        fontSize: 20
    },

		modal : {
			backgroundColor: 'rgba(52, 52, 52, 0.8)',
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center'
		},
		modalContainer: {
			width: '80%',
			height: '30%',
			backgroundColor: 'white',
			justifyContent: 'space-between',
			padding: 10,
			borderRadius: 20
			// alignItems: 'center'
		},
		medicationInfModal: {
			backgroundColor: 'beige',
			marginTop: '50%',
			marginBottom: '50%',
			height: '50%',
			marginHorizontal: 40,
			borderRadius: 10,
	},
	modalHeader: {
		flexDirection: 'row',
		// flex: 1
	},
	buttonsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-evenly'
	},
	modalButton: {
		padding: 15,
		borderRadius: 10,
		// width: 80,
		justifyContent: 'center',
		alignItems: 'center'
	},
	modalQuantity : {
		alignSelf: 'center'
	}
})
