import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Button, TouchableWithoutFeedback, Keyboard, FlatList, Modal, Alert } from "react-native";
import CalendarStrip from 'react-native-calendar-strip';
import {MaterialIcons} from '@expo/vector-icons'
import AddMedication from "./AddMedication";
import MedicationItem from "./MedicationItem";
export default function Calendar(){
    const today = new Date().toLocaleDateString();

    const [date, setDate] = useState(today);
    
    const [listMedication, setListMedication] = useState([
      {
        key: '1',
        date: '28/10/2021',
        time: '08:00',
        medication: 'Canxi'
      },
      {
        key: '2',
        date: '27/10/2021',
        time: '18:00',
        medication: 'Magie'
      },
      {
        key: '3',
        date: '29/10/2021',
        time: '12:00',
        medication: 'Zinc'
      },
      {
        key: '4',
        date: '28/10/2021',
        time: '20:00',
        medication: 'Paracetamol'
      },
    ])

    const setSelectedDate = (selectedDate, callback) => {
      let selectedDateToLocaleDateString = (selectedDate.date() + '/' + (selectedDate.month() + 1) + '/' + selectedDate.year()); 
      setDate(selectedDateToLocaleDateString);
      callback(date);
    }

    const getDateToLocaleDateString = (selectedDate) => {
      return (selectedDate.date() + '/' + (selectedDate.month() + 1) + '/' + selectedDate.year());
    }

    const [newDate, setNewDate] = useState('');
    const [newMedication, setNewMedication] = useState('');
    const [newTime, setNewTime] = useState('');

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

    const markedDates = (date) => {
      for(let medication of listMedication) {
        if (medication.date == date) {
          return true;
        }
      }

      return false;
    }

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
          setDate(getDateToLocaleDateString(selectedDate));
          console.log(date);
          // setDate(setSelectedDate(selectedDate, console.log));
          // console.log(date);
          // console.log('Today is:', date);
          // console.log(getDate(selectedDate));
          // console.log('1:', selectedDate.calendar());
        }}
        
        dateNameStyle={{color: 'black'}}
        dateNumberStyle={{color: 'black'}}

        highlightDateNameStyle={{color: 'darksalmon'}}
        highlightDateNumberStyle={{color: 'darksalmon'}}
        highlightDateContainerStyle={{color: 'yellow'}}

        calendarAnimation={{type: 'sequence', duration: 15}}
        daySelectionAnimation={
          {
          type: "border",
          borderWidth: 2,
          borderHighlightColor: 'darksalmon'
          }
        }

        // markedDates={[
        //   {
        //     date: today,
        //     dots:[
        //       {
        //         color: 'red'
        //       }
        //     ]
        //   }
        // ]}
        />

        <View style={styles.list}>
          <FlatList
            showsVerticalScrollIndicator={true}
            data={listMedication}
            keyExtractor={(item) => item.key}

            renderItem={({ item })  => {
              if (date == item.date) {
                return (
                  <MedicationItem
                    medication={item}
                    clearMedication={clearMedication}
                  />
                )
              }
            }
            }
          />
        </View>

        {/* Add form Button */}
        <View style={styles.submitButton}>
          <MaterialIcons
            name='add-circle'
            size={48}
            onPress={() => setOpenAddMedication(true)}
          />
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
    flex: 1
  },
  list: {
    flex: 1,
    backgroundColor: 'beige'
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
    backgroundColor:'beige'
  }
})

