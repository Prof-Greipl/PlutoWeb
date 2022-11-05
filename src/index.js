// Import stylesheets
import './style.css';

// Firebase App (the core Firebase SDK) is always required
import { initializeApp, firebase } from 'firebase/app';

// Add the Firebase products and methods that you want to use
import {
  getAuth,
  deleteUser,
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword
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



// Global Variables for Firebase
let auth
let db

const ac_verified = document.getElementById('ac_verified');
const ac_email = document.getElementById('ac_email');


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
  db = getFirestore();

  onAuthStateChanged(auth, (user) => {
    console.log("Called oASC");
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      
      ac_email.innerText = user.email
      ac_verified.innerText = user.emailVerified

      console.log("onAuthStateChanged: User =", user.email);
      state.visibleAreas = [AREA_MESSAGES, AREA_POST]
      updateUi();
    
    } else {
      console.log("onAuthStateChanged: User = null");
      state.visibleAreas = [AREA_SIGN_IN]
      updateUi();
    }
  })

}



const AREA_SIGN_IN = 1
const AREA_POST = 2
const AREA_CREATE_ACCOUNT = 3
const AREA_MESSAGES = 4
const AREA_ACCOUNT = 5



function updateUi() {
  areaSignIn.style.display = state.visibleAreas.includes(AREA_SIGN_IN) ? "block" : "none"
  areaPost.style.display = state.visibleAreas.includes(AREA_POST) ? "block" : "none"
  areaMessages.style.display = state.visibleAreas.includes(AREA_MESSAGES) ? "block" : "none"
  areaCreateAccount.style.display = state.visibleAreas.includes(AREA_CREATE_ACCOUNT) ? "block" : "none"
  areaAccount.style.display = state.visibleAreas.includes(AREA_ACCOUNT) ? "block" : "none"
}


// ---------------  Navigation Logic ----------------------------------
const nav_sign_in = document.getElementById('nav_sign_in');
const nav_sign_out = document.getElementById('nav_sign_out');
const nav_account = document.getElementById('nav_account')

nav_sign_in.addEventListener('click', () => {
  state.visibleAreas = [AREA_SIGN_IN]
  updateUi()
});

nav_sign_out.addEventListener('click', () => {
  signOut(auth).then(() => {
    displayModal("Sign Out", "You are signed out.");
    console.log("Your are signed out");  
  }).catch((error) => {
    displayModal("Sign Out Error", "Operation failed " + error.errorMessage);
    console.log("Login failed : ", errorMessage);      
  });
  state.visibleAreas = [AREA_SIGN_IN]
  updateUi()
});



nav_account.addEventListener('click', () => {
  state.visibleAreas = [AREA_ACCOUNT]
  updateUi()
});

// Code for CreateAccountArea ------------------------------------------------
const ca_email= document.getElementById('ca_email')
const ca_password = document.getElementById('ca_password')
const ca_password1 = document.getElementById('ca_password1')

ca_email.value="dietergreipl@gmail.com"
ca_password.value = "123456"
ca_password1.value = "123456"

document.getElementById('ca_button_create_account').addEventListener('click', () => {
  console.log(ca_email.value, ca_password.value, ca_password1.value);
  createUserWithEmailAndPassword(auth, ca_email.value, ca_password.value)
  .then((userCredential) => {
    console.log("Sucess creating user ");
    displayModal("Create Account", "Account created.")
    const user = userCredential.user;
  })
    .catch((error) => {
      displayModal("Create Account Error", "Failes ("+ error.message+")")
      console.log("Error creating user : ", error.message);
  });
})


// ---  Code for SignInArea ----------------------------------------------------
const buttonSignIn = document.getElementById('si_button_sign_in')
const buttonSignInCreateAccount = document.getElementById('si_button_create_account')
const signInEmail = document.getElementById('si_email')
const signInPassword = document.getElementById('si_password')

buttonSignInCreateAccount.addEventListener('click', () => {
  state.visibleAreas = [AREA_CREATE_ACCOUNT]
  updateUi();
})

buttonSignIn.addEventListener('click', () => {
  const email = signInEmail.value
  const password = signInPassword.value
  console.log(email, "/", password.length)

  if (password.length < 6) {
    displayModal("Sign In Error", "Password too short.")
  } else {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        
        const user = userCredential.user;
        console.log("Login successful")
        displayModal("Sign In", "You are signed in.")
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Login failed : ", errorMessage, "Code : ", errorCode);
        displayModal("Sign In", "Sign in failed ("+errorMessage+")")      
      });
  }
})


// Coder for Account Area ----------------------------------------------------
const buttonDeleteAccount = document.getElementById('ac_button_delete_account')
buttonDeleteAccount.addEventListener('click', () => {
  let user = auth.currentUser
  console.log("Start deleting user ", user.email);
  // https://firebase.google.com/docs/auth/web/manage-users#delete_a_user
  deleteUser(user).then(() => {
    console.log("Sucess deleting user ");
    displayModal("Account", "Your account has been deleted.")
  }).catch((error) => {
    displayModal("Account", "Your account could not be deleted.")
    console.log("Error deleting user ", error);
  });
})

function createPostLi(title, body) {

  const span1 = document.createElement('span');
  span1.textContent = "to be defined" //title;
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


function displayModal(title, body) {
  let options = {
    keyboard: false
  }

  const myModal = new bootstrap.Modal('#myModal', options)
  document.getElementById("modal-title").textContent = title
  document.getElementById("modal-body").textContent = body
  myModal.show()

}

function setTestValues() {
  signInEmail.value = "dietergreipl@gmail.com"
  signInPassword.value = "123456"
}

let state = {
  signedIn: false,
  visibleAreas: [AREA_SIGN_IN]
}

main();

setTestValues();
updateUi();

