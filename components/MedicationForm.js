import React, { useEffect, useState } from "react";
import { StyleSheet, View, TextInput, TouchableWithoutFeedback, Button, Text, TouchableOpacity, ScrollView, FlatList, Modal, SafeAreaView } from "react-native";
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
import { log } from "react-native-reanimated";

export default function MedicationForm({setRefresh, setOpenAddMedication ,addMedicationReminder, newMedication, newDate, setNewMedication, setNewDate, newTime, setNewTime}){
  // daily, specific, interval

  const pages = ['Info', 'Frequency', 'Stock']
  const [page, setPage] = useState(pages[0])
  const [errorMessage, setErrorMessage] = useState()
  
  const [reminderType, setReminderType] = useState('daily');
  const [doses, setDoses] = useState(0);
  const [interval, setInterval] = useState(1);
  const [minPillsInStock, setMinPillsInStock] = useState(1)

  const { currentUser, medications, setMedications } = useAuth() 


  const dateInWeek = ['Monday', 'Tuesday', 'Wesnesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const frequencyModes = [
    {
      label: 'Every Day',
      value: 'Daily'
    },
    // {
    //   label: 'Specific Days',
    //   value: 'Specific'
    // },
    {
      label: 'Days Interval',
      value: 'Interval'
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

  const [frequency, setFrequency] = useState('Daily')
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
              quantity: 1,
              note: ''
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
    const [note, setNote] = useState('')

    const getTime = (item) => {
      const h = item.hour
      const m = item.minute
      const str = (
        ((h % 12) < 10 ? '0' : '')
        + (h % 12).toString()
        + ':'
        + (m < 10 ?  '0' : '')
        + m.toString()
        + ' '
        + (h <= 12 ? 'AM' : 'PM')
      )
      return str
    }

    const showDatePicker = () => {
      setDatePickerVisibility(true);
    };
  
    const hideDatePicker = () => {
      setDatePickerVisibility(false);
    };
  
    const handleConfirm = (day) => {

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

    const handleClickWriteNote = (text) => {
      setNote(text)
      setTime( prevTime => ({...prevTime, note: note}))
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
                <Text style={{fontWeight: 'bold', fontSize: 16}} onPress={() => setOpenReminderModal(!openReminderModal)}>Cancel</Text>
                <Text style={{color: 'black'}}>Edit Time And Doses</Text>
                <Text style={{fontWeight: 'bold', fontSize: 16}} onPress={handleClickDone}>Done</Text>
              </View>

              <View style={{flex: 1, padding: 10}}>
                <TouchableOpacity onPress={showDatePicker} style={styles.modalTime}>
                  <Text style={styles.modalText}>Time</Text>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{fontSize: 20}}>{getTime(time)}</Text>
                    <MaterialIcons name='arrow-right' size={28} />
                  </View>
                  <DateTimePicker
                    isVisible={isDatePickerVisible}
                    mode={'time'}
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                  />
                </TouchableOpacity>

                <View style={styles.modalDose}>
                  <Text style={styles.modalText}>Doses</Text>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <TouchableOpacity
                      disabled={time.quantity === 1 ? true : false} 
                      onPress={handleClickDecrementDose}
                    >
                      <MaterialCommunityIcons
                        color={time.quantity === 1 ? 'gray' : 'tomato'}
                        name='minus-box-outline'
                        size={40}
                      />
                    </TouchableOpacity>

                    <Text style={{borderBottomWidth: 2, fontSize: 18}}>{time.quantity}</Text>

                    <TouchableOpacity
                      onPress={handleClickIncrementDose}
                    >
                      <MaterialCommunityIcons color='#53cbff' name='plus-box-outline' size={40}/>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.modalNote}>
                  <Text style={styles.modalText}>Note</Text>
                  <View style={{padding: 10, height: 100, borderWidth: 1, borderRadius: 20}}>
                    <TextInput
                      defaultValue={reminder.note}
                      placeholder='Write your note here'
                      textAlignVertical='top'
                      multiline={true}
                      numberOfLines={5}
                      onChangeText={handleClickWriteNote}
                    />
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
    setErrorMessage()

    if (day < new Date()) {
      setErrorMessage('Your medication should be scheduled from today.')
      setStartDate(new Date())
    } else setStartDate(day)

    setStartDatePickerVisibility(false);
  };

  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };

  const hideEndDatePicker = () => {
    setEndDate(null)
    setEndDatePickerVisibility(false);
  };

  const handleConfirmEndDate = (day) => {
    setErrorMessage()

    if (day <= startDate) {
      setErrorMessage('Your medication should be ended after the start day.')
    } else setEndDate(day)
    
    setEndDatePickerVisibility(false);

  };

  
  const handleClickDoneAddMedication = async () => {

    // console.log('Medication details:',medication);
    // const medication = {
    //   name: name,
    //   pillsInStock: pillsInStock,
    //   startDate: startDate,
    //   endDate: endDate ? endDate : null,
    //   refill: refill
    // }
    // console.log(medication);
    // console.log('Plans details:', reminders);
    // console.log('Medication plan:', setUpReminders(startDate, endDate));

    const createMedicationPlan = async () => {
      const userMedicationsRef = collection(db, 'users', currentUser.uid.toString(), 'medications')

      const medicationDocument = {
        createdAt: serverTimestamp(),
        name: name,
        pillsInStock: parseInt(pillsInStock),
        startDate: Timestamp.fromDate(startDate),
        endDate: endDate ? Timestamp.fromDate(endDate) : null,
        refill: refill,
        updatedAt: serverTimestamp()
      }

      try {
        await addDoc(userMedicationsRef, medicationDocument).then( medicationDoc => {
          // console.log(doc.id.toString());
          // setMedications(prevMedications => [...prevMedications, {...medicationDoc, id: medicationDoc.id, reminders: []}])

          const userMedicationRemindersRef = collection(db, 'users', currentUser.uid.toString(), 'medications', medicationDoc.id.toString(), 'reminders')
          
          const createMedicationReminders = async () => {
            const plans = setUpReminders(startDate, endDate)
            let array = []

            for(let plan of plans) {
              console.log('Plan:', plan);
              const reminderDocument = {
                ...plan,
                timestamp: Timestamp.fromDate(plan.timestamp),
                updatedAt: Timestamp.fromDate(plan.updatedAt)
              }
              console.log('ReminderDocument:', reminderDocument);

              await addDoc(userMedicationRemindersRef, reminderDocument).then(reminderDoc => {
                array.push({...plan, timestamp: plan.timestamp, updatedAt: plan.updatedAt, id: reminderDoc.id})
              }).catch(e => console.log('Error in adding reminders to a medication:', e.message))
            }

            setMedications(prevMedications => [...prevMedications, {...medicationDocument, startDate: startDate, endDate: endDate ? endDate : null, updatedAt: new Date(),  id: medicationDoc.id, reminders: array}])
          }
          
          createMedicationReminders()
        })

      } catch (error) {
        console.log('Error in inserting a new medication plan:', error.message);
      }
    }
      createMedicationPlan()
      // setRefresh()
      setOpenAddMedication(false)
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
            isMissed: false,
            note: plan.note,
            updatedAt: new Date(date)
          }]
        })
    
        date.setDate(date.getDate() + parseInt(interval))
      }
    } else {
      let date = new Date(startDate)
      let count = parseInt(pillsInStock)
      while (count > 0) {
        reminders.forEach( plan => {
          if (count >= plan.quantity) {
            date.setHours(plan.hour, plan.minute, 0)
            res = [...res, {
              timestamp: new Date(date),
              quantity: plan.quantity,
              isConfirmed: false,
              isMissed: false,
              note: plan.note,
              updatedAt: new Date(date)
            }]
            count -= plan.quantity
          } else count = 0
        })

        date.setDate(date.getDate() + parseInt(interval))
      }
    }
  
    return res
  }

  const handleToggleRefill = () => {
    // setMedication( prevMedication => ({...prevMedication, refill: !openToggleSwitch}) )
    setRefill(!openToggleSwitch)
    setOpenToggleSwitch(prev => !prev)
  }

  const handleCheckPillsInStock = (text) => {

    setErrorMessage()
    
    let minAmount = 0
    reminders.forEach( item => minAmount += item.quantity)

    if (text == '' ||  parseInt(text) < minAmount) {
      setErrorMessage(`You should have at least ${minAmount} pills`)
    } else {
      setPillsInStock(prev => text)
    }
  }

  const [name, setName] = useState('')
  const [pillsInStock, setPillsInStock] = useState('0')
  const [refill, setRefill] = useState(true)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(null)
  const [reminders, setReminders] = useState([
    {
      hour: 8,
      minute: 0,
      quantity: 1,
      note: ''
    }
    ])

  return (
    <>
    {/* Med Info */}
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={styles.container}>
          <View style={styles.headerBar}>
            <TouchableOpacity onPress={() => setOpenAddMedication(false)} style={{flexDirection: 'row'}}>
              <MaterialIcons name='arrow-back' size={20} />
              {/* <Text>Back</Text> */}
              {/* <Text>Cancel</Text> */}
            </TouchableOpacity>

            <Text>Add Medicine</Text>
            <TouchableOpacity onPress={name.length > 0 ? () => setPage('Frequency') : () => {}} style={{flexDirection: 'row'}}>
              <Text style={{color: name.length > 0 ? 'black' : 'gray'}}>Next</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.boxContainer}>
              <Text style={styles.boxHeaderText}>MED INFO</Text>
              <View style={styles.input}>
                <MaterialIcons name='medical-services' size={20} />
                <TextInput
                  style={{marginLeft: 10, padding: 5}}
                  // onChangeText={text => setMedication( prevMedication => ({...prevMedication, name: text}))}
                  // textAlign='right'
                  onChangeText={text => setName(text)}
                  placeholder='Medication name'
                  defaultValue={name}
                />
              </View>
            </View>
          </View>
      </ScrollView>
    </SafeAreaView>

      {/* Frequency*/}
      <Modal
        visible={page == 'Frequency' ? true : false}
        animationType='slide'
      >
        <SafeAreaView style={{flex: 1}}>
        <ScrollView style={styles.container}>
            <View style={styles.headerBar}>
              <TouchableOpacity onPress={() => setPage('Info')} style={{flexDirection: 'row'}}>
                <MaterialIcons name='arrow-back' size={20} />
                {/* <Text>Back</Text> */}
                {/* <Text>Cancel</Text> */}
              </TouchableOpacity>

              <Text>Schedule</Text>
              <TouchableOpacity onPress={() => setPage('Stock')} style={{flexDirection: 'row'}}>
                <Text>Next</Text>
                {/* <MaterialIcons name='arrow-forward' size={20}/> */}
              </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>

              <View style={styles.buttonBox}>
                <Text style={styles.boxHeaderText}>FREQUENCY</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={openFrequencyRef}
                >
                  <Text>{frequency}</Text>
                  <Picker 
                    ref={frequencyRef}
                    onValueChange={(itemValue, itemIdx) => setFrequency(itemValue)} 
                    selectedValue={frequency}
                  >
                    {frequencyModes.map( (mode, idx) => <Picker.Item key={idx} label={mode.label} value={mode.value}/>)}
                  </Picker>
                </TouchableOpacity>
              </View>

              { frequency === 'Interval' ?
              <View style={styles.buttonBox}>
                <Text style={styles.boxHeaderText}>HOW OFTEN?</Text>
                <View style={styles.button}>
                  <Text>Every</Text>
                  <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <TextInput
                      underlineColorAndroid='black'
                      textAlign='center'
                      style={{marginRight: 10, padding: 5}}
                      onChangeText={text => setInterval(text)}
                      placeholder='2'
                      keyboardType='numeric'
                    />
                    <Text>days</Text>
                  </View>
                </View>
              </View>
              :
              <></>
              }

              <View style={styles.buttonBox}>
                <Text style={styles.boxHeaderText}>HOW MANY TIMES A DAY?</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={openTimesRef}
                >
                  <Text>{times}</Text>
                  <Picker
                    ref={timeRef}
                    onValueChange={(itemValue, itemIdx) => {
                      // console.log('Item value is:', itemValue);
                      setTimes(() => itemValue)
                    }}
                    selectedValue={times}
                  >
                    {timeModes.map( (mode, idx) => <Picker.Item key={idx} label={mode.label} value={mode.value}/>)}
                  </Picker>
                </TouchableOpacity>
              </View>

              <View style={styles.buttonBox}>
                <Text style={styles.boxHeaderText}>SET TIME AND DOSES</Text>
                <View style={{}}>
                  { reminders.map( (reminder, idx) => <ReminderModal key={idx} reminders={reminders} setReminders={setReminders} idx={idx} reminder={reminder} />)}
                </View>
              </View>
              
              {
                frequency === 'Specific' ?
                <View style={styles.buttonBox}>
                  <Text>Which days?</Text>
                  { dateInWeek.map( (day,idx) => <DayChecker key={idx} day={day}/>)}
                </View>
                :
                <></>
              }

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
            {errorMessage && <Text style={{alignSelf: 'center', color: 'tomato', fontSize: 12}}>{errorMessage}</Text>}
        </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Stock modal */}
      <Modal
        visible={page == 'Stock' ? true : false}
        animationType='slide'
      >
      <SafeAreaView style={{flex: 1}}>
        <ScrollView style={styles.container}>
            <View style={styles.headerBar}>
              <TouchableOpacity onPress={() => setPage('Frequency')} style={{flexDirection: 'row'}}>
                <MaterialIcons name='arrow-back' size={20} />
                {/* <Text>Back</Text> */}
                {/* <Text>Cancel</Text> */}
              </TouchableOpacity>

              <Text>More Details</Text>
              <TouchableOpacity onPress={errorMessage ? handleClickDoneAddMedication : () => {}} style={{flexDirection: 'row'}}>
                <Text style={{color: errorMessage ? 'gray' : 'black'}}>Done</Text>
                {/* <MaterialIcons name='arrow-forward' size={20}/> */}
              </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>
            <View style={styles.buttonBox}>
              <Text style={styles.boxHeaderText}>HOW MANY PILLS DO YOU HAVE?</Text>
                <View style={styles.button}>
                  <Text>Pills in stock</Text>
                  <TextInput
                    // defaultValue={'0'}
                    textAlign='right'
                    onChangeText={handleCheckPillsInStock}
                    placeholder='0'
                    keyboardType='numeric'
                    // onChange={handleCheckPillsInStock}
                  />
                </View>
            </View>

            <View style={styles.buttonBox}>
              <Text style={styles.boxHeaderText}>REFILL</Text>
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

            </View>
            {errorMessage && <Text style={{alignSelf: 'center', color: 'tomato', fontSize: 12}}>{errorMessage}</Text>}
        </ScrollView>
      </SafeAreaView>
      </Modal>

    </>
    )
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerBar: {
    // height: 50,
    padding: 10,
    backgroundColor: '#53cbff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  button : {
    flexDirection: 'row', 
    // flex: 1, 
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#53cbff',
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 60
  },
  reminder : {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#53cbff',
    borderRadius: 15,
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
      justifyContent: 'space-between',
      backgroundColor: '#53cbff',
      // borderBottomWidth: 1,
      padding: 10
  },
  modalContainer : {
    position: 'absolute',
    top: '50%',
    width: '100%',
    height: '50%',
    // justifyContent: '',
    // backgroundColor: 'gray'
    backgroundColor: 'white',
    // padding: 10
  },
  modalDose: {
    // flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    // flex: 1
  },
  modalTime : {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  modalNote: {
    marginTop: 20
  }, 
  buttonBox : {
    marginVertical: 10
  },
  boxHeaderText : {
    marginLeft: 10,
    marginBottom: 3,
    fontWeight: 'bold'
  },
  input : {
    flexDirection: 'row',
    alignItems:'center',
    padding: 10,
    backgroundColor: '#53cbff',
    height: 60,
    borderRadius: 20,
    // justifyContent: 'space-between'
    // color: 'white'
  },
  contentContainer : {
    padding: 15
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
  },
  boxContainer: {
    // borderRadius: 10
  },
  modalText: {
    fontSize: 18
  }
})
