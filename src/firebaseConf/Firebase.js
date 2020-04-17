import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

// Web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyD5PsmazpwCM4MLg7fb1SUtzgk19DoBtJM",
    authDomain: "pracainzynierska-f7d93.firebaseapp.com",
    databaseURL: "https://pracainzynierska-f7d93.firebaseio.com",
    projectId: "pracainzynierska-f7d93",
    storageBucket: "pracainzynierska-f7d93.appspot.com",
    messagingSenderId: "14158766968",
    appId: "1:14158766968:web:af7995e0c7c589fbf6de8d",
    measurementId: "G-MJ6Z8BVF6J"
  };
  // Initialize Firebase
  const fire=firebase.initializeApp(firebaseConfig);
  export const db = firebase.database();
  export default fire;