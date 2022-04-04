import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCEqNjlDwqAAtPQ-JfAJ0YOSEnWwKty8DQ",
  authDomain: "labtest-49859.firebaseapp.com",
  projectId: "labtest-49859",
  storageBucket: "labtest-49859.appspot.com",
  messagingSenderId: "1028915075256",
  appId: "1:1028915075256:web:911faacbb928ab000ffc4d"
};
  
//   Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

console.log(app);
  
const auth = app.firebase.auth();
const fireDB = app.firebase.firestore();

export { auth, fireDB };