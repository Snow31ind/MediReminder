import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import { doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore"; 
import { useAuth } from '../Context/AuthContext'


/*class Schedule {
  constructor (pill, start_date, end_date, hour, minute, frequency, times, quantity ) {
      this.pill = pill;
      this.start_date = start_date;
      this.end_date = end_date;
      this.hour = hour;
      this.minute = minute;
      this.frequency = frequency;
      this.times = times;
      this.quantity = quantity;
  }
  toString() {
      return this.pill + ': ' + this.start_date + ' - ' + this.end_date;
  }
}

// Firestore data converter
const scheduleConverter = {
  toFirestore: (schedule) => {
      return {
          pill: schedule.pill,
          start_date: schedule.start_date,
          end_date: schedule.end_date,
          hour: schedule.hour,
          minute: schedule.minute,
          frequency: schedule.frequency,
          times: schedule.times,
          quantity: schedule.quantity
          };
  },
  fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options);
      return new Schedule(data.pill, data.start_date, data.end_date, data.hour, data.minute, data.frequency, data.times, data.quantity);
  }
};

const { currentUser } = useAuth()
const ref_retrieve = doc(db, "schedule", currentUser.uid.toString()).withConverter(scheduleConverter);
const docSnap = await getDoc(ref_retrieve);
if (docSnap.exists()) {
  const schedule = docSnap.data();
  console.log(schedule.toString());
} else {
  console.log("No such document!");
}*/


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function Scheduling() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
}


export async function schedulePushNotification(h, m, quantity) {
  await Notifications.scheduleNotificationAsync({
    content: {
      sound: 'default',
      title: "Reminder!",
      body: 'Remember to take your medicine.',
      data: { data: 'goes here' },
    },
    trigger: { 
      hour: h,
      minute: m,
      repeats: quantity,
    },
  })
}
export async function confirmPushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      sound: 'default',
      title: "Success!",
      body: 'Successfully schedule your medicine.',
      data: { data: 'goes here' },
    },
    trigger: { 
      seconds : 2,
    },
  });
}

export async function refillNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      sound: 'default',
      title: "Refill!",
      body: 'Please refill your stock',
      data: { data: 'goes here' },
    },
    trigger: { 
      seconds : 2,
    },
  });
}

export async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Please turn on notification!')
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      pill: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}