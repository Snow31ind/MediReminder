import React, { useEffect, useState } from "react";
import { StyleSheet, View, TextInput, TouchableWithoutFeedback, Button, Text, TouchableOpacity, ScrollView, FlatList, Modal } from "react-native";
import { Keyboard } from "react-native";
import {MaterialIcons} from '@expo/vector-icons';
import {Picker} from '@react-native-picker/picker'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
// import DateTimePicker from '@react-native-community/datetimepicker'
import DateTimePicker from "react-native-modal-datetime-picker";
import { useRef } from "react";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import ToggleSwitch from "toggle-switch-react-native";
import { Link } from "@react-navigation/native";
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc, Timestamp, updateDoc } from "@firebase/firestore";
import { setStatusBarHidden } from "expo-status-bar";
import { useUser } from "../Context/UserContext";
import { useAuth } from "../Context/AuthContext";
import { db } from "../firebase/Config";

export default function AddMedication({setRefresh, setOpenAddMedication ,addMedicationReminder, newMedication, newDate, setNewMedication, setNewDate, newTime, setNewTime}){
  // daily, specific, interval
  
  const [reminderType, setReminderType] = useState('daily');
  const [doses, setDoses] = useState(0);
  const [interval, setInterval] = useState(0);

  const { currentUser } = useAuth() 


  const dateInWeek = ['Monday', 'Tuesday', 'Wesnesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

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
    {
      label: 'Four times a day',
      value: 4
    },
    {
      label: 'Five times a day',
      value: 5
    },
    {
      label: 'Six times a day',
      value: 6
    }, 
  ]

  const [frequency, setFrequency] = useState('daily')
  const [times, setTimes] = useState(1)



  const frequencyRef = useRef()
  const timeRef = useRef()

  function openFrequencyRef() {
    frequencyRef.current.focus()
  }

  function openTimesRef() {
    timeRef.current.focus()
  }
  
  useEffect(
    () => {
      const updateReminderList = () => {
        var doses = reminders.length
        console.log('Times=', times);
        if (doses < times) {
          var i
          for(i = doses; i < times; i++) {

            const newReminder = {
              hour: 8,
              minute: 0,
              quantity: 1
            }

            setReminders( prevReminders => [...prevReminders, newReminder])
            console.log('i=', i);
          }
        } else if (doses > times) {
            setReminders( prevReminders => prevReminders.slice(0, times) )
        }
        
        console.log('Reminder list is updated now');
      }



      updateReminderList()
    }
  , [times])


  function DayChecker({day}) {
    const [selected, setSelected] = useState(true)

    return (
      <TouchableOpacity onPress={() => setSelected(!selected)} style={styles.checkBox}>
          <Text style={styles.checkText}>{day}</Text>
          {selected ? <MaterialIcons name='check' size={16} /> : <></>}
      </TouchableOpacity>
    )
  }

  function ReminderModal({reminders, setReminders, reminder, idx}) {
    const [openReminderModal, setOpenReminderModal] = useState(false)
    const [quantity, setQuantity] = useState(reminder.quantity)

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [date, setDate] = useState('')
    const [time, setTime] = useState(reminder)

    const getTime = (item) => {
      const h = item.hour
      const m = item.minute

      return (h < 10 ? '0' + h.toString() : h.toString()) + ':' + (m < 10 ? '0' + m.toString() : m.toString())

      // return (reminder.hour < 10 ? '0' + toString(reminder.hour) : toString(reminder.hour)) + ':' + (reminder.minute < 10 ? '0' + toString(reminder.minute) : toString(reminder.minute)) 
    }

    const showDatePicker = () => {
      setDatePickerVisibility(true);
    };
  
    const hideDatePicker = () => {
      setDatePickerVisibility(false);
    };
  
    const handleConfirm = (day) => {
      // console.log(day.getHours());
      // console.log(day.getMinutes());
      // // const timestamp = day.getHours().toString() + ':' + (day.getMinutes() < 10 ?  '0' + day.getMinutes().toString() : day.getMinutes().toString())
      // // console.log('Timestamp:', timestamp);
      // setTime( prevTime => ({...prevTime, hour: day.getHours(), minute: day.getMinutes()}))
      // console.log(time);

      // console.log(day);
      // console.log(day.getHours());
      // console.log(day.getMinutes());

      setTime( prevTime => ({
        ...prevTime,
        hour: day.getHours(),
        minute: day.getMinutes()
      }))

      hideDatePicker();
    };

    const handleClickDecrementDose = () => {
      setTime( prevTime => ({...prevTime, quantity: prevTime.quantity - 1}))
    }

    const handleClickIncrementDose = () => {
      setTime( prevTime => ({...prevTime, quantity: prevTime.quantity + 1}))
    }

    const handleClickDone = () => {

        setReminders( reminders.map( (reminder, index) => (index == idx ? time : reminder)))
        setOpenReminderModal(!openReminderModal)
        console.log(reminders);
    }
    
    const position = (idx) => {
      const pos = ['1st', '2nd', '3rd']

      if (idx > 2) return (idx + 1).toString() + 'th';
      else return pos[idx]
    }



    return (
      <>
        <TouchableOpacity onPress={() => setOpenReminderModal(!openReminderModal)} style={styles.reminder}>
          <Text>{position(idx)}</Text>
          <Text>{getTime(time)}</Text>
          <Text>Take {reminder.quantity} pills</Text>
        </TouchableOpacity>

        <Modal transparent={true} visible={openReminderModal} animationType='fade'>
          <View style={styles.modal}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={{color: 'tomato', fontWeight: 'bold', fontSize: 16}} onPress={() => setOpenReminderModal(!openReminderModal)}>Cancel</Text>
                <Text>Edit Time And Doses</Text>
                <Text style={{color: '#53cbff', fontWeight: 'bold', fontSize: 16}} onPress={handleClickDone}>Done</Text>
              </View>

              <View style={{justifyContent: 'space-evenly', flex: 1}}>
                <TouchableOpacity onPress={showDatePicker} style={styles.modalTime}>
                  <Text>Time</Text>
                  <View style={{flexDirection: 'row'}}>
                    <Text>{getTime(time)}</Text>
                    <MaterialIcons name='arrow-right' size={20} />
                  </View>
                  <DateTimePicker
                    isVisible={isDatePickerVisible}
                    mode={'time'}
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                  />
                </TouchableOpacity>
                <View style={styles.modalDose}>
                  <Text>Quantity</Text>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: 120}}>
                    <TouchableOpacity disabled={quantity > 1 ? false : true} onPress={handleClickDecrementDose}>
                      <MaterialCommunityIcons name='minus-circle-outline' size={28}/>
                    </TouchableOpacity>
                    <Text>{time.quantity}</Text>
                    <TouchableOpacity onPress={handleClickIncrementDose}>
                      <MaterialCommunityIcons name='plus-circle-outline' size={28}/>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        
      </>
      )
  }

  const [openToggleSwitch, setOpenToggleSwitch] = useState(true)

  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  const showStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };

  const hideStartDatePicker = () => {
    // setStartDate(null)
    setStartDatePickerVisibility(false);
  };

  const handleConfirmStartDate = (day) => {
    setStartDate(day)
    setStartDatePickerVisibility(false);

    // setMedication( prevMedication => ({...prevMedication, startDate: day}) )
    // setStartDate(day)
  };

  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };

  const hideEndDatePicker = () => {
    setEndDate(null)
    setEndDatePickerVisibility(false);
  };

  const handleConfirmEndDate = (day) => {
    setEndDate(day)
    setEndDatePickerVisibility(false);

    // setMedication( prevMedication => ({...prevMedication, endDate: day}) )
  };

  
  const handleClickDoneAddMedication = () => {

    // console.log('Medication details:',medication);
    const medication = {
      name: name,
      pillsInStock: pillsInStock,
      startDate: startDate,
      endDate: endDate ? endDate : null,
      refill: refill
    }
    // console.log(medication);
    // console.log('Plans details:', reminders);
    // console.log('Medication plan:', setUpReminders(startDate, endDate));

    const createMedicationPlan = async () => {
      const userMedicationsRef = collection(db, 'users', currentUser.uid.toString(), 'medications')

      try {
        await addDoc(userMedicationsRef, {
          createdAt: serverTimestamp(),
          name: name,
          pillsInStock: parseInt(pillsInStock),
          startDate: Timestamp.fromDate(startDate),
          endDate: endDate ? Timestamp.fromDate(endDate) : null,
          refill: refill
        }).then( doc => {
          // console.log(doc.id.toString());
          const userMedicationRemindersRef = collection(db, 'users', currentUser.uid.toString(), 'medications', doc.id.toString(), 'reminders')
          
          const createMedicationReminders = async () => {
            const plans = setUpReminders(startDate, endDate)

            for(let plan of plans) {
              await addDoc(userMedicationRemindersRef, {
                ...plan,
                timestamp: Timestamp.fromDate(plan.timestamp)
              })
            }
          }
          
          createMedicationReminders()
        })

      } catch (error) {
        console.log('Error in inserting a new medication plan:', error.message);
      }
    }

    createMedicationPlan()
    setOpenAddMedication(false)

    setRefresh(prev => prev + 1)
  }

  const setUpReminders = (startDate, endDate) => {
    let res = []

    if (endDate) {
      let date = new Date(startDate)
  
      while(date < endDate) {
        reminders.forEach( plan => {
          date.setHours(plan.hour, plan.minute, 0)
          res = [...res, {
            timestamp: new Date(date),
            quantity: plan.quantity,
            isConfirmed: false,
            isMissed: false
          }]
        })
    
        date.setDate(date.getDate() + 1)
      }
    } else {
      let date = new Date(startDate)
      let count = parseInt(pillsInStock)
      while (count > 0) {
        reminders.forEach( plan => {
          date.setHours(plan.hour, plan.minute, 0)
          res = [...res, {
            timestamp: new Date(date),
            quantity: plan.quantity,
            isConfirmed: false,
            isMissed: false
          }]
          count -= 1
        })

        date.setDate(date.getDate() + 1)
      }
    }
  
    return res
  }

  const handleToggleRefill = () => {
    // setMedication( prevMedication => ({...prevMedication, refill: !openToggleSwitch}) )
    setRefill(!openToggleSwitch)
    setOpenToggleSwitch(prev => !prev)
  }

  const [name, setName] = useState('')
  const [pillsInStock, setPillsInStock] = useState('')
  const [refill, setRefill] = useState(true)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(null)
  const [reminders, setReminders] = useState([
    {
      hour: 8,
      minute: 0,
      quantity: 1
    }
    ])

  return (
      <ScrollView style={styles.container}>

          <View style={styles.headerBar}>
            <TouchableOpacity onPress={() => setOpenAddMedication(false)} style={{flexDirection: 'row'}}>
              {/* <MaterialIcons name='arrow-back' size={20} />
              <Text>Back</Text> */}
              <Text>Cancel</Text>
            </TouchableOpacity>

            <Text>New Medication</Text>
            <TouchableOpacity onPress={handleClickDoneAddMedication} style={{flexDirection: 'row'}}>
              <Text>Done</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.boxContainer}>
              <Text style={styles.boxHeaderText}>Med Info</Text>
              <View style={styles.input}>
                <MaterialIcons name='medical-services' size={20} />
                <TextInput
                  style={{marginLeft: 10, padding: 5}}
                  // onChangeText={text => setMedication( prevMedication => ({...prevMedication, name: text}))}
                  onChangeText={text => setName(text)}
                  placeholder='Medication name'
                />
              </View>
            </View>

            <View style={styles.buttonBox}>
              <Text style={styles.boxHeaderText}>Frequency?</Text>
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

            { frequency === 'interval' ?
            <View style={styles.buttonBox}>
              <Text>How often?</Text>
              <View style={styles.button}>
                <Text>Every</Text>
                <TextInput placeholder='days' keyboardType='numeric' />
              </View>
            </View>
            :
            <></>
            }

            <View style={styles.buttonBox}>
              <Text style={styles.boxHeaderText}>How many times a day?</Text>
              {/* <View style={styles.button}>
                  <TextInput onChange={text => setTimes(text)} value={times}  placeholder='times' keyboardType='numeric' />
                  <Text>time(s) a day</Text>
              </View> */}

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
              <Text style={styles.boxHeaderText}>Set up your reminders</Text>
              <View style={{paddingHorizontal: 20}}>
                { reminders.map( (reminder, idx) => <ReminderModal key={idx} reminders={reminders} setReminders={setReminders} idx={idx} reminder={reminder} />)}
              </View>
            </View>
            
            {
              frequency === 'specific' ?
              <View style={styles.buttonBox}>
                <Text>Which days?</Text>
                { dateInWeek.map( day => <DayChecker day={day}/>)}
              </View>
              :
              <></>
            }

            <View style={styles.buttonBox}>
              <Text style={styles.boxHeaderText}>How many pills do you have in your stock?</Text>
                <View style={styles.button}>
                  <Text>Pills in stock</Text>
                  <TextInput
                    // onChangeText={text => setMedication( prev => ({...prev, pillsInStock: text}))}
                    // onChangeText={text => setPis(text)}
                    onChangeText={text => setPillsInStock(text)}
                    placeholder='pills in stock'
                    keyboardType='numeric'
                  />
                </View>
            </View>

            <View style={styles.buttonBox}>
              <Text style={styles.boxHeaderText}>Refill</Text>
                <View style={styles.button}>
                  <Text>Refill reminder</Text>
                  <ToggleSwitch
                    isOn={openToggleSwitch}
                    onColor='green'
                    offColor='gray'
                    onToggle={handleToggleRefill}
                  />
                </View>
            </View>

            
            <View style={{flexDirection: 'row'}}>
              <Text>Starts in </Text>
              <Text onPress={showStartDatePicker} style={styles.dayText}>{startDate.toDateString()}</Text>
              <DateTimePicker
                isVisible={isStartDatePickerVisible}
                mode={'date'}
                onCancel={hideStartDatePicker}
                onConfirm={handleConfirmStartDate}
              />
            </View>

            <View style={{flexDirection: 'row'}}>
              {endDate ? <Text>Ends in </Text>: <Text>Tap to set </Text>}
              <Text  onPress={showEndDatePicker} style={styles.dayText}>{endDate ? endDate.toDateString() : 'end date'}</Text>
              <DateTimePicker
                isVisible={isEndDatePickerVisible}
                mode={'date'}
                onCancel={hideEndDatePicker}
                onConfirm={handleConfirmEndDate}
              />
            </View>

          </View>

          {/* <Modal visible={openSchedule} animationType='slide'>
            <FrequencyInf />
          </Modal>

          <Modal visible={openDetails} animationType='slide'>
            <Details/>
          </Modal> */}

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
  button : {
    flexDirection: 'row', 
    flex: 1, 
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#53cbff',
    // borderRadius: 10,
    paddingHorizontal: 10,
    height: 60
  },
  reminder : {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#53cbff',
    borderRadius: 10,
    marginVertical: 5
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
    // justifyContent: '',
    // backgroundColor: 'gray'
    backgroundColor: 'white'
  },
  modalDose: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  modalTime : {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },  
  buttonBox : {
    marginVertical: 10
  },
  boxHeaderText : {
    // marginLeft: 5,
    // marginTop: 5,
    fontWeight: 'bold'
  },
  contentContainer : {
    flex: 1,
    // backgroundColor: '#53cbff'
    // padding: 5,
  },
  input : {
    flexDirection: 'row',
    alignItems:'center',
    padding: 10,
    backgroundColor: '#53cbff',
    height: 60
    // borderRadius: 10
    // color: 'white'
  },
  contentContainer : {
    // padding: 10
  },

  checkBox : {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#53cbff',
    padding: 5,
    borderBottomWidth: 1
  },
  checkText : {

  },

  dayText : {
    fontWeight: 'bold',
    color: 'tomato'
  }
})
