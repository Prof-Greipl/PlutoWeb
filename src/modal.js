import { Modal } from 'bootstrap';
console.log('>> Initiating Modal');

const dialog_modal = new Modal('#myModal', { keyboard: false });
const fp_modal = new Modal('#fp_modal', { keyboard: false });

function displayModal(title, body) {
  console.log('   Called displayModel w ' + title + ' / ' + body);

  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').textContent = body;
  dialog_modal.show();
}

function displayForgotPasswordModal() {
  const m = new Modal('#fp_modal', { keyboard: false });
  m.show();
}

export { displayModal, displayForgotPasswordModal };
