import React, { useEffect, useState } from "react";
import { StyleSheet, View, TextInput, TouchableWithoutFeedback, Button, Text, TouchableOpacity, ScrollView, FlatList, Modal } from "react-native";
import { Keyboard } from "react-native";
import {MaterialIcons} from '@expo/vector-icons';
import {Picker} from '@react-native-picker/picker'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DateTimePicker from "react-native-modal-datetime-picker";
import { useRef } from "react";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import ToggleSwitch from "toggle-switch-react-native";
import { Link } from "@react-navigation/native";

export default function AddMedication({setOpenAddMedication ,addMedicationReminder, newMedication, newDate, setNewMedication, setNewDate, newTime, setNewTime}){
  // daily, specific, interval
  const [reminderType, setReminderType] = useState('daily');
  const [doses, setDoses] = useState(0);
  const [interval, setInterval] = useState(0);

  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const daysInWeek = [
    {key: '0', day: 'Monday'},
    {key: '1', day: 'Tuesday'},
    {key: '2', day: 'Wednesday'},
    {key: '3', day: 'Thursday'},
    {key: '4', day: 'Friday'},
    {key: '5', day: 'Saturday'},
    {key: '6', day: 'Sunday'},
  ];

  const showStartDatePicker = () => {
    setStartDatePickerVisibility(!isStartDatePickerVisible);
  };

  const hideStartDatePicker = () => {
    setStartDatePickerVisibility(!isStartDatePickerVisible);
  };

  const confirmStartDatePicker = async (date) => {
    await setStartDate(date);
    console.log(startDate);
    console.log('Start date chose: ', startDate.toLocaleDateString());

    hideStartDatePicker();
  };

  const showEndDatePicker = () => {
    setEndDatePickerVisibility(!isEndDatePickerVisible);
  };

  const hideEndDatePicker = () => {
    setEndDatePickerVisibility(!isEndDatePickerVisible);
  };

  const confirmEndDatePicker = async (date) => {
    await setEndDate(date);
    console.log(startDate);
    console.log('End date chose: ', startDate.toLocaleDateString());

    hideEndDatePicker();
  }

  const [openSchedule, setOpenSchedule] = useState(false);
  const [openDetails, setOpenDetails] = useState(false)

  function FrequencyInf() {
    const frequencyModes = [
      {
        label: 'Every Day',
        value: 'daily'
      },
      {
        label: 'Specific Days',
        value: 'specific'
      },
      {
        label: 'Days Interval',
        value: 'interval'
      },
    ]

    const timeModes = [
      {
        label: 'Once a day',
        value: 1
      },
      {
        label: 'Twice a day',
        value: 2
      },
      {
        label: 'Three times a day',
        value: 3
      }, 
    ]

    const [frequency, setFrequency] = useState('daily')
    const [times, setTimes] = useState(1)

    const [reminders, setReminders] = useState([
    {
      time: '08:00',
      quantity: 1
    }
    ])

    const frequencyRef = useRef()
    const timeRef = useRef()

    function openFrequencyRef() {
      frequencyRef.current.focus()
    }

    function openTimesRef() {
      timeRef.current.focus()
    }

    function closeFrequency() {
      frequencyRef.current.blur()
    }
    
    useEffect(
      () => {
        const updateReminderList = () => {
          var doses = reminders.length
          console.log('Times=', times);
          if (doses < times) {
            var i
            for(i = doses; i < times; i++) {
              setReminders( prevReminders => [...prevReminders, {time: '08:00', quantity: 1}])
              console.log('i=', i);
            }
          } else if (doses > times) {
              setReminders( prevReminders => reminders.slice(0, doses - 1) )
          }
          
          console.log('Reminder list is updated now');
        }

        updateReminderList()
      }
    , [times])

    const [openReminderModal, setOpenReminderModal] = useState(false)

    const handleClickDecrementDose = (idx) => {
        // let arr = [...reminders]
        // arr[idx] = {time: arr.at(idx).time, quantity: arr.at(idx).quantity - 1}
        setReminders( reminders.map( (reminder, index) => (index == idx ? {time: reminder.time, quantity: reminder.quantity - 1} : reminder)))
    }

    const handleClickIncrementDose = (idx) => {
      setReminders( reminders.map( (reminder, index) => (index == idx ? {time: reminder.time, quantity: reminder.quantity + 1} : reminder)))
    }

    return (
        <ScrollView style={styles.container}>
          <View style={styles.headerBar}>
            <TouchableOpacity onPress={() => setOpenSchedule(false)} style={{flexDirection: 'row'}}>
              <MaterialIcons name='arrow-back' size={20} />
              {/* <Text>Back</Text> */}
            </TouchableOpacity>

            <Text>Schedule</Text>

            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity onPress={() => setOpenDetails(true)}>
                <Text>Next</Text>
                {/* <MaterialIcons onPress={() => {}} name='arrow-forward' size={20} /> */}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.buttonBox}>
            <Text>How often?</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={openFrequencyRef}
            >
              <Text>Frequency</Text>
              <Picker style={{width: 160, backgroundColor: ''}} ref={frequencyRef} onValueChange={(itemVlaue, itemIdx) => setFrequency(itemVlaue)} selectedValue={frequency}>
                {frequencyModes.map( (mode, idx) => <Picker.Item key={idx} label={mode.label} value={mode.value}/>)}
              </Picker>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonBox}>
            <Text>How many times a day?</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={openTimesRef}
            >
              <Text>{times}</Text>
              <Picker 
                ref={timeRef} 
                onValueChange={(itemValue, itemIdx) => {
                  console.log('Item value is:', itemValue);
                  setTimes(() => itemValue)
                }} 

                selectedValue={times}
              >
                {timeModes.map( (mode, idx) => <Picker.Item key={idx} label={mode.label} value={mode.value}/>)}
              </Picker>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonBox}>
            <Text>Set up your reminders</Text>
            { reminders.map( (reminder, idx) =>
              <View key={idx}>
                <TouchableOpacity onPress={() => setOpenReminderModal(true)} style={styles.reminder} key={idx}>
                  <Text>{reminder.time}</Text>
                  <Text>Take {reminder.quantity} pills</Text>
                </TouchableOpacity>

                <Modal transparent={true} visible={openReminderModal} animationType='fade'>
                  <View style={styles.modal}>
                    <View style={styles.modalContainer}>
                      <View style={styles.modalHeader}>
                        <Text style={{color: 'cyan', fontWeight: 'bold', fontSize: 16}} onPress={() => setOpenReminderModal(false)}>Cancel</Text>
                        <Text>Edit Reminder</Text>
                        <Text style={{color: 'cyan', fontWeight: 'bold', fontSize: 16}} onPress={() => setOpenReminderModal(false)}>Done</Text>
                      </View>

                      <View style={styles.modalTime}>

                      </View>
                      <View style={styles.modalDose}>
                        <TouchableOpacity disabled={reminder.quantity > 1 ? false : true} onPress={() => handleClickDecrementDose(idx)}>
                          <MaterialCommunityIcons name='minus-circle-outline' size={28}/>
                        </TouchableOpacity>

                        <Text>{reminder.quantity}</Text>

                        <TouchableOpacity onPress={() => handleClickIncrementDose(idx)}>
                          <MaterialCommunityIcons name='plus-circle-outline' size={28}/>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
              </View>
            )}
          </View>

          <DateTimePicker />
          <Text>Start date</Text>
          <Text>End date</Text>

        </ScrollView>
    )
  }
  
  function Details() {
    const [openToggleSwitch, setOpenToggleSwitch] = useState(false)

    return (
      <ScrollView style={styles.container}>
          <View style={styles.headerBar}>
            <TouchableOpacity onPress={() => {
              setOpenDetails(false)
              }} style={{flexDirection: 'row'}}>
              <MaterialIcons name='arrow-back' size={20} />
              {/* <Text>Back</Text> */}
            </TouchableOpacity>

            <Text>More Details</Text>

            <View style={{flexDirection: 'row'}}>
              {/* <Link to='/Home'>Done</Link> */}
              <TouchableOpacity onPress={() => {
                setOpenDetails(false)
                setOpenSchedule(false)
                setOpenAddMedication(false)
              }}>
                <Text>Done</Text>
                {/* <Mat/erialIcons onPress={() => {}} name='arrow-forward' size={20} /> */}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.buttonBox}>
            <Text>How many pills do you have in your stock?</Text>
              <View style={styles.button}>
                <Text>Pills in stock</Text>
                <TextInput placeholder='pills in stock' keyboardType='numeric' />
              </View>
          </View>

          <View style={styles.buttonBox}>
            <Text>Refill</Text>
              <View style={styles.button}>
                <Text>Refill reminder</Text>
                <ToggleSwitch
                  isOn={openToggleSwitch}
                  onColor='green'
                  offColor='gray'
                  onToggle={() => setOpenToggleSwitch(!openToggleSwitch)} />
              </View>
          </View>

        </ScrollView>
    )
  }

  return (
      <ScrollView style={styles.container}>
          <View style={styles.headerBar}>
            <TouchableOpacity onPress={() => setOpenAddMedication(false)} style={{flexDirection: 'row'}}>
              {/* <MaterialIcons name='arrow-back' size={20} />
              <Text>Back</Text> */}
              <Text>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setOpenSchedule(true)} style={{flexDirection: 'row'}}>
              <Text>Next</Text>
              {/* <MaterialIcons name='arrow-forward' size={20} /> */}
            </TouchableOpacity>
          </View>

          <Text>MED INFO</Text>
          <View style={styles.input}>
            <MaterialIcons name='medical-services' size={20} />
            <TextInput style={{marginLeft: 10, padding: 5}}  onChangeText={() => {}} placeholder='Medication name' />
          </View>

          <Modal visible={openSchedule} animationType='slide'>
            <FrequencyInf />
          </Modal>

          <Modal visible={openDetails} animationType='slide'>
            <Details/>
          </Modal>

      </ScrollView>
    )
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerBar: {
    height: 60,
    padding: 10,
    backgroundColor: '#53cbff',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  input : {
    flexDirection: 'row',
    alignItems:'center',
    padding: 10,
    backgroundColor: '#b0c4de',
    // color: 'white'
  },
  button : {
    flexDirection: 'row', 
    flex: 1, 
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'beige',
    paddingHorizontal: 10
  },
  reminder : {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'gray'
  },
  modal : {
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  modalHeader: {
      // height: 80,
      flexDirection: 'row',
      justifyContent: 'space-between'
  },
  modalContainer : {
    position: 'absolute',
    top: '50%',
    width: '100%',
    height: '50%',
    backgroundColor: 'gray'
  },
  modalDose: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  buttonBox : {
    marginVertical: 10
  }
})
