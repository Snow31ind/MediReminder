import React, { useRef, useState } from 'react'
import { Image, StyleSheet, Text, Touchable, View, TouchableOpacity, TextInput, SafeAreaView } from 'react-native'
import pill from '../assets/medicationPill.png'
import {MaterialIcons, Ionicons, MaterialCommunityIcons} from '@expo/vector-icons'
import {Picker} from '@react-native-picker/picker'
import { deleteMedication, updateMedication } from '../api/ReminderApi'
import { useAuth } from '../Context/AuthContext'
import { deleteMedicationFE, toTimeString, updateMedicationFE } from '../shared/Functions'

export default function MedicationModal({setOpenModal, medication}) {


  const lastTaken = medication.reminders.findIndex(reminder => reminder.isConfirmed == true)
  const lastTakenReminder = lastTaken > -1 ?
  toTimeString(medication.reminders[lastTaken].timestamp)
  + ', '
  + medication.reminders[lastTaken].timestamp.toDateString()
  : 'None'

  const nextTaken = medication.reminders.findIndex(reminder => reminder.isConfirmed == false)
  const nextTakenReminder = nextTaken > -1 ?
  toTimeString(medication.reminders[nextTaken].timestamp)
  + ', '
  + medication.reminders[nextTaken].timestamp.toDateString()
  : 'Complete'

  const [isEditing, setEditing] = useState(false)
  
  const [quantity, setQuantity] = useState(medication.pillsInStock.toString())
  const [refill, setRefill] = useState(medication.refill)
  const [name, setName] = useState(medication.name)
  const refillRef = useRef()
  const { currentUser, medications, setMedications } = useAuth()

  const openRefillRef = () => {
    refillRef.current.focus()
  }

  const handleClickSave = () => {
    if (name == medication.name
      && parseInt(quantity) == medication.pillsInStock
      && refill == medication.refill) setEditing(false)

    const document = {
      name: name,
      pillsInStock: quantity != '' ?  parseInt(quantity) : 0,
      refill: refill
    }
    updateMedication(currentUser.uid.toString(), medication.id, document)

    // const pickedMedication = medications.find( item => item.id == medication.id )
    // setMedications(
    //   prevMedications => [...prevMedications.filter( item => item.id != medication.id), {...pickedMedication, ...document} ]
    // )

    updateMedicationFE(medications, setMedications, medication.id, document)
    
    setEditing(false)
  }

  const handleClickEdit = () => {
    setEditing(true)
  }

  const handleClickDelete = () => {
    deleteMedication(currentUser.uid.toString(), medication.id)

    deleteMedicationFE(medications, setMedications, medication.id)
    
    setOpenModal(false)
  }

  return (
    <SafeAreaView style={{flex: 1}}>
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <MaterialIcons name='arrow-back' size={20} onPress={() => setOpenModal(false)}/>
        <Text>Medication Plan</Text>
        <MaterialCommunityIcons name='trash-can-outline' size={20} onPress={handleClickDelete}/>
      </View>

      <View style={styles.content}>
        <View style={styles.medication}>
          <Image source={pill} style={styles.pillImage}/>
          {/* <Text>{medication.name}</Text> */}
          <TextInput
            underlineColorAndroid={isEditing ? 'black' : 'transparent'}
            style={{fontWeight: 'bold', padding: 5}}
            editable={isEditing}
            defaultValue={name}
            onChangeText={text => setName(text)}
          />
        </View>


        <View style={styles.reminder}>
          <View style={{alignItems: 'center'}}>
            <Text>Last Taken</Text>
            <Text>{lastTakenReminder}</Text>
          </View>

          <View style={{alignItems: 'center'}}>
            <Text>Next Reminder</Text>
            <Text>{nextTakenReminder}</Text>
          </View>
        </View>
      </View>

      <View style={styles.inf}>
        <View style={styles.field}>
          <Text>Prescription Refill</Text>
          <TextInput
            textAlign='center'
            underlineColorAndroid={isEditing ? 'black' : 'transparent'}
            keyboardType='numeric'
            style={{fontWeight: 'bold', padding: 5}}
            editable={isEditing}
            defaultValue={quantity}
            onChangeText={text => setQuantity(text)}
          />
          {/* <Text>{medication.pillsInStock}</Text> */}
        </View>

        <TouchableOpacity onPress={isEditing ? openRefillRef : () => {}} style={styles.field}>
          <Text>Remind Refill</Text>
          {/* <Text>{medication.refill ? 'Yes' : 'No'}</Text> */}

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{color: isEditing ? 'black' : 'gray', fontWeight: 'bold'}}>{refill ? 'Yes' : 'No'}</Text>

            <Picker
              enabled={isEditing}
              mode='dropdown'
              style={{width: 50}}
              ref={refillRef}
              onValueChange={(item, idx) => setRefill(item)}
              selectedValue={refill}
            >
              <Picker.Item value={true} label='Yes'/>
              <Picker.Item value={false} label='No'/>
            </Picker>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={isEditing ? handleClickSave : handleClickEdit} style={styles.button}>
          <Ionicons name={isEditing ? 'save-outline' : 'reload-circle-outline'} size={30} style={styles.buttonIcon} />
          <Text>{isEditing ? 'Save' : 'Update'}</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity onPress={handleClickDelete} style={styles.button}>
          <MaterialCommunityIcons name='trash-can-outline' size={30} style={styles.buttonIcon}/>
          <Text>Delete</Text>
        </TouchableOpacity> */}
      </View>
    </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerBar: {
    backgroundColor: '#53cbff',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  content: {
    flexDirection: 'column',
    // padding: 10
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  pillImage: {
    height: 80,
    width: 80
  },
  reminder : {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 10,
    borderBottomWidth: 1,
    // backgroundColor: '#53cbff'
    // flex: 1
  },
  medication: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    // backgroundColor: '#53cbff'
  },
  inf : {
    padding: 20
  },
  field: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    alignItems: 'center'
  },
  footer: {
    position:'absolute',
    bottom: 0,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#53cbff',
    // flex: 1,
    width: '100%',
    padding: 10
  },
  button: {
    alignItems: 'center'
  },
  buttonIcon: {
    
  }
})
