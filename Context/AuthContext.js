import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "@firebase/auth";
import {useState, useReducer, useContext, useEffect, createContext } from "react";
import React from "react";
import { auth, db } from "../firebase/Config";
import { Alert } from "react-native";
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc, Timestamp, updateDoc } from "@firebase/firestore";
const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({children}) {

    const usersRef = collection(db, 'users')
    const [userDoc, setUserDoc] = useState()

    const [currentUser,setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function login(email, password) {
        await signInWithEmailAndPassword(auth, email, password)
        .then( userCredentials =>{
          const userInf = userCredentials.user;

        })
        .catch(error => {
          Alert.alert('Error', 'Invalid email/password.')
          console.log('Error in signing in', error.message);
        })
    }

    async function signup(email, password, confirmedPassword) {
        if (password != '' && password === confirmedPassword) {
            createUserWithEmailAndPassword(auth, email, password)
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

            })
            .catch (error => {
              console.log('Error in signing up a new user', error.message);
            })
          } else {
            Alert.alert('Error', 'Your password is different from your confirmed password')
          }
    }

    function signout() {
        signOut(auth)
    }

    const [info, setInfo] = useState({})

    useEffect(() => {
        try {
          const unsubcribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user)

            setLoading(false);
          })

          return unsubcribe
        } catch (e) {
          console.log('Error in auth state changed:', e.message);
        }
    }, [])


    const value = {
        // state,
        currentUser,
        userDoc,
        info,

        login,
        signup,
        signout
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}