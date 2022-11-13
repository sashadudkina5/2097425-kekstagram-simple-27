import {isEscapeKey} from './util.js';

const uploadPhotoInput = document.querySelector('#upload-file');
const photoEditorForm = document.querySelector('.img-upload__overlay');
const bodyElement = document.querySelector('body');
const cancelUploading = document.querySelector('#upload-cancel');

const onUploaderEscapeKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeUploaderFrom();
  }
};

function closeUploaderFrom () {
  photoEditorForm.classList.add('hidden');
  bodyElement.classList.remove('modal-open');
  uploadPhotoInput.value = '';

  document.removeEventListener('keydown', onUploaderEscapeKeydown);
}

uploadPhotoInput.addEventListener('change', () => {
  photoEditorForm.classList.remove('hidden');
  bodyElement.classList.add('modal-open');

  document.addEventListener('keydown', onUploaderEscapeKeydown);

  cancelUploading.addEventListener('click', () => {
    photoEditorForm.classList.add('hidden');
    bodyElement.classList.remove('modal-open');
    uploadPhotoInput.value = '';
  });
});


// Валидация комментария

const formUpload = document.querySelector('.img-upload__form');

const pristine = new Pristine(formUpload, {
  classTo: 'img-upload__text',
  errorTextParent: 'img-upload__text',
  errorTextClass: 'img-upload__error-text',
});

formUpload.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();
  if (isValid) {
    console.log('Можно отправлять');
  } else {
    console.log('Форма невалидна');
  }
});
