import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBDoprANJh6CozzNKDJ9mtVo8VqUNPIGcg",
  authDomain: "medireminder-a948a.firebaseapp.com",
  projectId: "medireminder-a948a",
  storageBucket: "medireminder-a948a.appspot.com",
  messagingSenderId: "275217622123",
  appId: "1:275217622123:web:d6694bdbbc3011960f7d2e",
  measurementId: "G-DJ2P0X4BNV"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export default firestore;