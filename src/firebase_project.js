// IMport all the needed things from firebase
import { initializeApp, firebase } from 'firebase/app';

import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAASiGWzXbSL27DZrC9Tj9DRYTb828PTZU',
  authDomain: 'pluto-dev-1a727.firebaseapp.com',
  projectId: 'pluto-dev-1a727',
  storageBucket: 'pluto-dev-1a727.appspot.com',
  messagingSenderId: '112335638903',
  appId: '1:112335638903:web:77b7c71b33efd07d251172',
  measurementId: 'G-97BT77TL70',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { app, auth, db };
