import React, { useEffect, useMemo, useReducer, useState } from 'react';
import { Button, View, Text, Settings, TextInput, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { log, set } from 'react-native-reanimated';
import {auth, db} from './firebase/Config';
import { collection, getDocs, doc, addDoc, getDoc, setDoc, updateDoc, serverTimestamp, arrayUnion, arrayRemove } from '@firebase/firestore';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from './Context/AuthContext';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@firebase/auth';
import AccountScreen from './screens/AccountScreen';
import HomeScreen from './screens/HomeScreen';
import NotificationScreen from './screens/NotificationScreen';
import RecordScreen from './screens/RecordScreen';
import SettingScreen from './screens/SettingScreen';
import LogOutScreen from './screens/LogOutScreen';
import LoginScreen from './screens/LogInScreen';
import SignUpScreen from './screens/SignUpScreen';



const Drawer = createDrawerNavigator();


function SplashScreen() {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {

  const [isSignedIn, setIsSignedIn] = useState(false);
  const usersColRef = collection(db, 'users');


  function RunApp(){
    return (
      <NavigationContainer>
        <Drawer.Navigator initialRouteName='Login'>
          { isSignedIn == false ? (
            <>
                <Drawer.Screen
                name='Login'
                children={() => <Login setIsSignedIn={setIsSignedIn}/>}
                />
  
                {/* {() => <Login setIsSignedIn={setIsSignedIn}/>}
                </Drawer.Screen> */}
  
                {/* <Drawer.Screen 
                name='Sign up'
                component={SignUp}
                /> */}
                
              </>
            ) : (
              <>
                <Drawer.Screen
                name="Home"
                component={Homepage}
                options={{
                  title: 'Home'
                }}
                />
              
                <Drawer.Screen
                name="Notifications"
                component={Notifications}
                />
        
                <Drawer.Screen
                  name='Records'
                  component={Records}
                />
  
                <Drawer.Screen
                  name='Settings'
                  component={Setting}
                />
  
                <Drawer.Screen
                  name='Log out'
                >
                  {() => <LogOut setIsSignedIn={setIsSignedIn}/>}
                </Drawer.Screen>
              </>
            )}
        </Drawer.Navigator>
      </NavigationContainer>
    )
  }

  const initialState = {
    isLoading: true,
    isSignOut: false,
    userToken: null,
    userId: null
  }

  const reduce = (prevState, action) => {
    switch (action.type) {
      case 'RESTORE_TOKEN' :
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
          userId: null
        };

        case 'SIGN_IN' :
          return {
            ...prevState,
            userToken: action.token,
            isSignOut: false,
            userId: action.userId
          };

        case 'SIGN_OUT' :
        return {
          ...prevState,
          userToken: null,
          isSignOut: true,
          userId: null
        };
    }
  }

  const [state, dispatch] = useReducer(reduce, initialState);

  useEffect(
    () => {
      const bootstrapAsync = async () => {
        let userToken;

        setTimeout(
          () => dispatch({type: 'RESTORE_TOKEN', token: userToken})
        , 2000)
        // dispatch({type: 'RESTORE_TOKEN', token: userToken});
      }
      console.log('App renders');

      bootstrapAsync();
    }
  , [])

  useEffect(
    () => {

    }
  , [userId])

  const [count, setCount] = useState(0);
  const [userId, setUserId] = useState(null);
  const usersRef = collection(db, 'users');

  const authContext = useMemo(
    () => ({
        signIn: async (email, password) => {
          // console.log(data);
          // setUserId(() => data.username);
          // console.log('Set user id');
          // console.log('Current user id is: ', userId);
          // dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'})

          signInWithEmailAndPassword(auth, email, password)
          .then( userCredentials =>{
            const userInf = userCredentials.user;
            // console.log(userInf);

            setUserId(() => userInf.uid);

            if(userId == '') console.log('True');

            console.log('User id at App is:', userInf.uid);

            dispatch({type: 'SIGN_IN', token: 'dummy-auth-token', userId: userInf.uid});

            setCount(prevCount => prevCount + 1)
          })
          .catch(error => {
            Alert.alert('Error', 'Invalid email/password.')
            console.log('Error in signing in', error.message);
          })
        },

        signOut : () => dispatch({type: 'SIGN_OUT'}),

        signUp: async (email, password, confirmedPassword) => {

          if (password == confirmedPassword) {
            createUserWithEmailAndPassword(auth, email, password)
            .then( userCredentials => {
              console.log(userCredentials.user);
              
              setDoc(doc(db, 'users', userCredentials.user.uid), {
                email: userCredentials.user.email
              });

              console.log('A new user has signed up');
              
              dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'})
            })
            .catch (error => {
              console.log('Error in signing up a new user', error.message);
            })
          } else {
            Alert.alert('Your password is different from your confirmed password')
          }
        },
        userId: userId,

    })
  , [count]);

  function AppRun(){
    return (
        <AuthContext.Provider value={authContext}>
          <NavigationContainer>
            {
              state.isLoading ? (
                <Drawer.Screen name='Splash screen' component={SplashScreen}/>
              ) : state.userToken ? (
                <Drawer.Navigator>
                <Drawer.Screen name='Home' component={HomeScreen} />
                {/* <Drawer.Screen name='Account' component={AccountScreen} /> */}
                <Drawer.Screen name='Notifications' component={NotificationScreen}/>
                <Drawer.Screen name='Records' component={RecordScreen} />
                <Drawer.Screen name='Settings' component={SettingScreen} />
                <Drawer.Screen name='Logout' component={LogOutScreen} />
                </Drawer.Navigator>
              ) : (
                <Drawer.Navigator>
                  <Drawer.Screen name='Login' component={LoginScreen} />
                  <Drawer.Screen name='Sign up' component={SignUpScreen} />
                </Drawer.Navigator>
              )
            }
          </NavigationContainer>
        </AuthContext.Provider>
    )
  }

  return (
    <AppRun />
    // <RunApp />
  );
}