// Import stylesheets
import "./style.css";

// Firebase App (the core Firebase SDK) is always required
import { initializeApp, firebase } from "firebase/app";

// Add the Firebase products and methods that you want to use
import {
  getAuth,
  deleteUser,
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";

import {
  getFirestore,
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  connectFirestoreEmulator,
} from "firebase/firestore";

// Global Variables for Firebase
let auth;
let db;

const ac_verified = document.getElementById("ac_verified");
const ac_email = document.getElementById("ac_email");

async function main() {
  // Add Firebase project configuration object here
  const firebaseConfig = {
    apiKey: "AIzaSyD1M3cwjvRdl-JpC4RoR8JStjKOOi7kdkE",
    authDomain: "pluto22-gkw.firebaseapp.com",
    databaseURL: "https://pluto22-gkw-default-rtdb.firebaseio.com",
    projectId: "pluto22-gkw",
    storageBucket: "pluto22-gkw.appspot.com",
    messagingSenderId: "84704125590",
    appId: "1:84704125590:web:0eafedfc271c4c86db98b7",
  };

  initializeApp(firebaseConfig);

  auth = getAuth();
  db = getFirestore();

  onAuthStateChanged(auth, (user) => {
    console.log("Called oASC");
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User

      state.user = user;
      console.log("onAuthStateChanged: User =", user.email);
      state.visibleAreas = [AREA_MESSAGES, AREA_POST];
      document.getElementById("app").style.display = "block";
      updateUi();
    } else {
      console.log("onAuthStateChanged: User = null");
      state.visibleAreas = [AREA_SIGN_IN];
      state.user = null;
      document.getElementById("app").style.display = "block";
      updateUi();
    }
  });

  const me_ul = document.getElementById("me_ul");
  console.log("Called onSnapShot");
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

  onSnapshot(q, (snaps) => {
    // Cear Messages Area with ul-Tag
    me_ul.innerHTML = "";

    // Loop through documents in database
    snaps.forEach((doc) => {
      console.log("Adding...:");
      let li = createPostLi(doc.data().author, doc.data().body);
      me_ul.appendChild(li);
    });
  });
}

const AREA_SIGN_IN = 1;
const AREA_POST = 2;
const AREA_CREATE_ACCOUNT = 3;
const AREA_MESSAGES = 4;
const AREA_ACCOUNT = 5;

function updateUi() {
  let user = auth.currentUser;
  if (state.user) {
    // Define visible areas
    nav_sign_in.style.display = "none";
    nav_sign_out.style.display = "block";
    nav_account.style.display = "block";
    nav_account.innerText = user.email;
  } else {
    nav_sign_in.style.display = "block";
    nav_sign_out.style.display = "none";
    nav_account.style.display = "none";
    nav_account.innerText = "";
  }

  areaSignIn.style.display = state.visibleAreas.includes(AREA_SIGN_IN)
    ? "block"
    : "none";

  areaMessages.style.display = state.visibleAreas.includes(AREA_MESSAGES)
    ? "block"
    : "none";
  areaCreateAccount.style.display = state.visibleAreas.includes(
    AREA_CREATE_ACCOUNT
  )
    ? "block"
    : "none";
  areaAccount.style.display = state.visibleAreas.includes(AREA_ACCOUNT)
    ? "block"
    : "none";
}

// ---------------  Navigation Logic ----------------------------------

const nav_sign_in = document.getElementById("nav_sign_in");
nav_sign_in.addEventListener("click", () => {
  state.visibleAreas = [AREA_SIGN_IN];
  updateUi();
});

const nav_sign_out = document.getElementById("nav_sign_out");
nav_sign_out.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      displayModal("Sign Out", "You are signed out.");
      console.log("Your are signed out");
      updateUi();
    })
    .catch((error) => {
      displayModal("Sign Out Error", "Operation failed " + error.errorMessage);
      console.log("Login failed : ", errorMessage);
      updateUi();
    });
});

const nav_account = document.getElementById("nav_account");
nav_account.addEventListener("click", () => {
  ac_email.innerText = state.user.email;
  ac_verified.innerText = state.user.verified;
  state.visibleAreas = [AREA_ACCOUNT];
  updateUi();
});

// --------------- End of navigation logic

nav_account.addEventListener("click", () => {
  state.visibleAreas = [AREA_ACCOUNT];
  updateUi();
});

// Code for CreateAccountArea ------------------------------------------------
const ca_email = document.getElementById("ca_email");
const ca_password = document.getElementById("ca_password");
const ca_password1 = document.getElementById("ca_password1");

ca_email.value = "dietergreipl@gmail.com";
ca_password.value = "123456";
ca_password1.value = "123456";

document
  .getElementById("ca_button_create_account")
  .addEventListener("click", () => {
    console.log(ca_email.value, ca_password.value, ca_password1.value);
    createUserWithEmailAndPassword(auth, ca_email.value, ca_password.value)
      .then((userCredential) => {
        console.log("Sucess creating user ");
        displayModal("Create Account", "Account created.");
        const user = userCredential.user;
      })
      .catch((error) => {
        displayModal("Create Account Error", "Failes (" + error.message + ")");
        console.log("Error creating user : ", error.message);
      });
  });

// ---  Code for SignInArea ----------------------------------------------------
const buttonSignIn = document.getElementById("si_button_sign_in");
const buttonSignInCreateAccount = document.getElementById(
  "si_button_create_account"
);
const signInEmail = document.getElementById("si_email");
const signInPassword = document.getElementById("si_password");

buttonSignInCreateAccount.addEventListener("click", () => {
  state.visibleAreas = [AREA_CREATE_ACCOUNT];
  updateUi();
});

buttonSignIn.addEventListener("click", () => {
  const email = signInEmail.value;
  const password = signInPassword.value;
  console.log(email, "/", password.length);

  if (password.length < 6) {
    displayModal("Sign In Error", "Password too short.");
  } else {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Login successful");
        displayModal("Sign In", "You are signed in.");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Login failed : ", errorMessage, "Code : ", errorCode);
        displayModal("Sign In", "Sign in failed (" + errorMessage + ")");
      });
  }
});

// Code for Account Area ----------------------------------------------------
const buttonDeleteAccount = document.getElementById("ac_button_delete_account");
buttonDeleteAccount.addEventListener("click", () => {
  let user = auth.currentUser;
  console.log("Start deleting user ", user.email);
  // https://firebase.google.com/docs/auth/web/manage-users#delete_a_user
  deleteUser(user)
    .then(() => {
      console.log("Sucess deleting user ");
      displayModal("Account", "Your account has been deleted.");
    })
    .catch((error) => {
      displayModal("Account", "Your account could not be deleted.");
      console.log("Error deleting user ", error);
    });
});

// Code for Messages Area ----------------------------------------------------
const me_button_post = document.getElementById("me_button_send");
me_button_post.addEventListener("click", () => {
  let body = document.getElementById("me_body_text").value;
  console.log("SUbmit...");
  // Prevent the default form redirect
  //e.preventDefault();
  // Write a new message to the database collection "guestbook"
  console.log("Writing to db");
  addDoc(collection(db, "posts"), {
    author: auth.currentUser.email,
    title: "unset",
    body: body,
    createdAt: new Date(), //firebase.firestore.FieldValue.serverTimestamp(),
    source: "Web",
    uid: auth.currentUser.uid,
  })
    .then(() => {
      console.log("Successfully written.");
    })
    .catch((error) => {
      console.log("Adding doc failed: ", error);
    });

  return false;
});

function createPostLi(author, body) {
  const span1 = document.createElement("span");
  span1.textContent = author; //title;

  const br = document.createElement("br");

  // Zeile 2
  const span2 = document.createElement("span");
  span2.textContent = body;

  const div = document.createElement("div");

  div.appendChild(span1);
  div.appendChild(br);
  div.appendChild(span2);

  const li = document.createElement("li");
  li.className = "list-group-item";
  li.appendChild(div);

  return li;
}

function displayModal(title, body) {
  let options = {
    keyboard: false,
  };

  const myModal = new bootstrap.Modal("#myModal", options);
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-body").textContent = body;
  myModal.show();
}

let state = {
  user: null,
  visibleAreas: [],
};

// Set Testvalues
signInEmail.value = "dietergreipl@gmail.com";
signInPassword.value = "123456";
//let me_ul = document.getElementById('me_ul');
//me_ul.appendChild(createPostLi("Mail 1", "Message 1"));
//me_ul.appendChild(createPostLi("Mail 2", "Message 2"));
main();
