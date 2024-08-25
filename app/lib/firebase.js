import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyDK461r_Oy3FUyKXSjGcx7T1vupJUXu3gQ",
    authDomain: "flashcards-50.firebaseapp.com",
    projectId: "flashcards-50",
    storageBucket: "flashcards-50.appspot.com",
    messagingSenderId: "213665039136",
    appId: "1:213665039136:web:f1a2f4eba361f22b00cd45",
    // measurementId: "G-KLKEFR23Q1"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };