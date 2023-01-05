import { auth } from './firebase_project.js';
import {
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification, 
} from 'firebase/auth';
import { Router } from './router.js';
import { displayModal } from './modal.js';


export function CreateAccountInit() {
  console.log('Create Account - Starting ');

  document
    .getElementById('ca_button_create_account')
    .addEventListener('click', (event) => {
      event.preventDefault();
      const email = document.getElementById('ca_email').value;
      const password = document.getElementById('ca_password').value;
      const password1 = document.getElementById('ca_password1').value;

      console.log('Create Account for :', email, password, password1);

      if (password != password1) {
        displayModal('Error', 'Passwords do not match');
        return;
      }

      if ((password.length < 6) | (password1.length < 6)) {
        displayModal('Error', 'Password too short');
        return;
      }

      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log('Sucess creating user ');
          const user = userCredential.user;
          console.log('Sending E-Mail Verificaton ', user);
          sendEmailVerification(user);
        })
        .then(() => {
          const user = auth.currentUser;
          console.log('Sucess creating user ');
          displayModal(
            'Account created',
            'Your account was created. We sent an mail  with an activation link to ' +
              user.email +
              '. You can use the service after activation of your account!'
          );
        })
        .catch((error) => {
          displayModal('Create Account Error', error.message);
          console.log('Error creating user : ', error.message);
        })
        .finally(() => {
          signOut(auth);
        }); // End of Create Chain
    }); // End of Eventlistener
}
