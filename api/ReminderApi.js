import { collection, deleteDoc, doc, getDoc, getDocs, increment, Timestamp, updateDoc } from '@firebase/firestore'
import React from 'react'
import { db } from '../firebase/Config'

export const drecrementPillsInStock = async (userId, medicationId, amount) => {
  const medicationDocRef = doc(db, 'users', userId, 'medications', medicationId)
  const medicationDoc = await getDoc(medicationDocRef)

  try {
    await updateDoc(medicationDocRef,{
      pillsInStock: medicationDoc.data().pillsInStock - amount
    })
  } catch (error) {
    console.log('Error in decremeting field pillsInStock in a medication:', error.message);
  }
}

export const incrementPillsInStock = async (userId, medicationId, amount) => {
  const medicationDocRef = doc(db, 'users', userId, 'medications', medicationId)
  const medicationDoc = await getDoc(medicationDocRef)

  try {
    await updateDoc(medicationDocRef,{
      pillsInStock: medicationDoc.data().pillsInStock + amount
    })
  } catch (error) {
    console.log('Error in decremeting field pillsInStock in a medication:', error.message);
  }
}

export const updatePillsInStock = async (userId, medicationId, quantity) => {
  const medicationDocRef = doc(db, 'users', userId, 'medications', medicationId)
  // const medicationDoc = await getDoc(medicationDocRef)

  try {
    await updateDoc(medicationDocRef,{
      pillsInStock: quantity
    })
  } catch (error) {
    console.log('Error in decremeting field pillsInStock in a medication:', error.message);
  }
}

export const confirmReminder = async (userId, medicationId, reminderId) => {

  // Update field isConfirmed
  const reminderDocRef = doc(db, 'users', userId, 'medications', medicationId, 'reminders', reminderId)
  try {
    await updateDoc(reminderDocRef, {
      isConfirmed: true
    })
  } catch (error) {
    console.log('Error in updating field isConfirmed in a reminder:', error.message);
  }

  const reminderDoc = await getDoc(reminderDocRef)
  drecrementPillsInStock(userId, medicationId, reminderDoc.data().quantity)
}

export const unconfirmReminder = async (userId, medicationId, reminderId) => {

  // Update field isConfirmed
  const reminderDocRef = doc(db, 'users', userId, 'medications', medicationId, 'reminders', reminderId)
  
  try {
    await updateDoc(reminderDocRef, {
      isConfirmed: false
    })
  } catch (error) {
    console.log('Error in updating field isConfirmed in a reminder:', error.message);
  }

  const reminderDoc = await getDoc(reminderDocRef)
  incrementPillsInStock(userId, medicationId, reminderDoc.data().quantity)
}

export const deleteReminder =  async (userId, medicationId, reminderId) => {
  const reminderDocRef = doc(db, 'users', userId, 'medications', medicationId, 'reminders', reminderId)

  try {
    await deleteDoc(reminderDocRef)
  } catch (error) {
    console.log('Error in deleteing a reminder:', error.message);
  }

  const remindersRef = collection(db, 'users', userId, 'medications', medicationId, 'reminders')
  const remindersDocRef = await getDocs(remindersRef)

  if (remindersDocRef.empty) {
    console.log('No reminder exist in this medication plan');
    deleteMedicationPlan(userId, medicationId)
  } else {
    console.log(remindersDocRef.size);
    console.log('There are some reminders in this medication plan');
  }

}

export const rescheduleReminder = async (userId, medicationId, reminderId, day) => {
  const reminderDocRef = doc(db, 'users', userId, 'medications', medicationId, 'reminders', reminderId)

  try {
    await updateDoc(reminderDocRef, {
      timestamp: Timestamp.fromDate(day)
    })
  } catch (error) {
    console.log('Error in updating field timestamp in a reminder', error.message);
  }
}

export const deleteMedicationPlan = async (userId, medicationId) => {
  const medicationDocRef = doc(db, 'users', userId, 'medications', medicationId)

  try {
    await deleteDoc(medicationDocRef)
  } catch (error) {
    console.log('Error in deleting a medication plan:', error.message);
  }
}

export const updateReminderQuantity = async (userId, medicationId, reminderId, quantity) => {
  const reminderDocRef = doc(db, 'users', userId, 'medications', medicationId, 'reminders', reminderId)

  try {
    await updateDoc(reminderDocRef, {
      quantity: quantity
    })
  } catch (error) {
    console.log('Error in updating field isConfirmed in a reminder:', error.message);
  }

}

export const updateMedication = async (userId, medicationId, document) => {
  const medicationDocRef = doc(db, 'users', userId, 'medications', medicationId)

  try {
    await updateDoc(medicationDocRef, document
    )
  } catch (error) {
    console.log('Error in updating medication information:', error.message);
  }
}

export const deleteMedication = async (userId, medicationId) => {
  const remindersDocsRef = collection(db, 'users', userId, 'medications', medicationId, 'reminders')
  const remindersDocs = await getDocs(remindersDocsRef)

  remindersDocs.docs.forEach(
    reminder => deleteReminder(userId, medicationId, reminder.id)
  )

  const medicationDocRef = doc(db, 'users', userId, 'medications', medicationId)

  try {
    await deleteDoc(medicationDocRef)
  } catch (error) {
    console.log('Error in deleting a medication plan:', error.message);
  }
}

export const updateReminder = async (userId, medicationId, reminderId, document) => { 
  const reminderDocRef = doc(db, 'users', userId, 'medications', medicationId, 'reminders', reminderId)

  try {
    await updateDoc(reminderDocRef, document)
  } catch (error) {
    console.log('Error in updating  a reminder:', error.message);
  }
}


