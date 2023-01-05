import { auth } from './firebase_project.js';
import {
  signOut,
  sendEmailVerification,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { Router } from './router.js';
import { displayModal } from './modal.js';

export class ManageAccount {
  static buttonSignOut = document.getElementById('ma_button_sign_out');
  static email = document.getElementById('ma_email');
  static password = document.getElementById('ma_password');

  static setUp() {
    const user = auth.currentUser;
    if (user && user.emailVerified) {
      document.getElementById('ma_verification_div').style.display = 'none';
      document.getElementById('ma_uid').innerText = user.uid;
    } else {
      document.getElementById('ma_verification_div').style.display = 'block';
    }
  }

  static init() {
    console.log('Init of Manage Account');
    this.buttonSignOut.addEventListener('click', () => {
      signOut(auth);
      Router.route_to(Router.VIEW_SIGN_IN);
    });

    document
      .getElementById('ma_button_verify_account')
      .addEventListener('click', () => {
        const user = auth.currentUser;
        if (user) {
          sendEmailVerification(user)
            .then(() => {
              displayModal('E-Mail', 'E-Mail sent.');
            })
            .catch((error) => {
              console.log(error);
              displayModal('Error', error);
            });
        }
        Router.route_to(Router.VIEW_SIGN_IN);
      });

    document
      .getElementById('ma_button_delete_account')
      .addEventListener('click', (event) => {
        event.preventDefault();
        // Check if password is set -----------------------------------------------
        const password = document.getElementById('ma_password').value;

        if (password.length < 6) {
          displayModal('Error', 'Wrong Password');
          return;
        }

        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(user.email, password);
        reauthenticateWithCredential(user, credential)
          .then(() => {
            deleteUser(user)
              .then(() => {
                displayModal('Success', 'Account Deleted');
                Router.route_to(Router.VIEW_SIGN_IN);
              })
              .catch((error) => {
                console.log(error);
                displayModal('Error', error);
              });
          })
          .catch((error) => {
            console.log(error);
            displayModal('Error', error);
          });
      });
  }
}
