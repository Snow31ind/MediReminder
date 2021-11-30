import React, { useState } from 'react'
import { Image, StyleSheet, Text, TextInput, View } from 'react-native'
import { updatePillsInStock, updateReminder, updateReminderQuantity } from '../api/ReminderApi'
import pill from '../assets/medicationPill.png'
import { useAuth } from '../Context/AuthContext'
import { toTimeString } from '../shared/Functions'

export default function EditReminder({setIsEditing, reminder, setRefresh}) {
  const { currentUser } = useAuth()

  const handleClickCancel = () => {
    setIsEditing(false)
  }

  const handleClickSave = () => {
    if (parseInt(quantity) != reminder.quantity || note != reminder.note) {
      const document = {
        quantity: quantity,
        note: note
      }

      updateReminder(currentUser.uid, reminder.medicationId, reminder.id, document)
      
      setIsEditing(false)
      setRefresh()
    } else setIsEditing(false)
  }

  const medicationName = reminder.name
  const timestamp = reminder.timestamp

  const [quantity, setQuantity] = useState(reminder.quantity.toString())
  const [note, setNote] = useState(reminder.note)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text onPress={handleClickCancel}>Cancel</Text>
        <Text>Edit Reminder</Text>
        <Text onPress={handleClickSave}>Save</Text>
      </View>

        <View style={{flexDirection: 'row', borderBottomWidth: 1, padding: 10}}>
          <Image source={pill} style={{height: 80, width: 80}}/>

          <View style={styles.reminder}>
            <Text style={styles.name}>{medicationName}</Text>
            <Text>Scheduled for {toTimeString(timestamp)}, {timestamp.toDateString()}</Text>
          </View>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10}}>
          <Text>Quantity</Text>
          <TextInput
            style={{padding: 5}}
            underlineColorAndroid={'black'}
            textAlign='center'
            onChangeText={text => setQuantity(text)}
            defaultValue={quantity}
            keyboardType='numeric'
          />
        </View>

        <View style={styles.note}>
          <Text>Notes</Text>
          <View
              style={{alignItems: 'flex-start', borderWidth: 1, borderRadius: 10, padding: 10, marginTop: 5}}
          >
            <TextInput
              defaultValue={note}
              textAlignVertical='top'
              onChangeText={text => setNote(text)}
              multiline={true}
              numberOfLines={5}
              // underlineColorAndroid='black'
              placeholder='Write your note here'
            />
          </View>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {

  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#53cbff'
  },
  name: {
    fontSize: 20
  },
  reminder: {
    // alignItems: 'center',
    justifyContent: 'space-around',
    padding: 15
  },
  box : {
    
  },
  note: {
    padding: 10,
  }
})
