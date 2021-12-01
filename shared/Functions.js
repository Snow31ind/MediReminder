import React from 'react'
import { View, Text } from 'react-native'

export function toTimeString(day) {
  const h = day.getHours()
  const m = day.getMinutes()

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

export const updateReminder = (medications, setMedications, medicationId, id, document, sort = false) => {
    let medicationDocument = medications.find(item => item.id == medicationId)
    let reminderIdx = medicationDocument.reminders.findIndex(item => item.id == id)
    let reminderDoc = medicationDocument.reminders[reminderIdx]
    medicationDocument.reminders[reminderIdx] = {
      ...reminderDoc,
      ...document
    }

    if (sort) {
      medicationDocument.reminders = medicationDocument.reminders.sort( (a, b) => a.timestamp - b.timestamp )
    }
    // console.log(medicationDocument);

    setMedications([...medications.filter(item => item.id != medicationId), medicationDocument])
}

export const removeReminder = (medications, setMedications, medicationId, id) => {
  let medicationDocument = medications.find(item => item.id == medicationId)
  medicationDocument.reminders = medicationDocument.reminders.filter(item => item.id != id)

  // let reminderIdx = medicationDocument.reminders.findIndex(item => item.id == id)
  // let reminderDoc = medicationDocument.reminders[reminderIdx]
  // medicationDocument.reminders[reminderIdx] = {
  //   ...reminderDoc,
  //   ...document
  // }

  // console.log(medicationDocument);

  setMedications([...medications.filter(item => item.id != medicationId), medicationDocument])
}

export const updateMedicationFE = (medications, setMedications, medicationId, document) => {
  // console.log(document);
  let pickedMedication = medications.find( item => item.id == medicationId )
  pickedMedication = {...pickedMedication, ...document}
  console.log('PickedMedication = ', pickedMedication.pillsInStock);
  // console.log(pickedMedication.pillsInStock);
  setMedications(prev => [...medications.filter(item => item.id != medicationId), pickedMedication])
  console.log('Medications = ', medications.find(item => item.id == medicationId).pillsInStock);
}

export const deleteMedicationFE = (medications, setMedications, medicationId) => {
  setMedications(
    prevMedications => [...prevMedications.filter( item => item.id != medicationId)]
  )
}
