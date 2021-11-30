import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native'
// import { TouchableOpacity } from 'react-native-gesture-handler'
import BarHeader from '../shared/BarHeader'
import pill from '../assets/medicationPill.png'
import { MaterialIcons } from '@expo/vector-icons'
import { ScrollView } from 'react-native-gesture-handler'
import { useAuth } from '../Context/AuthContext'
import { collection, getDocs, orderBy, query } from '@firebase/firestore'
import { db } from '../firebase/Config'
import { ListItem } from 'react-native-elements/dist/list/ListItem'
import { toTimeString } from '../shared/Functions'
import { Modal } from 'react-native'
import MedicationModal from '../components/MedicationModal'



export default function MedicationScreen({navigation}) {
  const { currentUser } = useAuth()

  const [medications, setMedications] = useState([])

  const fetchData = async () => {
    setMedications([])

    const medicationsRef = collection(db, 'users', currentUser.uid, 'medications')
    const medicationsDocs = await getDocs(medicationsRef)
      
    medicationsDocs.docs.map( (medication) => {
      const getReminders = async () => {
        const remindersRef = query(collection(db, 'users', currentUser.uid, 'medications', medication.id, 'reminders'), orderBy('timestamp'))
        const remindersDocs = await getDocs(remindersRef)
        
        return {...medication.data(), id: medication.id, reminders: remindersDocs.docs.map(reminder => ({...reminder.data(), id: reminder.id, timestamp: reminder.data().timestamp.toDate()}))}
      }

      getReminders()
      .then( medication => {
        setMedications(prev => [...prev, medication])
      }).catch(e => console.log(e))
      })

  }

  useEffect(
    () => {
      fetchData()
    }
  , [])

  return (
    <View style={{flex: 1}}>
      <BarHeader navigation={navigation} header='Medications'/>
    {
      medications.length > 0 ?
      <>
        <Text style={{marginLeft: 10, marginTop: 10}}>CURRENTLY TAKING</Text>

        <ScrollView style={styles.contentContainer}>
          {medications.map(medication => <MedicationPlan key={medication.id} medication={medication} />)}
        </ScrollView>
      </>
      :
      <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Text>You haven't had any medication plan yet!</Text>
          <Text>Let's add one.</Text>
      </View>
    }

    </View>
  )

  function MedicationPlan({medication}) {
    const name = medication.name
    const pillsInStock = medication.pillsInStock
    const nextReminder = medication.reminders.find(reminder => reminder.isConfirmed == false)
  
    const [openModal, setOpenModal] = useState(false)
  
    useEffect(
      () => {
        console.log(nextReminder);
      }
    ,[])
  
    return (
      <>
        <TouchableOpacity onPress={() => setOpenModal(true)} style={styles.medicationContainer}>
            <Image source={pill} style={{width: 60, height: 60}}/>
  
            <View style={styles.medicationContent}>
              <View style={styles.medicationInf}>
                <Text style={styles.medicationName}>{name}</Text>
                <Text>Next: {nextReminder.timestamp.toDateString()} {toTimeString(nextReminder.timestamp)}</Text>
                {/* <Text>{nextReminder.toLocaleString()}</Text> */}
                {/* <Text>{nextReminder.id}</Text> */}
                <Text>{pillsInStock} pills left</Text>
              </View>
  
              <MaterialIcons name='arrow-right' size={20}/>
            </View>
        </TouchableOpacity>
  
        <Modal visible={openModal}>
          <MedicationModal medications={medications} setMedications={setMedications} setOpenModal={setOpenModal} medication={medication} />
        </Modal>
      </>
    )
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 10,
    marginBottom: 20
  },

  medicationContainer : {
    flexDirection: 'row',
    // flex: 1,
    backgroundColor: '#53cbff',
    padding: 10,
    marginVertical: 10,
    borderRadius: 10
  },
  medicationContent : {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 20
  },
  medicationInf : {

  },
  medicationName : {
    fontWeight: 'bold'
  }
})
