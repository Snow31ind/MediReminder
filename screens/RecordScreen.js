import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ScrollView, Image, ImageBackground } from "react-native";
import { BarChart, PieChart, ProgressChart } from "react-native-chart-kit";
import BarHeader from "../shared/BarHeader";
import pill from '../assets/medicationPill.png'
import { ProgressCircle } from "react-native-svg-charts";
import { useAuth } from "../Context/AuthContext";
import { collection, getDocs, query, orderBy } from "@firebase/firestore";
import { db } from "../firebase/Config";
const screenWidth = Dimensions.get('window').width;

export default function RecordScreen({navigation}){
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

    const [openOverall, setOpenOverall] = useState(true);
    const [openDaily, setOpenDaily] = useState(false);

    const DailyItem = () => {
      return (
        <View style={styles.dailyItemContainer}>
          <Text>12/11/2021</Text>
          
          <View style={styles.dailyItem}>
            <Text>Missed(0)</Text>
            <Text>Taken(3)</Text>
            <View style={{flexDirection: 'row', justifyContent:'space-evenly'}}>
              <Image source={pill} style={{height: 35, width: 35}} />
              <Text>Paracetamol(X1)</Text>
              <Text>7:00 AM</Text>
            </View>
          </View>
        </View>
      )
    }

    const CustomProgressCircle = ({medication, idx, ...rest}) => {
      const progress = (medication.reminders.filter(reminder => {return reminder.isConfirmed == true}).length / medication.reminders.length).toFixed(4)
      const confirmedReminders = medication.reminders.filter(reminder => reminder.isConfirmed == true).length
      const missedReminders = medication.reminders.filter(reminder => reminder.isMissed == true).length
      const remainingReminders = medication.reminders.length - (confirmedReminders + missedReminders)

      return (
        <View style={{
          flexDirection: 'row',
          flex: 1,
          borderTopWidth: idx > 0 ? 1 : 0,
          // borderBottomWidth: 1,
          padding: 10
        }}>
          <View style={{alignItems: 'center'}}>
            <Text style={{fontWeight: 'bold'}}>{medication.name}</Text>
            <ProgressCircle
              style={{ height: 150, width: 150, marginTop: 10}}
              // progress={ 0.75 }
              progress={Number.parseFloat(progress)}
              progressColor='#27E98C'
              backgroundColor='gray'
              startAngle={0}
              endAngle={360}
              strokeWidth={8}
            />
          </View>


          <View style={{backgroundColor: '', marginLeft: 70, alignItems: 'center'}}>
            <Text style={{fontWeight: 'bold'}}>Progress</Text>  
            
            <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>{progress * 100}%</Text>
              {/* <Text>{confirmedReminders}</Text> */}
              {/* <Text>{missedReminders}</Text> */}
              {/* <Text>{remainingReminders}</Text> */}
            </View>
          </View>
        </View>
      )
    }

    return (
      <View style={{flex: 1}}>
        <BarHeader navigation={navigation} header={'Records'}/>
        {medications.length > 0 ? 
          <>
            <ScrollView>
              <View style={styles.container}>
                {/* <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', padding: 10}}>
                    <TouchableOpacity
                        onPress={() => {
                            setOpenOverall(true);
                            setOpenDaily(false);
                        }}
                        style={{borderBottomColor: openOverall ? 'tomato' : 'gray', borderBottomWidth: 3}}
                    >
                        <Text style={styles.buttonText}>Overall</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            setOpenOverall(false);
                            setOpenDaily(true);
                        }}
                        style={{borderBottomColor: openDaily ? 'tomato' : 'gray', borderBottomWidth: 3}}
                    >
                        <Text style={styles.buttonText}>Daily</Text>
                    </TouchableOpacity>
                </View>            

                {openOverall && medications.map( medication => <CustomProgressCircle key={medication.id} medication={medication}/>)}
                {openDaily} */}

                {medications.map( (medication, idx) => <CustomProgressCircle idx={idx} key={medication.id} medication={medication}/>)}
            </View>
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
};

const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 20
    },
    button: {
        // backgroundColor: 'gray',
        borderBottomColor: 'tomato',
        borderBottomWidth: 3
    },  
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    chartContainer: {
      // borderBottomWidth: 1,
      borderTopWidth: 1,
    },
    dailyItemContainer: {
      padding: 10
    },
    dailyItem: {
      backgroundColor: '#53cbff',
      padding: 10,
      borderRadius: 10,
    }

})