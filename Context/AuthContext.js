import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "@firebase/auth";
import {useState, useReducer, useContext, useEffect, createContext } from "react";
import React from "react";
import { auth, db } from "../firebase/Config";
import { Alert } from "react-native";
import {query, orderBy, addDoc, collection, doc, getDoc, getDocs, serverTimestamp, setDoc, Timestamp, updateDoc } from "@firebase/firestore";
const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({children}) {

    const usersRef = collection(db, 'users')
    const [userDoc, setUserDoc] = useState()

    const [currentUser,setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState()

    const [medications, setMedications] = useState([])

    // useEffect(
    //   () => {
    //     fetchData()
    //     console.log('Medications at AuthContext:', medications);
    //   }
    // , [currentUser])

    // const fetchData = async (user) => {
    //   const medicationsRef = collection(db, 'users', user.uid, 'medications')
    //   const medicationsDocs = await getDocs(medicationsRef)

    //   setMedications(medicationsDocs.docs.map( (medication) => {
    //     const getReminders = async () => {
    //       const remindersRef = collection(db, 'users', user.uid, 'medications', medication.id, 'reminders')
    //       const remindersDocs = await getDocs(remindersRef)
          
    //       return remindersDocs.docs.map(reminder => ({...reminder.data(), id: reminder.id}))
    //     }

    //     // return {...medication.data(), id: medication.id, reminders: reminders}
    //     return {...medication.data(), id: medication.id}
    //     })
    //   )
  
    // }

    const fetchData = async (user) => {
      setMedications(prev => [])
  
      const medicationsRef = collection(db, 'users', user.uid, 'medications')
      const medicationsDocs = await getDocs(medicationsRef)
        
      medicationsDocs.docs.map( (medication) => {
        const getReminders = async () => {
          const remindersRef = query(collection(db, 'users', user.uid, 'medications', medication.id, 'reminders'), orderBy('timestamp'))
          const remindersDocs = await getDocs(remindersRef)
          
          return {...medication.data(), id: medication.id, reminders: remindersDocs.docs.map(reminder => ({...reminder.data(), id: reminder.id, timestamp: reminder.data().timestamp.toDate()}))}
        }
        
        getReminders()
        .then( medication => {
          setMedications(prev => [...prev, medication])
        }).catch(e => console.log(e))
        })
  
    }

    async function login(email, password) {
        // setError()
        console.log('Login runs');
        await signInWithEmailAndPassword(auth, email, password)
        .then( userCredentials =>{
          const userInf = userCredentials.user;
          console.log('Login then runs');
            // setCurrentUser(userInf)
            fetchData(userInf)
            // console.log('Signup runs');
        })
        .catch(error => {
          setError('Invalid email/password')
          // Alert.alert('Error', 'Invalid email/password.')
          console.log('Error in signing in', error.message);
        })
    }

    async function signup(email, password, confirmedPassword) {
            await createUserWithEmailAndPassword(auth, email, password)
            .then( userCredentials => {
              const user = userCredentials.user

              const createAccount = async () => {
                await setDoc(doc(db, 'users', user.uid.toString()), {
                  account : {
                    email: email,
                    createdAt: serverTimestamp()
                  }
                })
              }
              
              const initializeProfile = async () => {
                const userDocRef = doc(db, 'users', user.uid)
                // const userDoc = await getDoc(userDoc)
                // const profile = user.data().info

                    const defaultInfo = {
                        avatar: '',
                        name: user.uid.toString(),
                        gender: 'none',
                        birthday: Timestamp.fromDate(new Date()),
                        phoneNumber: '',
                        bio: ''
                    }

                    try {
                        await updateDoc(userDocRef, {info: defaultInfo})
                    } catch (error) {
                        console.log('Error in initializing profile:', error.message);
                    }

                    // setInfo(new Info())

                    console.log('Initializing profile successfully');
            }

              createAccount()
              initializeProfile()

            console.log('Signup runs');
            })
            .catch (error => {
              if (email.length == 0 || !email.includes('@')) setError('Invalid email')
              else if (password.length == 0 || confirmedPassword == 0) setError('Password must be at least 6 characters') 
              else if (password != confirmedPassword) setError('Different password and confirm password')
              else setError('Already used email')

              console.log('Error in signing up a new user', error.message);
            })
    }

    function signout() {
        signOut(auth)
    }

    const [info, setInfo] = useState({})

    useEffect(() => {
        try {
          const unsubcribe = onAuthStateChanged(auth, user => {
            console.log('onAuthStateChanged runs');
            setCurrentUser(user)
            setLoading(false);
          })

          // return unsubcriber
        } catch (e) {
          console.log('Error in auth state changed:', e.message);
        }
    }, [])

    useEffect(
      () => {
        return () => {
          setInfo()
          setCurrentUser(),
          setMedications(),
          setError()
        }
      }
    , [])


    const value = {
        // state,
        currentUser,
        userDoc,
        info,
        error,
        medications,

        login,
        signup,
        signout,
        setError,
        setMedications
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}