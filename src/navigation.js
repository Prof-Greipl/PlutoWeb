import { Router } from './router.js';
import { auth } from './firebase_project.js';

function showUserNavItem(username) {
  document.getElementById('nav_user_account').innerHTML = username;
}


// Logic NavBar
nav_user_account.addEventListener('click', () => {
  Router.route_to(Router.VIEW_MANAGE_ACCOUNT);
});

nav_home.addEventListener('click', () => {
  const user = auth.currentUser;
  if (user && user.emailVerified) {
    console.log('A');
    Router.route_to(Router.VIEW_MAIN);
  }

  if (user && !user.emailVerified) {
    console.log('A');
    Router.route_to(Router.VIEW_MANAGE_ACCOUNT);
  }

  if (user == null) {
    console.log('C');
    Router.route_to(Router.VIEW_SIGN_IN);
  }
});

export { showUserNavItem };
