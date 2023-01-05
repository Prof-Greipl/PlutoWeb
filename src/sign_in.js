import { Router } from './router.js';
import { displayForgotPasswordModal, displayModal } from './modal.js';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from './firebase_project.js';

const buttonSignIn = document.getElementById('si_button_sign_in');
const buttonSignInCreateAccount = document.getElementById(
  'si_button_create_account'
);
const buttonSignInForgotPassword = document.getElementById(
  'si_button_forgot_password'
);

const button_send = document.getElementById('fp_button_send');
const signInEmail = document.getElementById('si_email');
const signInPassword = document.getElementById('si_password');


buttonSignInCreateAccount.addEventListener('click', () => {
  Router.route_to(Router.VIEW_CREATE_ACCOUNT);
});

buttonSignInForgotPassword.addEventListener('click', () => {
  displayForgotPasswordModal();
});

button_send.addEventListener('click', () => {
  const email = document.getElementById('fp_email').value;
  sendPasswordResetEmail(auth, email)
    .then(() => {
      document.getElementById('fp_status').innerHTML =
        'Ok, check your inbox. You can close this window.';
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      document.getElementById('fp_status').innerHTML = 'Fail :' + error.message;
    });
});

buttonSignIn.addEventListener('click', (event) => {
  const email = signInEmail.value;
  const password = signInPassword.value;
  event.preventDefault();

  console.log('Log in request for ' + email, '/', password);

  if (password.length < 6) {
    displayModal('Sign In Error', 'Password too short.');
  } else {
    //   setSpinner('on');

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Login successful');
        //   setSpinner('off');
        displayModal('Sign In', 'You are signed in.');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('Login failed : ', errorMessage, 'Code : ', errorCode);
        //   setSpinner('off');
        displayModal('Sign In', 'Sign in failed (' + errorMessage + ')');
      });
  }
});
console.log('Init of sign_in.js');

function sign_in_init() {}

export { sign_in_init };
