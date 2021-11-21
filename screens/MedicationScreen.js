import React from 'react'
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
// import { TouchableOpacity } from 'react-native-gesture-handler'
import BarHeader from '../shared/BarHeader'
import pill from '../assets/medicationPill.png'
import { MaterialIcons } from '@expo/vector-icons'
import { ScrollView } from 'react-native-gesture-handler'

function MedicationPlan() {

  return (
    <TouchableOpacity style={styles.medicationContainer}>
        <Image source={pill} style={{width: 60, height: 60}}/>

        <View style={styles.medicationContent}>
          <View style={styles.medicationInf}>
            <Text style={styles.medicationName}>Medication A</Text>
            <Text>Next reminder: Tomorrow, 08:00 AM</Text>
            <Text>50 pills left</Text>
          </View>

          <MaterialIcons name='arrow-right' size={20}/>
        </View>
    </TouchableOpacity>
  )
}

export default function MedicationScreen({navigation}) {

  return (
    <View style={{flex: 1}}>
      <BarHeader navigation={navigation} header='Medications'/>
        <Text style={{marginLeft: 10, marginTop: 10}}>CURRENTLY TAKING</Text>

        <ScrollView style={styles.container}>
          <MedicationPlan />
          <MedicationPlan />
          <MedicationPlan />
          <MedicationPlan />
          <MedicationPlan />
          <MedicationPlan />
          <MedicationPlan />
          <MedicationPlan />
          <MedicationPlan />
          <MedicationPlan />
          <MedicationPlan />
          <MedicationPlan />
        </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
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
