import firebase from 'firebase'

let firebaseApp = firebase.initializeApp({
// Your web app's Firebase configuration
  apiKey: "AIzaSyCPNj3pL1DrmcmlYOZ3OgcSxOHi5pbK-l0",
  authDomain: "rifamc-40f07.firebaseapp.com",
  databaseURL: "https://rifamc-40f07.firebaseio.com",
  projectId: "rifamc-40f07",
  storageBucket: "rifamc-40f07.appspot.com",
  messagingSenderId: "56794161319",
  appId: "1:56794161319:web:a143a683552436b33dbb82"
})

const db = firebaseApp.firestore();
const storage = firebaseApp.storage();

export { db, storage }