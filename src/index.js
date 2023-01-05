// Import stylesheets
import './style.css';

// IMport all the needed things from firebase
import { app, auth, db } from './firebase_project.js';

import { onAuthStateChanged } from 'firebase/auth';
import { serverTimestamp } from 'firebase/firestore';

import {
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  limit,
} from 'firebase/firestore';

import { Router } from './router.js';
import { sign_in_init } from './sign_in.js';
import { showUserNavItem } from './navigation.js';
import { ManageAccount } from './manage_account.js';
import { CreateAccountInit } from './create_account.js';

console.log("Startup : Imports are done")
sign_in_init();
ManageAccount.init();
CreateAccountInit();

document.getElementById('app').style.display = 'block';
console.log("Startup : All JS loaded")
// Just for testing
/*
document.getElementById('si_email').value = 'fhgreipl@gmail.com';
document.getElementById('si_password').value = '123456';
document.getElementById('ca_email').value = 'fhgreipl@gmail.com';
document.getElementById('ca_password').value = '123456';
document.getElementById('ca_password1').value = '123456';
*/

const q = query(
  collection(db, 'posts'),
  orderBy('createdAt', 'desc'),
  limit(5)
);

Router.hide_all_views();

let unsubscribe = null;

onAuthStateChanged(auth, (user) => {
  console.log('Called onAuthStateChanged');

  if (user) {
    showUserNavItem(user.email);
    // Start the listener, but onyl of user is verified!
    if (user.emailVerified) {
      console.log('...onAuthStateChanged: Verified User =', user.email);

      Router.route_to(Router.VIEW_MAIN);

      if (unsubscribe == null) {
        console.log('... Subscribing');
        unsubscribe = onSnapshot(q, (snaps) => {
          document.getElementById('me_ul').innerHTML = '';
          snaps.forEach((doc) => {
            let template = document.getElementById('message-template');
            let li = template.content.cloneNode(true);
            li.getElementById('line1').textContent =
              doc.data().email + ' (' + doc.data().sys.source + ')';
            li.getElementById('line2').textContent = doc.data().body;
            document.getElementById('me_ul').appendChild(li);
          });
        });
      }
    } else {
      Router.route_to(Router.VIEW_MANAGE_ACCOUNT);
    }
  } else {
    console.log('...onAuthStateChanged: User = null');
    if (unsubscribe) {
      console.log('... Unsubscribing');
      unsubscribe(); // Stop the listener
    }
    showUserNavItem('');
    Router.route_to(Router.VIEW_SIGN_IN);
  }
  console.log('Finished OnAuthState Changed');
});

document.getElementById('me_button_send').addEventListener('click', (event) => {
  console.log('Writing Post');
  event.preventDefault();

  const body = document.getElementById('me_body_text').value;
  if (body.length == 0) {
    return;
  }

  const sys = { source: 'Web' };

  // Write a new message to the database collection "guestbook"
  console.log('Writing to db');
  addDoc(collection(db, 'posts'), {
    uid: auth.currentUser.uid,
    email: auth.currentUser.email,
    title: 'unset',
    body: body,
    //createdAt: new Date(),
    createdAt: serverTimestamp(),
    sys: sys,
  })
    .then(() => {
      console.log('Successfully written.');
      document.getElementById('me_body_text').value = '';
    })
    .catch((error) => {
      console.log('Adding doc failed: ', error);
    });
});

document
  .getElementById('me_body_text')
  .addEventListener('keypress', function (event) {
    console.log('Your pressed key..');
    if (event.key === 'Enter') {
      event.preventDefault();
      document.getElementById('me_button_send').click();
    }
  });
console.log("Start-Up: Index.Js loading finished");

