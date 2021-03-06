import React, { useState } from 'react'
import { Image, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Button } from 'react-native'
import { confirmReminder, deleteReminder, rescheduleReminder, unconfirmReminder } from '../api/ReminderApi';
import pillImg from '../assets/medicationPill.png';
import { useAuth } from '../Context/AuthContext';
import {Feather ,FontAwesome ,FontAwesome5 ,MaterialIcons, MaterialCommunityIcons} from '@expo/vector-icons'
import { removeReminder, toTimeString, updateMedicationFE, updateReminder } from '../shared/Functions';
import DateTimePicker from 'react-native-modal-datetime-picker';
import EditReminder from './EditReminder';
import MedicationModal from './MedicationModal';
import { Timestamp } from '@firebase/firestore';
export default function MedicationItem({navigation, reminders, setReminders, reminder}) {

    const [openModal, setOpenModal] = useState(false);

    const medicationId = reminder.medicationId
    const reminderId = reminder.id
    const medicationName = reminder.name
    const quantity = reminder.quantity
    const time = reminder.timestamp
    const isConfirmed = reminder.isConfirmed
    const isMissed = reminder.isMissed
    const note = reminder.note


    const { currentUser, medications, setMedications } = useAuth()

    const handleClickBack = () => {
        setOpenModal(false)
    }

    const handleClickConfirm = () => {
        // Update BE
        confirmReminder(currentUser.uid.toString(), reminder.medicationId, reminder.id)

        // Update FE
        let medicationDocument = medications.find( item => item.id == reminder.medicationId)
        medicationDocument.pillsInStock -= quantity

        let reminderIdx = medicationDocument.reminders.findIndex(item => item.id == reminder.id)
        let reminderDoc = medicationDocument.reminders[reminderIdx]
        medicationDocument.reminders[reminderIdx] = {
          ...reminderDoc,
          isConfirmed: true
        }

        setMedications(prev => [...medications.filter(item => item.id != reminder.medicationId), {...medicationDocument} ])

        setOpenModal(false)
    }

    const handleClickUnconfirm = () => {
        // Update BE
        unconfirmReminder(currentUser.uid.toString(), reminder.medicationId, reminder.id)


        // Update FE
        let medicationDocument = medications.find( item => item.id == reminder.medicationId)
        medicationDocument.pillsInStock += quantity

        let reminderIdx = medicationDocument.reminders.findIndex(item => item.id == reminder.id)
        let reminderDoc = medicationDocument.reminders[reminderIdx]
        medicationDocument.reminders[reminderIdx] = {
          ...reminderDoc,
          isConfirmed: false
        }

        setMedications(prev => [...medications.filter(item => item.id != reminder.medicationId), {...medicationDocument} ])
        
        setOpenModal(false)
    }

    const handleClickReschedule = () => {
      setIsReschedulingDate(true)
    }

    const [rescheduleDate, setRescheduleDate] = useState()
    const [isReschedulingDate, setIsReschedulingDate] = useState(false)
    const [isReschedulingTime, setIsReschedulingTime] = useState(false)

    const hideRescheduleDatePicker = () => {
      setOpenModal(false)
      setIsReschedulingDate(false)
    }

    const handleConfirmRescheduleDate = (day) => {
      setRescheduleDate(day)

      setIsReschedulingDate(false)
      setIsReschedulingTime(true)
    }

    const hideRescheduleTimePicker = () => {

      setIsReschedulingTime(false)
      setIsReschedulingDate(true)
    }

    const handleConfirmRescheduleTime = (day) => {
      let newDay = rescheduleDate
      newDay.setHours(day.getHours(), day.getMinutes(), 0)

      rescheduleReminder(currentUser.uid, medicationId, reminderId, newDay)

      const sort = true
      updateReminder(medications, setMedications, reminder.medicationId, reminder.id, {
        timestamp: newDay
      }, sort)

      setIsReschedulingTime(false)
      
    }

    const handleClickDeleteReminder = () => {
      deleteReminder(currentUser.uid, medicationId, reminderId)
      setOpenModal(false)

      removeReminder(medications, setMedications, reminder.medicationId, reminder.id)

    }

    const [isEditing, setIsEditing] = useState(false)

    const handleClickEditReminder = () => {
      setIsEditing(true)
    }

    const handleClickCheckInformation = () => {
      setOpenModal(false)
      navigation.navigate('Medication')
    }

    return (
        <View style={styles.container}>
            <Text style={styles.time}>{toTimeString(time)}</Text>

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
                            {note && note.length > 0 ? <Text>{note}</Text> : <></>}
                        </View>

                        { reminder.isConfirmed ? <MaterialIcons name='check-circle' color='green' size={22}/> : <></>}
                    </View>
                </View>
            </TouchableOpacity>

            {/* Medication modal */}
						<Modal
							visible={openModal}
							animationType='fade'
							transparent={true}
						>
              <TouchableWithoutFeedback onPress={() => setOpenModal(false)}>
							<View style={styles.modal}>
                {/* <Feather onPress={() => setOpenModal(false)} style={{position: 'absolute', top: 30, left: 20}} name='x' color='white' size={28}/> */}
								<View style={styles.modalContainer}>
                  <View style={styles.header}>
                    <Feather onPress={() => setOpenModal(false)} name='x' color='black' size={28}/>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', width: 100, alignItems: 'center'}}>
                      <MaterialCommunityIcons onPress={handleClickCheckInformation} name='information-outline' size={20}/>
                      <MaterialCommunityIcons onPress={handleClickEditReminder} name='pencil-outline' size={20}/>
                      <MaterialCommunityIcons onPress={handleClickDeleteReminder} name='trash-can-outline' size={20}/>
                    </View>
                  </View>

									<View style={styles.modalHeader}>
										<Image source={pillImg} style={{maxHeight: 80, maxWidth: 80}}/>
                    <Text style={styles.medicationText}>{medicationName}</Text>
									</View>

                  <View style={styles.modalContent}>
                    <View style={styles.modalInf}>
                      <FontAwesome size={20} name='calendar'/>
                      <Text style={styles.medicationInfText}>{toTimeString(time)}, {time.toDateString()}</Text>
                    </View>

                    <View style={styles.modalInf}>
                      <FontAwesome5 size={20} name='file-medical'/>
                      <Text style={styles.medicationInfText}>Take {quantity}</Text>
                    </View>

                    <View style={styles.modalInf}>
                      <FontAwesome size={20} name='pencil-square-o'/>
                      <Text style={styles.medicationInfText}>{note}</Text>
                    </View>

                    

                  </View>


									<View style={styles.buttonsContainer}>
                    <TouchableOpacity onPress={isConfirmed ? handleClickUnconfirm : handleClickConfirm} style={styles.modalButton}>
                      <MaterialCommunityIcons
                        name={isConfirmed ? 'reload' : 'check-circle-outline' }
                        size={28}/>
                      <Text>{isConfirmed ? 'Unconfirm' :  'Confirm'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleClickReschedule} style={styles.modalButton}>
                      <MaterialCommunityIcons name='alarm' size={28}/>
                      <Text>Reschedule</Text>
                    </TouchableOpacity>

                    <DateTimePicker
                      isVisible={isReschedulingDate}
                      mode='date'
                      onCancel={hideRescheduleDatePicker}
                      onConfirm={handleConfirmRescheduleDate}
                    />

                    <DateTimePicker
                      isVisible={isReschedulingTime}
                      mode='time'
                      onCancel={hideRescheduleTimePicker}
                      onConfirm={handleConfirmRescheduleTime}
                    />
									</View>

								</View>
							</View>
              </TouchableWithoutFeedback>
						</Modal>

            <Modal
              presentationStyle='fullScreen'
              visible={isEditing}
              animationType='slide'
            >
              <EditReminder
                setIsEditing={setIsEditing}
                reminder={reminder}
                // setRefresh={setRefresh}
              />
            </Modal>

            {/* <Modal
              visible={openMedicationPlan}
              animationType='slide'
            >
              <MedicationModal medication={medication} setOpenMedication={setOpenMedicationPlan} />
            </Modal> */}
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
        fontSize: 18,
        // fontWeight: 'bold',
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
    medicationText : {
        fontSize: 24,
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
        // width: 80
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
			width: '90%',
			height: '60%',
			backgroundColor: 'white',
			justifyContent: 'space-between',
			// padding: 10,
			borderRadius: 15,
      // flex: 1
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
		// flexDirection: 'column',
    // backgroundColor: 'beige',
		flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
	},
	buttonsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
    padding: 10,
    backgroundColor: '#53cbff',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15
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
	},
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#53cbff',
    padding: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15
  },
  modalInf: {
    flexDirection: 'row',
    // alignItems: 'center',
    marginVertical: 5,
    padding: 5,
    // borderWidth: 1
    // justifyContent: 'center'
  },
  medicationInfText: {
    fontSize: 16,
    color: 'black',
    marginLeft: 15
  },
  modalButton : {
    // justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent : {
    padding: 5,
    // backgroundColor: '#53cbff',
    // color: 'white'
  }
})
