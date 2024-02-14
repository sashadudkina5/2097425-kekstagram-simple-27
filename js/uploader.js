import {isEscapeKey, EFFECTS} from './util.js';

// Переменные для масштабирования изображения

const SIZE_VALUE_DEFAULT = 100;
const SIZE_MIN = 25;
const SIZE_MAX = 200;
const SIZE_STEP = 25;
let sizeValue = 100;


const uploadedImage = document.querySelector('.uploaded-image');
const imgUploadPreview = document.querySelector('.img-upload__preview');
const modalOverlay = document.querySelector('.modal-overlay');
const uploadPhotoInput = document.querySelector('#upload-file');
const photoEditorForm = document.querySelector('.img-upload__overlay');
const body = document.querySelector('body');
const cancelUploading = document.querySelector('#upload-cancel');
const formUpload = document.getElementById('upload-select-image');

const sliderFieldset = document.querySelector('.img-upload__effect-level');

//consts for zoom change

const scaleValue = document.querySelector('.scale__control--value');
const scaleBigger = document.querySelector('.scale__control--bigger');
const scaleSmaller = document.querySelector('.scale__control--smaller');

//Закрытие и открытие окна загрузки


const onUploaderEscapeKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeUploaderFrom();
  }
};

const closeUploaderFrom = () => {
  photoEditorForm.classList.add('hidden');
  modalOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  uploadPhotoInput.value = '';
  sizeValue = SIZE_VALUE_DEFAULT;
  imgUploadPreview.style.transform = `scale(${1})`;
  imgUploadPreview.className = 'effects__preview--none';
  imgUploadPreview.style.filter = null;
  document.querySelector('.text__description').value = '';
  uploadedImage.src = null;

  document.removeEventListener('keydown', onUploaderEscapeKeydown);

};


uploadPhotoInput.addEventListener('change', () => {
  const file = uploadPhotoInput.files[0];
  if (file) {
    const imageType = /^image\//;

    if (!imageType.test(file.type)) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      uploadedImage.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  scaleValue.value = '100%';
  photoEditorForm.classList.remove('hidden');
  modalOverlay.classList.remove('hidden');
  sliderFieldset.classList.add('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onUploaderEscapeKeydown);
  cancelUploading.addEventListener('click', (closeUploaderFrom));
  modalOverlay.addEventListener('click', (closeUploaderFrom));
});

// Валидация комментария

const pristine = new Pristine(formUpload, {
  classTo: 'img-upload__text',
  errorTextParent: 'img-upload__text',
  errorTextClass: 'img-upload__error-text',
});

// Настройка масштаба изображения


scaleSmaller.addEventListener('click', () => {
  if (sizeValue > SIZE_MIN) {
    sizeValue -= SIZE_STEP;
    scaleValue.value = `${sizeValue}%`;
    imgUploadPreview.style.transform = `scale(${sizeValue / SIZE_VALUE_DEFAULT})`;
  }
});

scaleBigger.addEventListener('click', () => {
  if (sizeValue < SIZE_MAX) {
    sizeValue += SIZE_STEP;
    scaleValue.value = `${sizeValue}%`;
    imgUploadPreview.style.transform = `scale(${sizeValue / SIZE_VALUE_DEFAULT})`;
  }
});

// Наложение эффекта на фото

const chosenEffectRadios = document.querySelectorAll('.effects__radio');
const effectsSlider = document.querySelector('.effect-level__slider');
const effectLevelInput = document.querySelector('.effect-level__value');


for (const radio of chosenEffectRadios) {
  radio.onclick = function () {
    radio.checked = true;
    imgUploadPreview.className = `effects__preview--${radio.value}`;
    const chosenEffect = EFFECTS.find((effect) => effect.name === radio.value);
    sliderFieldset.classList.remove('hidden');

    noUiSlider.create(effectsSlider, {
      range: {
        min: chosenEffect.min,
        max: chosenEffect.max,
      },
      start: chosenEffect.max,
      step: chosenEffect.step,
      connect: 'lower',
    });

    effectsSlider.noUiSlider.on('update', () => {
      effectLevelInput.value = effectsSlider.noUiSlider.get();
      imgUploadPreview.style.filter = `${chosenEffect.filter}(${effectLevelInput.value}${chosenEffect.unit})`;

      if (chosenEffect.name === 'none') {
        imgUploadPreview.style.filter = null;
        sliderFieldset.classList.add('hidden');
      }
    });

    const destroyExistingSlider = () => {
      if(effectsSlider.noUiSlider) {
        effectsSlider.noUiSlider.destroy();
      }
    };
    destroyExistingSlider();
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
  alertMessage.remove();
  document.removeEventListener('keydown', onAlertEscapeKeydown);
  document.removeEventListener('click', (closeUploadAlert));
  document.addEventListener('keydown', onUploaderEscapeKeydown);
  cancelUploading.addEventListener('click', (closeUploaderFrom));
};

// Сообщение, которое показывается если произошла ошибка запроса при отправке формы

const showAlert = () => {
  body.appendChild(alertMessage);
  body.appendChild(alertUploadFragment);
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
  successMessage.remove();
  document.removeEventListener('keydown', onSuccessEscapeKeydown);
};

const showSuccess = () => {
  body.appendChild(successMessage);
  body.appendChild(successUploadFragment);
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
        'https://27.javascript.htmlacademy.pro/kekstagram-simple',
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
