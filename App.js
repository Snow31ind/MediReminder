import React, { useEffect, useState } from 'react';
import { Button, View, Text, Settings } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Homepage from './screens/Homepage';
import Notifications from './screens/Notifications';
import Records from './screens/Records';
import Login from './screens/Login';
import LogOut from './screens/LogOut';
import { set } from 'react-native-reanimated';
import Setting from './screens/Setting';
import firestore from './firebase/Config';
import { collection, getDocs, doc, addDoc, getDoc, setDoc, updateDoc, serverTimestamp, arrayUnion, arrayRemove } from '@firebase/firestore';
import SignUp from './screens/SignUp';

const Drawer = createDrawerNavigator();


export default function App() {

  const [isSignedIn, setIsSignedIn] = useState(false);

  const logOut = () => {
    setIsSignedIn(false);
  }

  const logIn = () => {
    setIsSignedIn(true);
  }

  // const usersColRef = collection(firestore, 'users');

  // const [users, setUsers] = useState([
  //   {
  //     id: 'handmade',
  //     name: 'B',
  //     age: 20,
  //   }
  // ]);

  // const addSomeData = async () => {
  //   try {
  //     const docRef = await addDoc(usersColRef, {
  //       name: 'C',
  //       sex: 'male',
  //       age: '29'
  //     });

  //     console.log('Document written with ID:', docRef.id);
  //   } catch (e) {
  //     console.log("Error adding document: ", e);
  //   }
  // }

  // const getUsers = async () => {
  //   try {
  //     const querySnapshot = await getDocs(usersColRef);
  //     const listUsers = querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
  //     setUsers(listUsers);

  //     // querySnapshot.docs.forEach(
  //     //   doc => console.log({...doc.data(), id: doc.id})
  //     // )

  //   } catch (e) {
  //     console.log("Error in reading data: ", e);
  //   }
  // }

  // const [refreshCount, setRefreshCount] = useState(0);

  // const increment = () => {
  //   setRefreshCount(refreshCount + 1);

  // }

  // useEffect(
  //   () => {
  //     getUsers();
  //   }
  // , [refreshCount])

  const usersColRef = collection(firestore, 'users');
  
  const getAccount = async () => {
    const accountRef = doc(firestore, 'users', 'account');
    const accountSnap = await getDocs(accountRef);
    accountSnap.docs.map(
      account => {
        console.log(account.id);
      }
    )
  }

  const addData = async () => {
    // await setDoc(doc(firestore, "cities", "LA"), {
    //   name: "Los Angeles",
    //   state: "CA",
    //   country: "USA"
    // });

    // const docRef = await addDoc(collection(firestore, 'cities'), {
    //   name: 'Tokyo',
    //   country: 'Japan'
    // })

    // console.log(docRef.id);

//     const frankDocRef = doc(firestore, "users", "frank");
//     await setDoc(frankDocRef, {
//     name: "Frank",
//     favorites: { food: "Pizza", color: "Blue", subject: "recess" },
//     age: 12
// });
  const washingtonRef = doc(firestore, "cities", "DC");
//   await updateDoc(washingtonRef, {
//     regions: arrayUnion("greater_virginia")
// });

await updateDoc(washingtonRef, {
  regions: arrayRemove("Vietnam")
});


  }

  const updateData = async() => {
    // const docRef = doc(firestore, 'cities', 'LA');

    // await updateDoc(docRef, {
    //   isBeautiful: true,
    //   timestamp: serverTimestamp()
    // })
    const frankDocRef = doc(firestore, "users", "frank");
    await updateDoc(frankDocRef, {
      "age": 13,
      "favorites.color": "Red"
    });
  }
  
  const getData = async () => {
    const usersColRef = collection(firestore, 'users');
    const querySnapshot = getDocs(usersColRef);
    (await querySnapshot).docs.map(
      doc => console.log(doc.data().reminders)
    )
  }

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

  return (
    <RunApp />
  );
}