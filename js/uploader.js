import {isEscapeKey} from './util.js';

const imgUploadPreview = document.querySelector('.img-upload__preview');

const uploadPhotoInput = document.querySelector('#upload-file');
const photoEditorForm = document.querySelector('.img-upload__overlay');
const bodyElement = document.querySelector('body');
const cancelUploading = document.querySelector('#upload-cancel');
const formUpload = document.getElementById('upload-select-image');

// Переменные для масштабирования изображения

const SIZE_VALUE_DEFAULT = 100;
const SIZE_MIN = 25;
const SIZE_MAX = 100;
const SIZE_STEP = 25;
let sizeValue = 100;

//Закрытие и открытие окна загрузки


const onUploaderEscapeKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeUploaderFrom();
  }
};

const closeUploaderFrom = () => {
  photoEditorForm.classList.add('hidden');
  bodyElement.classList.remove('modal-open');
  uploadPhotoInput.value = '';
  sizeValue = SIZE_VALUE_DEFAULT;
  imgUploadPreview.style.transform = `scale(${1})`;
  imgUploadPreview.className = 'effects__preview--none';
  document.querySelector('.text__description').value = '';

  document.removeEventListener('keydown', onUploaderEscapeKeydown);

};


uploadPhotoInput.addEventListener('change', () => {
  photoEditorForm.classList.remove('hidden');
  bodyElement.classList.add('modal-open');
  document.addEventListener('keydown', onUploaderEscapeKeydown);
  cancelUploading.addEventListener('click', (closeUploaderFrom));
});

// Валидация комментария

const pristine = new Pristine(formUpload, {
  classTo: 'img-upload__text',
  errorTextParent: 'img-upload__text',
  errorTextClass: 'img-upload__error-text',
});

// Настройка масштаба изображения

const scaleValue = document.querySelector('.scale__control--value');
const scaleBigger = document.querySelector('.scale__control--bigger');
const scaleSmaller = document.querySelector('.scale__control--smaller');


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


for (const radio of chosenEffectRadios) {
  radio.onclick = function () {
    radio.checked = true;
    imgUploadPreview.className = `effects__preview--${radio.value}`;
  };
}

// Закрытие окна об ошибке при загрузке изображения

const alertUploadFragment = document.createDocumentFragment();
const alertUploadTemplate = document.querySelector('#error').content.querySelector('.error');
const alertMessage = alertUploadTemplate.cloneNode(true);


const onAlertEscapeKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeUploadAlert();
  }
};

const closeUploadAlert = () => {
  bodyElement.removeChild(alertMessage);
  bodyElement.removeChild(alertUploadFragment);
  document.removeEventListener('keydown', onAlertEscapeKeydown);
  document.removeEventListener('click', (closeUploadAlert));
};

// Сообщение, которое показывается если произошла ошибка запроса при отправке формы

const showAlert = () => {
  bodyElement.appendChild(alertMessage);
  bodyElement.appendChild(alertUploadFragment);
};

const closeAlertMessage = () => {
  const errorUploaderButton = document.querySelector('.error__button');
  errorUploaderButton.addEventListener('click', (closeUploadAlert));
  document.addEventListener('keydown', (onAlertEscapeKeydown));
  document.removeEventListener('keydown', onUploaderEscapeKeydown);
  cancelUploading.removeEventListener('click', (closeUploaderFrom));
  document.addEventListener('click', (closeUploadAlert));
};

// Сообщение об успешной отпрвке формы

const successUploadFragment = document.createDocumentFragment();
const successUploadTemplate = document.querySelector('#success').content.querySelector('.success');
const successMessage = successUploadTemplate.cloneNode(true);

const onSuccessEscapeKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeUploadSuccess();
  }
};

const closeUploadSuccess = () => {
  bodyElement.removeChild(successMessage);
  bodyElement.removeChild(successUploadFragment);
  document.removeEventListener('keydown', onSuccessEscapeKeydown);
};

const showSuccess = () => {
  bodyElement.appendChild(successMessage);
  bodyElement.appendChild(successUploadFragment);
  const successUploaderButton = document.querySelector('.success__button');
  successUploaderButton.addEventListener('click', (closeUploadSuccess));
  document.addEventListener('keydown', onSuccessEscapeKeydown);
  document.addEventListener('click', (closeUploadSuccess));
};

// Отправка формы на сервер

const setFormSubmit = (onSuccess) => {
  formUpload.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const isValid = pristine.validate();
    if (isValid) {
      const formData = new FormData(evt.target);

      fetch(
        'https://27.javascript.pages.academy/kekstagram-simple',
        {
          method: 'POST',
          body: formData,
        },
      )
        .then((response) => {
          if (response.ok) {
            onSuccess();
            showSuccess();
            closeUploaderFrom();

          } else {
            showAlert();
            closeAlertMessage();
          }
        })
        .catch(() => {
          showAlert();
          closeAlertMessage();
        });
    }
  });
};

export {setFormSubmit, closeUploaderFrom};
