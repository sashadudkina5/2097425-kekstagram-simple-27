import {isEscapeKey} from './util.js';

const uploadPhotoInput = document.querySelector('#upload-file');
const photoEditorForm = document.querySelector('.img-upload__overlay');
const bodyElement = document.querySelector('body');
const cancelUploading = document.querySelector('#upload-cancel');

// Переменные для масштабирования изображения

const SIZE_VALUE_DEFAULT = 100;
const SIZE_MIN = 25;
const SIZE_MAX = 100;
const SIZE_STEP = 25;
let sizeValue = 100;

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
  sizeValue = SIZE_VALUE_DEFAULT;
  imgUploadPreview.style.transform = `scale(${1})`;
  imgUploadPreview.className = 'effects__preview--none';

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
    sizeValue = SIZE_VALUE_DEFAULT;
    imgUploadPreview.style.transform = `scale(${1})`;
    imgUploadPreview.className = 'effects__preview--none';
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

// Настройка масштаба изображения

const scaleValue = document.querySelector('.scale__control--value');
const scaleBigger = document.querySelector('.scale__control--bigger');
const scaleSmaller = document.querySelector('.scale__control--smaller');
const imgUploadPreview = document.querySelector('.img-upload__preview');


scaleSmaller.addEventListener('click', () => {
  if (sizeValue > SIZE_MIN) {
    sizeValue -= SIZE_STEP;
    scaleValue.value = `${sizeValue}%`;
    imgUploadPreview.style.transform = `scale(${sizeValue / 100})`;
  }
});

scaleBigger.addEventListener('click', () => {
  if (sizeValue < SIZE_MAX) {
    sizeValue += SIZE_STEP;
    scaleValue.value = `${sizeValue}%`;
    imgUploadPreview.style.transform = `scale(${sizeValue / 100})`;
  }
});

// Наложение эффекта на фото

const chosenEffectRadios = document.querySelectorAll('.effects__radio');
const effectsList = document.querySelector('.effects__list');
const effectItems = effectsList.querySelectorAll('.effects__item');
const originalEffect = document.getElementById('effect-none');


for (let radio of chosenEffectRadios) {
  radio.onclick = function (evt) {
    evt.preventDefault();
    radio.checked = true;
    originalEffect.checked = false; //не работает
    imgUploadPreview.className = `effects__preview--${radio.value}`;
  };
}
