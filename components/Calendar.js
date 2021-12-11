import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Button, TouchableWithoutFeedback, Keyboard, FlatList, Modal, Alert, ActivityIndicator } from "react-native";
import CalendarStrip from 'react-native-calendar-strip';
import {MaterialIcons, MaterialCommunityIcons} from '@expo/vector-icons'
import MedicationItem from "./MedicationItem";
import { collection, doc, getDoc, getDocs, onSnapshot, orderBy, query } from "@firebase/firestore";
import { db } from "../firebase/Config";
import { log, set } from "react-native-reanimated";
import { AuthContext, useAuth } from "../Context/AuthContext";
import { Divider } from "react-native-elements/dist/divider/Divider";
import MedicationForm from "./MedicationForm";
import QRScannerScreen from "../screens/QRScannerScreen";
export default function Calendar({navigation}){
    const [newDate, setNewDate] = useState(''); 
    const [newMedication, setNewMedication] = useState('');
    const [newTime, setNewTime] = useState('');
    const [loading, setLoading] = useState(true)

    const [openAddMedication, setOpenAddMedication] = useState(false);
    const [openQRCodeScanner, setOpenQRCodeScanner] = useState(false)
    const [openTransititon, setOpenTransition] = useState(false)
    const [currentDate, setCurrentDate] = useState(new Date())
    const [haveRemindersToday, setHaveRemindersToday] = useState(false)

    const { currentUser, medications, setMedications } = useAuth()

    useEffect(
      () => {
        console.log(medications)
        setTimeout(() => setLoading(false), 500)
      }
    , [])

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
      return daysHavingReminders.includes(currentDate.toLocaleDateString())
    }

    const handleClickOpenAddMedication = () => {
      setOpenTransition(true)
    }

    const [input, setInput] = useState()

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
              onPress={handleClickOpenAddMedication}
            />
          </View>
        </View>
        
        {/* Manual input form */}
        <Modal
          animationType='slide'
          visible={openAddMedication}
        >
            <MedicationForm
            newDate = {newDate}
            newMedication={newMedication}
            setNewDate={setNewDate}
            setNewMedication={setNewMedication}
            setOpenAddMedication={setOpenAddMedication}
            newTime={newTime}
            setNewTime={setNewTime}
            />
        </Modal>
        
        {/* Scan QR code */}
        <Modal
          animationType='slide'
          visible={openQRCodeScanner}
        >
          <QRScannerScreen
            setOpenQRCodeScanner={setOpenQRCodeScanner}
          />
        </Modal>

        {/* Selection from */}
        <Modal
          animationType='fade'
          visible={openTransititon}
          transparent={true}
        >
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(52, 52, 52, 0.8)'}}>
            <View style={styles.transitionContainer}>
              <View style={{backgroundColor: '#53cbff', alignItems: 'center', justifyContent: 'center', padding: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10}}>
                <Text>New Medication</Text>
              </View>

              <View style={{flexDirection: 'row', padding: 10}}>
                <TouchableOpacity style={[styles.transitionButton, {borderRightWidth: 1}]} onPress={() => setOpenAddMedication(true)}>
                <MaterialCommunityIcons name='form-select' size={36}/>
                  <Text>Manual</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.transitionButton} onPress={() => setOpenQRCodeScanner(true)}>
                  <MaterialCommunityIcons name='qrcode-scan' size={36}/>
                  <Text>QR Code</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={{backgroundColor: '#53cbff', alignItems: 'center', justifyContent: 'center', padding: 10, borderBottomRightRadius: 10, borderBottomLeftRadius: 10}} onPress={() => setOpenTransition(false)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* <MedicationForm
            newDate = {newDate}
            newMedication={newMedication}
            setNewDate={setNewDate}
            setNewMedication={setNewMedication}
            setOpenAddMedication={setOpenAddMedication}
            newTime={newTime}
            setNewTime={setNewTime}
          /> */}
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
  },
  transitionMedication : {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
  },
  transitionButton : {
    // borderWidth: 1,
    // width: 200,
    // height: 40
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  transitionContainer : {
    backgroundColor: 'white',
    borderRadius: 10
    // justifyContent: 'center',
    // alignItems: 'center',
    // padding: 20
  }
})

// Có 1 vấn đề t đang gặp là: dữ liệu được đọc được xử lí nhanh hơn dữ liệu được ghi (và t chưa biết giải quyết nó như thế nào trong RN)
// nên khi mỗi lần mình insert hay remove 1 cái doc/collection mới ở các screen HomeScreen, RecordScreen, MedicationScreen,
// thì mình phải refresh lại cái screen đó (Ctrl + S trong cái file chứa screen đó) thì nó mới được cập nhật chính xác.
// Nên mọi người nhớ refresh lại nhe. Phase cuối còn 2 tuần thì t nghĩ mình sẽ giải quyết được cái này.
