import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Button, TouchableWithoutFeedback, Keyboard, FlatList, Modal, Alert } from "react-native";
import CalendarStrip from 'react-native-calendar-strip';
import {MaterialIcons} from '@expo/vector-icons'
import AddMedication from "./AddMedication";
import MedicationItem from "./MedicationItem";
import { collection, doc, getDoc, getDocs } from "@firebase/firestore";
import { db } from "../firebase/Config";
import { log } from "react-native-reanimated";
import { AuthContext } from "../Context/AuthContext";
import { Divider } from "react-native-elements/dist/divider/Divider";
export default function Calendar({currentUserId}){
    const today = new Date().toLocaleDateString();

    const [date, setDate] = useState(today);
    const [newDate, setNewDate] = useState('');
    const [newMedication, setNewMedication] = useState('');
    const [newTime, setNewTime] = useState('');
    const [medicationsList, setMedicationsList] = useState([]);
    const [userId, setUserId] = useState('');
    const [selectedReminders, setSelectedReminders] = useState([]);
    const [currentReminders, setCurrentReminders] = useState([]);

    const convertDate = (date) => {
      return date.toDate().toLocaleDateString();
    }
    
    const [listMedication, setListMedication] = useState([
      {
        "id": "MFX28OWS1LH",
        "name": "Benicar",
        "reminder": {
          "id": "SBK51WRJ5PG",
          "timestamp": "08:00",
          "quantity": 4
        }
      },
      {
        "id": "QLH42QUI6UV",
        "name": "Lisinopril",
        "reminder": {
          "id": "XUG15CGB3DY",
          "timestamp": "08:00",
          "quantity": 3
        }
      },
      {
        "id": "LDM45HIH5VO",
        "name": "Fluoxetine HCl",
        "reminder": {
          "id": "NWZ04KIR9YH",
          "timestamp": "08:00",
          "quantity": 4
        }
      },
      {
        "id": "DGK09IPT9KV",
        "name": "Benicar",
        "reminder": {
          "id": "YNM20DHO1AI",
          "timestamp": "08:00",
          "quantity": 4
        }
      },
      {
        "id": "TGW18BQB4IK",
        "name": "Vyvanse",
        "reminder": {
          "id": "ZCN38JAI9XE",
          "timestamp": "08:00",
          "quantity": 3
        }
      },
      {
        "id": "SOA44JDE8IP",
        "name": "Methylprednisolone",
        "reminder": {
          "id": "EUX13TYH7UI",
          "timestamp": "08:00",
          "quantity": 4
        }
      },
      {
        "id": "RQS83UCI9EC",
        "name": "Allopurinol",
        "reminder": {
          "id": "CNQ43GZH5GE",
          "timestamp": "08:00",
          "quantity": 2
        }
      },
      {
        "id": "TJW29SKF6ZV",
        "name": "Metformin HCl",
        "reminder": {
          "id": "PWD30XPI1HX",
          "timestamp": "08:00",
          "quantity": 2
        }
      },
      {
        "id": "MHC42KWS0FV",
        "name": "Prednisone",
        "reminder": {
          "id": "QFX69RWE2ZS",
          "timestamp": "08:00",
          "quantity": 4
        }
      },
      {
        "id": "BIA46KHY9UY",
        "name": "Spiriva Handihaler",
        "reminder": {
          "id": "QNI51FGE4BZ",
          "timestamp": "08:00",
          "quantity": 3
        }
      }
    ])


    const addMedicationReminder = () => {
      if (newDate != '' && newMedication != '') {
        setListMedication([
          ...listMedication,
          {
            // key: (listMedication.length + 1).toString(),
            key: Math.random().toString(),
            medication: newMedication,
            time: newTime,
            date: newDate
          }
        ]);

        Keyboard.dismiss();
        setNewMedication('');
        setNewTime('');
        setNewDate('');
      }
    }

    const clearMedication = (key) => {
      setListMedication(
        (prevListMedication) => {
          return prevListMedication.filter(
            medication => medication.key != key
          )
        }
      )
    }

    const [openAddMedication, setOpenAddMedication] = useState(false);


    const getUserMedication = async () => {
      const userId = currentUserId;

      console.log('Current user id', userId);
      const pathToMedications = 'users' + '/' + userId + '/' + 'medications';
      const userRef = collection(db, pathToMedications);
      const medications = await getDocs(userRef);
      

      medications.docs.forEach(
        medication => {
          const getUserReminders = async () => {
            const pathToReminders = pathToMedications + '/' + medication.id + '/' + 'reminders';
            const remindersRef = collection(db, pathToReminders);
            const remindersDocs = await getDocs(remindersRef);
            const reminders = remindersDocs.docs.map( reminder => ({...reminder.data(), id: reminder.id}));

            setMedicationsList(
              (prevList) => ([...prevList, {...medication.data(), id: medication.id, reminders: reminders}])
            )
          }

          getUserReminders();
        }
      )
    }

    // useEffect(
    //   () => {

    //     console.log('User id in calendar', currentUserId);

    //     if (medicationsList.length == 0) getUserMedication();

    //     console.log('Reminders data are fetched');
    //     console.log('Current medication list', medicationsList);

    //   }
    // , [])

    return (
      <View style={styles.container}>
        <CalendarStrip
        scrollToOnSetSelectedDate={false}
        scrollable={true}
        scrollerPaging={true}
        style={{height: 80}}
        calendarColor={'white'}
        calendarHeaderStyle={{color: 'black'}}

        onDateSelected={(selectedDate) => {
            // * Display the reminders base on the selected date.
            // console.log(selectedDate.toDate().toLocaleDateString());

            // const res = medicationsList.map(
            //   medication => {
            //     const reminders = medication.reminders.filter(
            //       reminder => {return convertDate(reminder.timestamp) == convertDate(selectedDate);}
            //     )

            //     console.log(reminders);

            //     return reminders.map(
            //       reminder => ({
            //         id: medication.id,
            //         name: medication.name,
            //         reminder: reminder
            //       })
            //     )
            //   }
            // )

            // setSelectedReminders(() => res.flat(1));

            // console.log('Selected reminders are', selectedReminders);
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
          <View style={styles.list}>
            <Text style={{alignSelf: 'center', marginVertical: 5, fontSize: 18}}>Medications</Text>
            {/* <FlatList
              showsVerticalScrollIndicator={true}
              data={selectedReminders}
              keyExtractor={(item) => item.reminder.id}
              renderItem={({ item })  => {
                // if (item.timestamp == date) {
                //   return <MedicationItem key={Math.random()} medication={item.name} />
                // }
                return <MedicationItem key={Math.random()} reminder={item}/>
              }
              }
            /> */}
              <FlatList
              showsVerticalScrollIndicator={true}
              data={listMedication}
              keyExtractor={(item) => item.id}
              renderItem={({ item })  => {
                // if (item.timestamp == date) {
                //   return <MedicationItem key={Math.random()} medication={item.name} />
                // }
                return <MedicationItem key={item.id} reminder={item}/>
              }
              }
            />
          </View>
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
          <AddMedication 
            newDate = {newDate}
            newMedication={newMedication}
            setNewDate={setNewDate}
            setNewMedication={setNewMedication}
            setOpenAddMedication={setOpenAddMedication}
            addMedicationReminder={addMedicationReminder}
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

