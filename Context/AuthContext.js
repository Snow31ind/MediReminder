import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "@firebase/auth";
import {useState, useReducer, useContext, useEffect, createContext } from "react";
import React from "react";
import { auth, db } from "../firebase/Config";
import { Alert } from "react-native";
import { doc, setDoc } from "@firebase/firestore";
const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({children}) {
    
    const [currentUser,setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const initialState = {
        isLoading: true,
        isSignOut: false,
        userToken: null,
    }
    
    const reduce = (prevState, action) => {
        switch (action.type) {
          case 'RESTORE_TOKEN' :
            return {
              ...prevState,
              userToken: action.token,
              isLoading: false,
            };
    
            case 'SIGN_IN' :
              return {
                ...prevState,
                userToken: action.token,
                isSignOut: false,
              };
    
            case 'SIGN_OUT' :
            return {
              ...prevState,
              userToken: null,
              isSignOut: true,
            };
        }
    }
    
    const [state, dispatch] = useReducer(reduce, initialState);

    async function login(email, password) {
        await signInWithEmailAndPassword(auth, email, password)
        .then( userCredentials =>{
          const userInf = userCredentials.user;

          console.log('User id at App is:', userInf.uid);
          dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});

        })
        .catch(error => {
          Alert.alert('Error', 'Invalid email/password.')
          console.log('Error in signing in', error.message);
        })
    }

    async function signup(email, password, confirmedPassword, info) {
        if (password != '' && password === confirmedPassword) {
            // await createUserWithEmailAndPassword(auth, email, password)

            createUserWithEmailAndPassword(auth, email, password)
            .then( userCredentials => {
              console.log(userCredentials.user);
              
              const assignInfo = async (data) => {
                  const docRef = doc(db, 'users', userCredentials.user.uid)
                  try {
                    setDoc(docRef, { info: data})
                  } catch (e) {
                    console.log('Error in inserting user\'s info', e.message);
                  }
              }

              assignInfo(info);

              console.log('A new user has signed up');
              
              dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'})
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
        dispatch({type: 'SIGN_OUT'})
    }

    useEffect(() => {
        try {
          const unsubcribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user)
            setLoading(false);
          })

          return unsubcribe
          // return () => setCurrentUser(null)
        } catch (e) {
          console.log('Error in auth state changed:', e.message);
        }
    }, [])

//   useEffect(
//     () => {
//       const bootstrapAsync = async () => {
//         let userToken;

//         setTimeout(
//           () => dispatch({type: 'RESTORE_TOKEN', token: userToken})
//         , 3000)
//         // dispatch({type: 'RESTORE_TOKEN', token: userToken});
//       }
//       console.log('App renders');

//       return bootstrapAsync();
//     }
//   , [])

//   const [count, setCount] = useState(0);
//   const [userId, setUserId] = useState(null);
//   const usersRef = collection(db, 'users');

//   const authContext = useMemo(
//     () => ({
//         signIn: async (email, password) => {

//           await signInWithEmailAndPassword(auth, email, password)
//           .then( userCredentials =>{
//             const userInf = userCredentials.user;
//             // console.log(userInf);

//             setUserId(() => userInf.uid);

//             if(userId == '') console.log('True');

//             console.log('User id at App is:', userInf.uid);

//             dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});

//             setCount(prevCount => prevCount + 1)
//           })
//           .catch(error => {
//             Alert.alert('Error', 'Invalid email/password.')
//             console.log('Error in signing in', error.message);
//           })

//         //   dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
          
//         },

//         signOut : () => dispatch({type: 'SIGN_OUT'}),

//         signUp: async (email, password, confirmedPassword) => {

//           if (password != '' && password === confirmedPassword) {
//             createUserWithEmailAndPassword(auth, email, password)
//             .then( userCredentials => {
//               console.log(userCredentials.user);
              
//               setDoc(doc(db, 'users', userCredentials.user.uid), {
//                 email: userCredentials.user.email
//               });

//               console.log('A new user has signed up');
              
//               dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'})
//             })
//             .catch (error => {
//               console.log('Error in signing up a new user', error.message);
//             })
//           } else {
//             Alert.alert('Error', 'Your password is different from your confirmed password')
//           }
//         },
//         userId: userId,

//     })
//   , [count]);

    const value = {
        state,
        currentUser,

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