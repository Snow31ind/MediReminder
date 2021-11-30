import { doc, getDoc, onSnapshot, query } from '@firebase/firestore'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { db } from '../firebase/Config'
import { useAuth } from './AuthContext'

const UserContext = createContext()

export function useUser() {
  return useContext(UserContext)
}

export function UserProvider({children}) {

  const { currentUser } = useAuth()

  const [info, setInfo] = useState()
  const [loading, setLoading] = useState(true)
  const value = {
    info
  }

  useEffect(
    () => {
      // const getInfo = async () => {
      //   // const user = await getDoc(doc(db, 'users', currentUser.uid))
      //   // const userInfo = user.data().info

      //   const unsub = onSnapshot(doc(db, 'users', currentUser.uid), doc => {
      //     setInfo(doc.data().info)
      //     setLoading(false)
      //   })
      // }

      // getInfo()
    }
  , [])

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

