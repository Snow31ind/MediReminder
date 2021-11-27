import React, { useEffect, useRef, useState } from 'react';
import { AuthProvider } from './Context/AuthContext';
import Program from './components/Program';
import { View, Text, Button } from 'react-native';
import { db } from './firebase/Config';
import { addDoc, collection, doc, getDocs, onSnapshot, orderBy, query, updateDoc, where } from '@firebase/firestore';
import { TextInput } from 'react-native-gesture-handler';
import { UserProvider } from './Context/UserContext';

export default function App() {
  // const [customers, setCustomers] = useState([])
  // const [a, setA] = useState([])

  // const updateAge = async (id, newAge) => {
  //     await updateDoc(doc(db, 'customers', id), {
  //       age: newAge.toString()
  //     })
  // }

  // const customersRef = collection(db, 'customers')

  // useEffect(
  //   () => {
  //       const q = query(customersRef, orderBy('age'))
  //       const unsub = onSnapshot(q,  (querySnapshot) => {
  //         const list = []
  //         querySnapshot.forEach( doc => {
  //           list.push({...doc.data(), id: doc.id})
  //         })

  //         setA(list)
  //       })
  //   }
  // , [])

  // const [name, setName] = useState()
  // const [age, setAge] = useState()

  // const handleClickSubmit = async () => {
  //     await addDoc(collection(db, 'customers'), {
  //       name: name,
  //       age: age
  //     })
  // }

  const nameRef = useRef()

  return (
    <AuthProvider>
      <UserProvider>
        <Program />
      </UserProvider>
    </AuthProvider>

    // <View style={{flex: 1, justifyContent: 'center', alignItems:'center'}}>
    //   <TextInput ref={nameRef} placeholder='name' keyboardType='ascii-capable'/>
    //   <Button title='Show' onPress={() => console.log(nameRef)} />
    // </View>

    // <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
    //   {a.map( (item, idx) =>
    //    <View key={idx}>
    //      <Text> {item.name} {item.age} </Text>
    //      <Button title='Increment age by 1' onPress={() => updateAge(item.id, parseInt(item.age) + 1)} />
    //      <Button title='Decrement age by 1' onPress={() => updateAge(item.id, parseInt(item.age) - 1)} />
    //    </View>
    //   )}

    //   <TextInput placeholder='Name' onChangeText={text => setName(text)} />
    //   <TextInput placeholder='Age' onChangeText={text => setAge(text)} />
    //   <Button title='submit' onPress={handleClickSubmit} />
    // </View>
  );
}