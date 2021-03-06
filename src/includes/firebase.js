import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyA6wVvhWevVPQp63K8xrgwJhTe5nl4Y6HY',
  authDomain: 'music-dc876.firebaseapp.com',
  projectId: 'music-dc876',
  storageBucket: 'music-dc876.appspot.com',
  appId: '1:909064388332:web:aa8eb7d54fd87d486a6fc9',
  measurementId: 'G-373NZDX3PK',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

db.enablePersistence().catch((error) => {
  console.error(`Firebase persistance error ${error}`);
});

const usersCollection = db.collection('users');
const songsCollection = db.collection('songs');
const commentsCollection = db.collection('comments');

export {
  auth,
  db,
  usersCollection,
  songsCollection,
  commentsCollection,
  storage,
};
