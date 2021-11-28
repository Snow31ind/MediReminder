import { collection, doc, getDoc, increment, updateDoc } from '@firebase/firestore'
import React from 'react'
import { db } from '../firebase/Config'

export const drecrementPillsInStock = async (userId, medicationId) => {
  const medicationDocRef = doc(db, 'users', userId, 'medications', medicationId)
  const medicationDoc = await getDoc(medicationDocRef)

  try {
    await updateDoc(medicationDocRef,{
      pillsInStock: medicationDoc.data().pillsInStock - 1
    })
  } catch (error) {
    console.log('Error in decremeting field pillsInStock in a medication:', error.message);
  }
}

export const incrementPillsInStock = async (userId, medicationId) => {
  const medicationDocRef = doc(db, 'users', userId, 'medications', medicationId)
  const medicationDoc = await getDoc(medicationDocRef)

  try {
    await updateDoc(medicationDocRef,{
      pillsInStock: medicationDoc.data().pillsInStock + 1
    })
  } catch (error) {
    console.log('Error in decremeting field pillsInStock in a medication:', error.message);
  }
}

export const updatePillsInStock = async (userId, medicationId, quantity) => {
  const medicationDocRef = doc(db, 'users', userId, 'medications', medicationId)
  const medicationDoc = await getDoc(medicationDocRef)

  try {
    await updateDoc(medicationDocRef,{
      pillsInStock: medicationDoc.data().pillsInStock + quantity
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

  // drecrementPillsInStock(userId, medicationId)
  updatePillsInStock(userId, medicationId, -1)
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

  // incrementPillsInStock(userId, medicationId)
  updatePillsInStock(userId, medicationId, 1)
}


