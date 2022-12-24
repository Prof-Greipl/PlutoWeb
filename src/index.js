// Import stylesheets
import "./style.css";

// Firebase App (the core Firebase SDK) is always required
import { initializeApp, firebase } from "firebase/app";

// Add the Firebase products and methods that you want to use
import {
  getAuth,
  deleteUser,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  EmailAuthProvider,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  connectAuthEmulator, 
} from "firebase/auth";

import {
  getFirestore,
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  connectFirestoreEmulator,
  serverTimestamp,
  limit,
} from "firebase/firestore";

// Global Variables for Firebase
let auth;
let db;
const AREA_SIGN_IN = 1;
const AREA_POST = 2;
const AREA_CREATE_ACCOUNT = 3;
const AREA_MESSAGES = 4;
const AREA_ACCOUNT = 5;

const nav_sign_in = document.getElementById("nav_sign_in");
const nav_sign_out = document.getElementById("nav_sign_out");
const nav_account = document.getElementById("nav_account");

const areaSignIn = document.getElementById("areaSignIn");
const areaAccount = document.getElementById("areaAccount");
const areaCreateAccount = document.getElementById("areaCreateAccount");
const areaCreateMessages = document.getElementById("areaMessages");

const buttonSignIn = document.getElementById("si_button_sign_in");
const buttonSignInCreateAccount = document.getElementById(
  "si_button_create_account"
);
const signInEmail = document.getElementById("si_email");
const signInPassword = document.getElementById("si_password");

const ac_verified = document.getElementById("ac_verified");
const ac_email = document.getElementById("ac_email");
const ac_verification_div = document.getElementById("ac_verification_div");
const buttonDeleteAccount = document.getElementById("ac_button_delete_account");
const buttonVerifyAccount = document.getElementById("ac_button_verify_account");

const ca_email = document.getElementById("ca_email");
const ca_password = document.getElementById("ca_password");
const ca_password1 = document.getElementById("ca_password1");

const me_ul = document.getElementById("me_ul");
const me_button_post = document.getElementById("me_button_send");

let unsubscribe;



function main() {
  // Add Firebase project configuration object here
  console.log("Called main...")
  const firebaseConfig = {
      apiKey: "AIzaSyAASiGWzXbSL27DZrC9Tj9DRYTb828PTZU",
      authDomain: "pluto-dev-1a727.firebaseapp.com",
      projectId: "pluto-dev-1a727",
      storageBucket: "pluto-dev-1a727.appspot.com",
      messagingSenderId: "112335638903",
      appId: "1:112335638903:web:77b7c71b33efd07d251172",
      measurementId: "G-97BT77TL70"
    };


  initializeApp(firebaseConfig);

  auth = getAuth();
  //connectAuthEmulator(auth, "http://localhost:9099");

  db = getFirestore();
  //connectFirestoreEmulator(db, 'localhost', 8080);
  
  const q = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc"),
    limit(3)
  );

  onAuthStateChanged(auth, (user) => {
    
    console.log("Called onAuthStateChanged");
    //document.getElementById("app").style.display = "block";        
    
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User

      state.user = user;
      state.visibleAreas = [AREA_MESSAGES, AREA_POST];
  //    document.getElementById("app").style.display = "block";
      
      // Start the listener, but onyl of user is verified!
      if (user.emailVerified | true ) {
        console.log("onAuthStateChanged: Verified User =", user.email);
        state.visibleAreas = [AREA_MESSAGES, AREA_POST];
        unsubscribe = onSnapshot(q, (snaps) => {
          // Cear Messages Area with ul-Tag
          me_ul.innerHTML = "";
    
          // Loop through documents in database
          snaps.forEach((doc) => {
            console.log("Adding...:");
            let li = createPostLi(doc.data().author, doc.data().body);
            me_ul.appendChild(li);
          });
        });
      } else {
        console.log("onAuthStateChanged: Unverified User =", user.email);
        console.log("User is not verified. Listener not started, go to Account area")
        state.visibleAreas = [AREA_ACCOUNT];
      }
      updateUi();
    } else {
      console.log("onAuthStateChanged: User = null");
      state.visibleAreas = [AREA_SIGN_IN];
      state.user = null;
      document.getElementById("app").style.display = "block";
      if (unsubscribe) {
        console.log("Stopped the listener...")
        unsubscribe() // Stop the listener
      }
      console.log("OAS - call finisehd")
      updateUi();
    }
  });

 


}

function updateUi() {
  let user = auth.currentUser;

  // Manage the Nav-Bar -----------------------------
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

  // Manage Areas
  if (state.visibleAreas.includes(AREA_SIGN_IN)) {
    areaSignIn.style.display = "block";
  } else {
    areaSignIn.style.display = "none";
  }

  if (state.visibleAreas.includes(AREA_MESSAGES)) {
    areaMessages.style.display = "block";
  } else {
    areaMessages.style.display = "none";
  }

  if (state.visibleAreas.includes(AREA_ACCOUNT)) {
    areaAccount.style.display = "block";
    ac_email.innerText =
      state.user.email + " (" + state.user.emailVerified + ")";
    if (state.user.emailVerified) {
      ac_verification_div.style.display = "none";
    } else {
      ac_verification_div.style.display = "block";
    }
  } else {
    areaAccount.style.display = "none";
  }

  if (state.visibleAreas.includes(AREA_CREATE_ACCOUNT)) {
    areaCreateAccount.style.display = "block";
  } else {
    areaCreateAccount.style.display = "none";
  }
}

// ---------------  Navigation Logic ----------------------------------

nav_sign_in.addEventListener("click", () => {
  state.visibleAreas = [AREA_SIGN_IN];
  updateUi();
});

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

nav_account.addEventListener("click", () => {
  state.visibleAreas = [AREA_ACCOUNT];
  updateUi();
});

// --------------- End of navigation logic-----------------------------------

// Code for CreateAccountArea ------------------------------------------------

document
  .getElementById("ca_button_create_account")
  .addEventListener("click", (e) => {
    e.preventDefault()
    console.log(ca_email.value, ca_password.value, ca_password1.value);
    createUserWithEmailAndPassword(auth, ca_email.value, ca_password.value)
      .then((userCredential) => {
        console.log("Sucess creating user ");
        const user = userCredential.user;
        sendEmailVerification(user)
        .then(() => {
          console.log("Sucess deleting user ");
          displayModal("Account created",
            "Your account was created. We sent an mail  with an activation link to " + user.email +
            ". You use the service after activation of your account!");
          user.signOut();
        })
        .catch((error) => {
          displayModal(
            "Account created",
            "We created the account, but could not send the verification mail. You can sign in to request another activation email.(" + errorMessage + ")"
          );
          console.log("Error deleting user ", error);
          user.signOut();
        });
      })
      .catch((error) => {
        displayModal("Create Account Error", "Account Creatiion failed. (" + error.message + ")");
        console.log("Error creating user : ", error.message);
        if (user) user.signOut();
      });
  });

// ---  Code_signin ----------------------------------------------------
buttonSignInCreateAccount.addEventListener("click", () => {
  state.visibleAreas = [AREA_CREATE_ACCOUNT];
  updateUi();
});

buttonSignIn.addEventListener("click", (event) => {
  const email = signInEmail.value;
  const password = signInPassword.value;

  event.preventDefault();

  console.log("Log in request for " + email, "/", password);

  if (password.length < 6) {
    displayModal("Sign In Error", "Password too short.");
  } else {
    setSpinner("on");
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Login successful");
        setSpinner("off");
        displayModal("Sign In", "You are signed in.");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Login failed : ", errorMessage, "Code : ", errorCode);
        setSpinner("off");
        displayModal("Sign In", "Sign in failed (" + errorMessage + ")");
      });
  }
});

// code_account ----------------------------------------------------
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

buttonVerifyAccount.addEventListener("click", () => {
  let user = auth.currentUser;
  console.log("Start deleting user ", user.email);
  // https://firebase.google.com/docs/auth/web/manage-users#delete_a_user
  sendEmailVerification(user)
    .then(() => {
      console.log("Sucess deleting user ");
      displayModal("E-Mail Verification", "E-Mail has been sent.");
    })
    .catch((error) => {
      displayModal(
        "E-Mail Verification",
        "Sending E-Mail failed (" + error.message + ")"
      );
      console.log("Error sending verification mail : ", error.message);
    });
});

// Code_messages Area ----------------------------------------------------

me_button_post.addEventListener("click", (e) => {
  e.preventDefault();
  
  const body = document.getElementById("me_body_text").value;
  const sys = { source: "Web" };

  // Write a new message to the database collection "guestbook"
  console.log("Writing to db");
  addDoc(collection(db, "posts"), {
    uid: auth.currentUser.uid,
    email: auth.currentUser.email,
    title: "unset",
    body: body,
    //createdAt: new Date(),
    createdAt: serverTimestamp(),
    sys: sys,
  })
    .then(() => {
      console.log("Successfully written.");
      document.getElementById("me_body_text").value = "";
    })
    .catch((error) => {
      console.log("Adding doc failed: ", error);
    });

  return false;
});

document
  .getElementById("me_body_text")
  .addEventListener("keypress", function (event) {
    console.log("Your pressed key..");
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      me_button_post.click();
    }
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

function setSpinner(value) {
  if (value == "on") document.getElementById("spinner").style.display = "block";
  else document.getElementById("spinner").style.display = "none";
}

// Set Testvalues
signInEmail.value = "fhgreipl@gmail.com";
signInPassword.value = "123456";
ca_email.value = "fhgreipl@gmail.com";
ca_password.value = "123456";
ca_password1.value = "123456";

//me_ul.appendChild(createPostLi("Mail 1", "Message 1"));
//me_ul.appendChild(createPostLi("Mail 2", "Message 2"));
console.log("Turning spinner off...")
setSpinner("off");
console.log("Calling main.." + new Date())
main();
//console.log("Loading finshed..."+ (state.user)?"No user":state.user.email);
