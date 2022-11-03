// Import stylesheets
import './style.css';

// Firebase App (the core Firebase SDK) is always required
import { initializeApp, firebase } from 'firebase/app';

// Add the Firebase products and methods that you want to use
import {
  getAuth,
  EmailAuthProvider,
  signOut,
  onAuthStateChanged,
  connectAuthEmulator,
} from 'firebase/auth';

import {
  getFirestore,
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  connectFirestoreEmulator
} from 'firebase/firestore';

import * as firebaseui from 'firebaseui';

// Document elements
const startRsvpButton = document.getElementById('startRsvp');
const guestbookContainer = document.getElementById('guestbook-container');

const form = document.getElementById('postForm');
const title = document.getElementById('title');
const body = document.getElementById('body');
const postSection = document.getElementById('postSection');

const buSignIn = document.getElementById('buSignIn');
const buSignOut = document.getElementById('buSignOut');
const buPost = document.getElementById('buPost');
const buManageAccount = document.getElementById('buManageAccount');
const buSubmit = document.getElementById('buSubmit');

buSignIn.addEventListener('click', () => {
  if (auth.currentUser) {
    // User is signed in; allows user to sign out
    signOut(auth);
  } else {
    // No user is signed in; allows user to sign in
    ui.start('#firebaseui-auth-container', uiConfig);
  }
});

buSignOut.addEventListener('click', () => {
  if (auth.currentUser) {
    // User is signed in; allows user to sign out
    signOut(auth);
  } else {
    // No user is signed in; allows user to sign in
    ui.start('#firebaseui-auth-container', uiConfig);
  }
});


let db, auth;


function createPostLi(title, body){

  const span1 = document.createElement('span');
  span1.textContent = title;
  span1.class = 'w3-large';

  const br = document.createElement('br');

  // Zeile 2
  const span2 = document.createElement('span');
  span2.textContent = body;

  const div = document.createElement('div');
  div.className = 'w3-bar-item';

  div.appendChild(span1);
  div.appendChild(br);
  div.appendChild(span2);

  const li = document.createElement('li');
  li.className = 'w3-bar';
  li.appendChild(div);

  return li;

};


async function main() {
  // Add Firebase project configuration object here
  const firebaseConfig = {
    apiKey: 'AIzaSyD1M3cwjvRdl-JpC4RoR8JStjKOOi7kdkE',
    authDomain: 'pluto22-gkw.firebaseapp.com',
    databaseURL: 'https://pluto22-gkw-default-rtdb.firebaseio.com',
    projectId: 'pluto22-gkw',
    storageBucket: 'pluto22-gkw.appspot.com',
    messagingSenderId: '84704125590',
    appId: '1:84704125590:web:0eafedfc271c4c86db98b7',
  };

  initializeApp(firebaseConfig);

  auth = getAuth();
  connectAuthEmulator(auth, "http://localhost:9099");

  db = getFirestore();
  connectFirestoreEmulator(db, 'localhost', 8080);
  console.log("Connected to Emulator!")

  // FirebaseUI config
  const uiConfig = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInOptions: [
      // Email / Password Provider.
      EmailAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: function (authResult, redirectUrl) {
        // Handle sign-in.
        // Return false to avoid redirect.
        return false;
      },
    },
  };

  const ui = new firebaseui.auth.AuthUI(auth);

  // Event Listener for Buttons

  

  /*
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('onAuthStateChanged: User present');
      buSignOut.style.display = 'block';
      buSignIn.style.display = 'none';
      buManageAccount.style.display = 'block';
    } else {
      console.log('onAuthStateChanged: No user present');
      buSignOut.style.display = 'none';
      buSignIn.style.display = 'block';
      buManageAccount.style.display = 'none';
    }
  });

  
  // Listen to the form submission
  form.addEventListener('submit', async (e) => {
    console.log("SUbmit...")
    // Prevent the default form redirect
    e.preventDefault();
    // Write a new message to the database collection "guestbook"
    console.log('Writing to db');
    addDoc(collection(db, 'posts'), {
      author: auth.currentUser.email,
      title: title.value,
      body: body.value,
      createdAt: new Date(), //firebase.firestore.FieldValue.serverTimestamp(),
      source: 'Web',
      uid: auth.currentUser.uid,
    })
      .then(() => {
        console.log('Successfzlly written.');
      })
      .catch((error) => {
        console.log('Adding doc failed: ', error);
      });

    return false;
  });



  // Create query for messages
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
  onSnapshot(q, (snaps) => {
    // Reset page
    postSection.innerHTML = '';
    // Loop through documents in database

    snaps.forEach((doc) => {
      console.log('Adding...:');


      // Zeile 1
      const span1 = document.createElement('span');
      span1.textContent = doc.data().title;
      span1.class = 'w3-large';

      const br = document.createElement('br');

      // Zeile 2
      const span2 = document.createElement('span');
      span2.textContent = doc.data().body;

      const div = document.createElement('div');
      div.className = 'w3-bar-item';

      div.appendChild(span1);
      div.appendChild(br);
      div.appendChild(span2);

      const li = document.createElement('li');
      li.className = 'w3-bar';
      li.appendChild(div);

      postSection.appendChild(li);

    });
  });
  */
}

main();
title.value = 'Hans';
body.value = 'Lore Ipsum se...';
const li1 = createPostLi("Titel", "Body");
postSection.appendChild(li1);
