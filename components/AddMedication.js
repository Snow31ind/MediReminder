import React, { useState } from "react";
import { StyleSheet, View, TextInput, TouchableWithoutFeedback, Button, Text, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { Keyboard } from "react-native";
import {MaterialIcons} from '@expo/vector-icons';
import {Picker} from '@react-native-picker/picker'
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function AddMedication({setOpenAddMedication ,addMedicationReminder, newMedication, newDate, setNewMedication, setNewDate, newTime, setNewTime}){
  // daily, specific, interval
  const [reminderType, setReminderType] = useState('daily');
  const [doses, setDoses] = useState(0);
  const [interval, setInterval] = useState(0);

  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

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
    setStartDatePickerVisibility(true);
  };

  const hideStartDatePicker = () => {
    setStartDatePickerVisibility(false);
  };

  const confirmStartDatePicker = async (date) => {
    await setStartDate(date);
    console.log(startDate);
    console.log('Start date chose: ', startDate.toLocaleDateString());

    hideDatePicker();
  };

  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };

  const hideEndDatePicker = () => {
    setEndDatePickerVisibility(false);
  };

  const confirmEndDatePicker = async (date) => {
    await setEndDate(date);
    console.log(startDate);
    console.log('End date chose: ', startDate.toLocaleDateString());

    hideDatePicker();
  }
  
  return (
        <ScrollView>
            <View style={styles.header}>
                <MaterialIcons
                    style={styles.headerIcon}
                    name='keyboard-backspace'
                    size={20}
                    onPress={() => {setOpenAddMedication(false)}}
                />
            </View>

            <TouchableWithoutFeedback
                onPress={() => {Keyboard.dismiss()}}
            >

                <View style={styles.input}>
                <TextInput 
                    placeholder='Medication'
                    underlineColorAndroid='black'
                    style={styles.inputForm}
                    value={newMedication}
                    onChangeText={(val) => {setNewMedication(val)}}
                />

                <TextInput 
                    placeholder='Number of doses'
                    keyboardType='numeric'
                    underlineColorAndroid='black'
                    style={styles.inputForm}
                    value={newMedication}
                    onChangeText={(val) => {setNewMedication(val)}}
                />

                <Picker
                  selectedValue={reminderType}
                  onValueChange={(type) => setReminderType(type)}
                >
                  <Picker.Item label='Every day' value='daily'/>
                  <Picker.Item label='Time Interval' value='interval'/>
                  <Picker.Item label='Specific day' value='specific' />
                </Picker>

                <View> 
                  <Text> Start date: </Text>
                  <TextInput
                    onPressIn={showStartDatePicker}
                    style={styles.inputForm}
                    underlineColorAndroid='black'
                    placeholder='Start date'
                    value={startDate.toLocaleDateString()}
                  />

                <DateTimePickerModal
                  isVisible={isStartDatePickerVisible}
                  mode="date"
                  onConfirm={confirmStartDatePicker}
                  onCancel={hideStartDatePicker}
                />

                  <Text> End date: </Text>
                  <TextInput
                    onPressIn={showEndDatePicker}
                    style={styles.inputForm}
                    underlineColorAndroid='black'
                    placeholder='End date'
                    value={endDate.toLocaleDateString()}
                  />

                <DateTimePickerModal
                  isVisible={isEndDatePickerVisible}
                  mode="date"
                  onConfirm={confirmEndDatePicker}
                  onCancel={hideEndDatePicker}
                />
                </View>
                
                {/* Type of reminder */}
                {
                  reminderType == 'specific' ?
                  daysInWeek.map(
                    (day) => (
                    //   <FlatList
                    //     data={daysInWeek}
                    //     keyExtractor={day => day.key}
                    //     renderItem={ ({ item }) => {
                    //       return (
                    //         <TouchableOpacity
                    //         style={{borderWidth: 2, marginTop: 5, flexDirection: 'row'}}
                    //     >
                    //       <Text> {item.day} </Text>
                    //         <MaterialIcons
                    //           style={{}}
                    //           name='check-box'
                    //         />
                    //       </TouchableOpacity>
                    //       )
                    //     }}
                    //   >
                    // </FlatList>

                    <TouchableOpacity
                          style={{borderWidth: 2, marginTop: 5, flexDirection: 'row'}}
                          key={day.key}
                        >
                          <Text> {day.day} </Text>
                            <MaterialIcons
                              style={{}}
                              name='check-box'
                            />
                        </TouchableOpacity>
                    )
                  ) : reminderType == 'interval' ?

                  <TextInput 
                  placeholder='Time interval'
                  keyboardType='numeric'
                  underlineColorAndroid='black'
                  style={styles.inputForm}
                  value={interval.toString()}
                  onChangeText={(val) => setInterval(val)}
                  />
                  :
                  <View>
                    
                  </View>
                }

                </View>
        </TouchableWithoutFeedback>
        
        <View style={styles.input}>
          <Button
            title='Add new medication'
            onPress={addMedicationReminder}
            style={styles.submitButton}
            color='coral'
            
          />
        </View>
      </ScrollView>
    )
};

const styles = StyleSheet.create({
    inputForm: {
      marginTop: 20,
      padding: 20,
      borderWidth: 2,
      height: 60,
      borderRadius: 10
    },
    input: {
      paddingTop: 20,
      paddingHorizontal: 20,
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

    },
    medicationInf: {
  
    },
    addMedication: {
  
    },
    header: {
        height: 60,
        backgroundColor: 'pink',
        alignItems: 'center',
        flexDirection: 'row'
    },
    headerIcon: {

    }

  })
