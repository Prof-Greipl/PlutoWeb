import { ManageAccount } from './manage_account.js';

class Router {
  static VIEW_MAIN = 1;
  static VIEW_SIGN_IN = 2;
  static VIEW_MANAGE_ACCOUNT = 3;
  static VIEW_CREATE_ACCOUNT = 4;

  static hide_all_views() {
    this.view_main.style.display = 'none';
    this.view_sign_in.style.display = 'none';
    this.view_manage_account.style.display = 'none';
    this.view_create_account.style.display = 'none';
  }

  static route_to(current_view) {
    console.log('Router called with route ', current_view);

    this.hide_all_views();

    switch (current_view) {
      case this.VIEW_MAIN:
        view_main.style.display = 'block';
        break;

      case this.VIEW_SIGN_IN:
        view_sign_in.style.display = 'block';
        break;

      case this.VIEW_MANAGE_ACCOUNT:
        ManageAccount.setUp();
        view_manage_account.style.display = 'block';
        break;

      case this.VIEW_CREATE_ACCOUNT:
        view_create_account.style.display = 'block';
        break;
    }
  }

  static {
    console.log('Router was initialized');
    this.view_main = document.getElementById('view_main');
    this.view_sign_in = document.getElementById('view_sign_in');
    this.view_create_account = document.getElementById('view_create_account');
    this.view_manage_account = document.getElementById('view_manage_account');
  }
}

export { Router };
