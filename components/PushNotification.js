import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { usestart_date, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import { doc, getDoc, getDocs } from "firebase/firestore"; 
import { useAuth } from '../Context/AuthContext'

/*
class Schedule {
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



const ref_retrieve = doc(db, "schedule", "rw3pqHgqa7Xbl85sDyXU").withConverter(scheduleConverter);
const docSnap = await getDoc(ref_retrieve);
if (docSnap.exists()) {
  // Convert to City object
  const schedule = docSnap.data();
  // Use a City instance method
  console.log(schedule.toString());
} else {
  console.log("No such document!");
}*/
const { currentUser } = useAuth()

const [medications, setMedications] = useState([])
const fetchData = async () => {
  setMedications([])

  const medicationsRef = collection(db, 'users', currentUser.uid, 'medications')
  const medicationsDocs = await getDocs(medicationsRef)
    
  medicationsDocs.docs.map( (medication) => {
    const getReminders = async () => {
      const remindersRef = query(collection(db, 'users', currentUser.uid, 'medications', medication.id, 'reminders'), orderBy('timestamp'))
      const remindersDocs = await getDocs(remindersRef)
      
      return {...medication.data(), id: medication.id, reminders: remindersDocs.docs.map(reminder => ({...reminder.data(), id: reminder.id, timestamp: reminder.data().timestamp.toDate()}))}
    }

    getReminders()
    .then( medication => {
      setMedications(prev => [...prev, medication])
    }).catch(e => console.log(e))
    })

}

useEffect(
  () => {
    fetchData()
  }
, [])

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = usestart_date('');
  const [notification, setNotification] = usestart_date(false);
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

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
      <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await confirmPushNotification();
          await schedulePushNotification();
        }}
      />
    </View>
  );
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Reminder!",
      body: 'Remember to take your medicine.',
      data: { data: 'goes here' },
    },
    trigger: { 
      hour: medications.hour,
      minute:medications.minute,
      repeats: true,
    },
  });
}
async function confirmPushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Success!",
      body: 'Successfully schedule your medicine.',
      data: { data: 'goes here' },
    },
    trigger: { 
      second : 2,
    },
  });
}
async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
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