import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBDoprANJh6CozzNKDJ9mtVo8VqUNPIGcg",
  authDomain: "medireminder-a948a.firebaseapp.com",
  // databaseURL: "https://medireminder-a948a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "medireminder-a948a",
  storageBucket: "medireminder-a948a.appspot.com",
  messagingSenderId: "275217622123",
  appId: "1:275217622123:web:d6694bdbbc3011960f7d2e",
  measurementId: "G-DJ2P0X4BNV"
};

// const firebaseConfig = {
//   apiKey: "AIzaSyApbqv7NCQ_H93RHK0j_EPp0x62YTP8edw",
//   authDomain: "medireminderbackup.firebaseapp.com",
//   projectId: "medireminderbackup",
//   storageBucket: "medireminderbackup.appspot.com",
//   messagingSenderId: "140509064521",
//   appId: "1:140509064521:web:ca552e91f53d0278b8be98",
//   measurementId: "G-QFN3BB56QP"
// };



const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();


