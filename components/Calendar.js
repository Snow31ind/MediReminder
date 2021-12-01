import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Button, TouchableWithoutFeedback, Keyboard, FlatList, Modal, Alert, ActivityIndicator } from "react-native";
import CalendarStrip from 'react-native-calendar-strip';
import {MaterialIcons} from '@expo/vector-icons'
import MedicationItem from "./MedicationItem";
import { collection, doc, getDoc, getDocs, onSnapshot, orderBy, query } from "@firebase/firestore";
import { db } from "../firebase/Config";
import { log, set } from "react-native-reanimated";
import { AuthContext, useAuth } from "../Context/AuthContext";
import { Divider } from "react-native-elements/dist/divider/Divider";
import MedicationForm from "./MedicationForm";
export default function Calendar({navigation}){
    const [newDate, setNewDate] = useState(''); 
    const [newMedication, setNewMedication] = useState('');
    const [newTime, setNewTime] = useState('');
    const [loading, setLoading] = useState(true)

    const [openAddMedication, setOpenAddMedication] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date())
    const [haveRemindersToday, setHaveRemindersToday] = useState(false)

    const { currentUser, medications, setMedications } = useAuth()

    useEffect(
      () => {
        console.log(medications)
        setTimeout(() => setLoading(false), 500)
      }
    , [])
    
    // const doEffect = async () => {
    //     setReminders(prev => [])
    //     setLoading(true)
        
    //     // Error: Have not sorted the array of reminders by timestamp
    //     // const getReminders = async () => {
    //       const userMedicationsRef = collection(db, 'users', currentUser.uid.toString(), 'medications')
    //       const userMedications = await getDocs(userMedicationsRef)
    //       var res = []

    //       for(let i = 0; i < userMedications.docs.length; i++) {
    //         let medication = userMedications.docs[i]

    //         const medicationRemindersRef = collection(db, 'users', currentUser.uid.toString(), 'medications', medication.id.toString(), 'reminders')
    //         const medicationRemindersDocs = await getDocs(medicationRemindersRef)
            

    //         let medicationReminders = medicationRemindersDocs.docs.map(
    //           reminder => ({
    //             ...medication.data(),
    //             medicationId: medication.id,
    //             ...reminder.data(),
    //             id: reminder.id,
    //             timestamp: reminder.data().timestamp.toDate()
    //           })
    //         )

    //         res = res.concat(medicationReminders)
    //       }

    //       res = res.sort( (a, b) => (a.timestamp - b.timestamp) )
    //       setReminders([...res])
          
    //       // console.log(res);
    //     setLoading(false)
    // }

    // const doEffect1 = async () => {
    //   // setReminders(prev => [])
    //   setLoading(true)
    //   // Error: Have not sorted the array of reminders by timestamp
    //   const getReminders = async () => {
    //     const userMedicationsRef = collection(db, 'users', currentUser.uid.toString(), 'medications')
    //     const userMedications = await getDocs(userMedicationsRef)


    //     for(let i = 0; i < userMedications.docs.length; i++) {
    //       let medication = userMedications.docs[i]

    //       // If there's any new medication plan, it will be added to reminders hook
    //       if (reminders.find(reminder => reminder.medicationId == medication.id) == null) {
    //         console.log('Medication with id = ', medication.id, 'is added.');
    //         const medicationRemindersRef = collection(db, 'users', currentUser.uid.toString(), 'medications', medication.id.toString(), 'reminders')
    //         const medicationRemindersDocs = await getDocs(medicationRemindersRef)

    //         for(let j = 0; j < medicationRemindersDocs.size; ++j) {
    //           let reminder = medicationRemindersDocs.docs[j]

    //           setReminders(prev => [...prev, {
    //             medicationId: medication.id,
    //             name: medication.data().name,
    //             ...reminder.data(),
    //             id: reminder.id,
    //             timestamp: reminder.data().timestamp.toDate()
    //           }])
    //         }
            
  
    //         // let medicationReminders = medicationRemindersDocs.docs.map(
    //         //   reminder => ({
    //         //     medicationId: medication.id,
    //         //     name: medication.data().name,
    //         //     ...reminder.data(),
    //         //     id: reminder.id,
    //         //     timestamp: reminder.data().timestamp.toDate()
    //         //   })
    //         // )
    //         // setReminders(prev => [...prev, ...medicationReminders])
    //       }
    //     }
    //   }
      
    //   await getReminders()
    //   setLoading(false)
    // }


    // useEffect(
    //   () => {
    //     doEffect()
    //   }
    // , [])

    const daysHavingReminders = medications
    .map( medication => medication.reminders )
    .flat(1)
    .map( reminder => reminder.timestamp )
    .reduce( (uniqueTimestamps, item) => {
      if (!uniqueTimestamps.includes(item)) uniqueTimestamps.push(item) 

      return uniqueTimestamps
    }, [])
    .sort( (a, b) => a - b)
    .map( reminder => reminder.toLocaleDateString())

    useEffect(
      () => {
        console.log(daysHavingReminders);
      }
    , [])



    const isHavingRemindersToday = () => {
      // for(var i = 0; i < medications.length; ++i) {
      //   for(var j = 0; j < medications[i].reminders.length; ++j) {
      //     if (medications[i].reminders[j].timestamp.toLocaleDateString() == currentDate.toLocaleDateString()) return true
      //   }
      // }

      return daysHavingReminders.includes(currentDate.toLocaleDateString())
    }

    if (loading)
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={60} color='#53cbff'/>
      </View>
    )

    if (!loading)
    return (
      
      <View style={styles.container}>
        <CalendarStrip
        scrollToOnSetSelectedDate={false}
        scrollable={true}
        scrollerPaging={true}
        style={{height: 80}}
        calendarColor={'white'}
        calendarHeaderStyle={{color: 'black'}}
        selectedDate={currentDate}
        onDateSelected={(selectedDate) => {
          console.log('Selected day:', selectedDate);
          setCurrentDate(new Date(selectedDate))
          // console.log('Current day:', currentDate);
        }}
        
        dateNameStyle={{color: 'black'}}
        dateNumberStyle={{color: 'black'}}

        highlightDateNameStyle={{color: '#53CBFF'}}
        highlightDateNumberStyle={{color: '#53CBFF'}}
        
        calendarAnimation={{type: 'sequence', duration: 15}}
        daySelectionAnimation={
          {
          type: "border",
          borderWidth: 2,
          borderHighlightColor: '#53CBFF',
          }
        }
        />

        <View style={styles.listContainer}>
          
          {/* {reminders.findIndex( reminder => reminder.timestamp.toLocaleDateString() == currentDate.toLocaleDateString()) > -1 ?
          <View style={styles.list}>
            <FlatList
              showsVerticalScrollIndicator={true}
              data={reminders}
              keyExtractor={(item) => item.id}
              renderItem={({ item })  => {

                if (currentDate.toLocaleDateString() === item.timestamp.toLocaleDateString())
                  return <MedicationItem navigation={navigation} reminders={reminders} setReminders={setReminders} key={item.id} setRefresh={doEffect} reminder={item}/>
              }
              }
            />
          </View>
          :
          <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
              <Text>No reminder today!</Text>
          </View>
          } */}
          { medications.length > 0 && isHavingRemindersToday() ? 
                      <FlatList
                      showsVerticalScrollIndicator={true}
                      data={medications}
                      keyExtractor={(item) => item.id}
                      renderItem={({ item })  => {
                        // console.log('----------------------------------------------');
                        // console.log(item.name);
                        // console.log(item.reminders[0]);
                        return item.reminders
                        .filter(reminder => { return reminder.timestamp.toLocaleDateString() == currentDate.toLocaleDateString()})
                        .map(reminder => <MedicationItem navigation={navigation} reminder={{
                          ...reminder,
                          medicationId: item.id,
                          name: item.name
                        }} key={reminder.id}/>)
                        // return [<MedicationItem reminder={item.reminders[1]}/>]
                      }
                      }
                    />
            :
            <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
              <Text>You have no medication today!</Text>
            </View>
          }


          {/* Add form Button */}
          <View style={styles.submitButton}>
            <MaterialIcons
              color='white'
              name='add-circle'
              size={48}
              onPress={() => setOpenAddMedication(true)}
            />
          </View>
        </View>

        <Modal
          animationType='slide'
          visible={openAddMedication}
          onRequestClose={() => {
            Alert.alert('Form has been closed');
          }}
        >
          <MedicationForm
            // setRefresh={doEffect}
            newDate = {newDate}
            newMedication={newMedication}
            setNewDate={setNewDate}
            setNewMedication={setNewMedication}
            setOpenAddMedication={setOpenAddMedication}
            newTime={newTime}
            setNewTime={setNewTime}
          />
        </Modal>
        
      </View>
    )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  list: {
    flex: 1,
    // backgroundColor: '#53cbff',
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#53cbff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  },
  medicationItem: {
    marginTop: 20,
    marginHorizontal: 20,
    padding: 10,
    flexDirection: 'row',
    borderWidth: 2,
    borderRadius: 10,
    borderStyle: "dotted"
  },
  submitButton: {
    position: 'relative',
    alignItems: 'center',
    marginVertical: 10,
    // backgroundColor: '#53cbff',
  }
})

// Có 1 vấn đề t đang gặp là: dữ liệu được đọc được xử lí nhanh hơn dữ liệu được ghi (và t chưa biết giải quyết nó như thế nào trong RN)
// nên khi mỗi lần mình insert hay remove 1 cái doc/collection mới ở các screen HomeScreen, RecordScreen, MedicationScreen,
// thì mình phải refresh lại cái screen đó (Ctrl + S trong cái file chứa screen đó) thì nó mới được cập nhật chính xác.
// Nên mọi người nhớ refresh lại nhe. Phase cuối còn 2 tuần thì t nghĩ mình sẽ giải quyết được cái này.
