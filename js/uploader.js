import { isEscapeKey, EFFECTS } from './util.js';
import {BASE_URL} from './api-URLs.js';


// Constants for scaling photos. The backend accepts a maximum value of 100% only.
const SIZE_VALUE_DEFAULT = 100;
const SIZE_MIN = 25;
const SIZE_MAX = 100;
const SIZE_STEP = 25;

/**
 * Current size of the picture
 */
let sizeValue = 100;

// DOM element selectors
const uploadedImage = document.querySelector('.uploaded-image');
const imgUploadPreview = document.querySelector('.img-upload__preview');
const modalOverlay = document.querySelector('.modal-overlay');
const uploadPhotoInput = document.querySelector('#upload-file');
const photoEditorForm = document.querySelector('.img-upload__overlay');
const body = document.querySelector('body');
const cancelUploading = document.querySelector('#upload-cancel');
const formUpload = document.getElementById('upload-select-image');
const sliderFieldset = document.querySelector('.img-upload__effect-level');
const scaleValue = document.querySelector('.scale__control--value');
const scaleBigger = document.querySelector('.scale__control--bigger');
const scaleSmaller = document.querySelector('.scale__control--smaller');


/**
 * Closes to uploader modal when ESC key is pressed.
 * @param {KeyboardEvent} evt - The keyboard event triggered by user action.
 */
const onUploaderEscapeKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeUploaderFrom();
  }
};

/**
 * Closes the uploader form and resets the initial application state.
 */
function closeUploaderFrom() {
  photoEditorForm.classList.add('hidden');
  modalOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  uploadPhotoInput.value = '';
  sizeValue = SIZE_VALUE_DEFAULT;
  imgUploadPreview.style.transform = `scale(${1})`;
  imgUploadPreview.classList.remove(
    ...imgUploadPreview.classList.value
      .split(' ')
      .filter((cls) => cls.startsWith('effects__preview--'))
  );
  imgUploadPreview.style.filter = null;
  document.querySelector('.text__description').value = '';
  uploadedImage.src = null;

  document.removeEventListener('keydown', onUploaderEscapeKeydown);
}

/**
 * Initializes photo upload and setups event listeners for user interactions.
 */
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
  cancelUploading.addEventListener('click', closeUploaderFrom);
  modalOverlay.addEventListener('click', closeUploaderFrom);
});


/**
 * Validates comment input in the upload form.
 */
const pristine = new Pristine(formUpload, {
  classTo: 'img-upload__text',
  errorTextParent: 'img-upload__text',
  errorTextClass: 'img-upload__error-text',
});

/**
 * Scales the picture down within defined constraints. The backend accepts a maximum value of 100% only.
 */
scaleSmaller.addEventListener('click', () => {
  if (sizeValue > SIZE_MIN) {
    sizeValue -= SIZE_STEP;
    scaleValue.value = `${sizeValue}%`;
    imgUploadPreview.style.transform = `scale(${
      sizeValue / SIZE_VALUE_DEFAULT
    })`;
  }
});

/**
 * Scales the picture up within defined constraints. The backend accepts a maximum value of 100% only.
 */
scaleBigger.addEventListener('click', () => {
  if (sizeValue < SIZE_MAX) {
    sizeValue += SIZE_STEP;
    scaleValue.value = `${sizeValue}%`;
    imgUploadPreview.style.transform = `scale(${
      sizeValue / SIZE_VALUE_DEFAULT
    })`;
  }
});

// Selectors for implementing filters and changing their intensity
const chosenEffectRadios = document.querySelectorAll('.effects__radio');
const effectsSlider = document.querySelector('.effect-level__slider');
const effectLevelInput = document.querySelector('.effect-level__value');

// NoUiSlider functionlaity
for (const radio of chosenEffectRadios) {
  radio.onclick = function () {
    radio.checked = true;
    imgUploadPreview.classList.remove(
      ...imgUploadPreview.classList.value
        .split(' ')
        .filter((cls) => cls.startsWith('effects__preview--'))
    );
    imgUploadPreview.classList.add(`effects__preview--${radio.value}`);
    const chosenEffect = EFFECTS.find((effect) => effect.name === radio.value);
    sliderFieldset.classList.remove('hidden');

    const destroyExistingSlider = () => {
      if (effectsSlider.noUiSlider) {
        effectsSlider.noUiSlider.destroy();
      }
    };
    destroyExistingSlider();

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
  };
}


const alertUploadFragment = document.createDocumentFragment();
const alertUploadTemplate = document
  .querySelector('#error')
  .content.querySelector('.error');
const alertMessage = alertUploadTemplate.cloneNode(true);

/**
 *  Closes to uploader error alert modal when ESC key is pressed.
 * @param {KeyboardEvent} evt - The keyboard event triggered by user action.
 */
const onAlertEscapeKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeUploadAlert();
  }
};

/**
 * Closes the upload error alert modal.
 */
function closeUploadAlert() {
  alertMessage.remove();
  document.removeEventListener('keydown', onAlertEscapeKeydown);
  document.removeEventListener('click', closeUploadAlert);
  document.addEventListener('keydown', onUploaderEscapeKeydown);
  cancelUploading.addEventListener('click', closeUploaderFrom);
}

/**
 * Displays an alert message for upload errors.
 */
const showAlert = () => {
  body.appendChild(alertMessage);
  body.appendChild(alertUploadFragment);
};

/**
 * Sets up event listeners for closing the alert message modal.
 */
const closeAlertMessage = () => {
  const errorUploaderButton = document.querySelector('.error__button');
  errorUploaderButton.addEventListener('click', closeUploadAlert);
  document.addEventListener('keydown', onAlertEscapeKeydown);
  document.removeEventListener('keydown', onUploaderEscapeKeydown);
  cancelUploading.removeEventListener('click', closeUploaderFrom);
  document.addEventListener('click', closeUploadAlert);
};

const successUploadFragment = document.createDocumentFragment();
const successUploadTemplate = document
  .querySelector('#success')
  .content.querySelector('.success');
const successMessage = successUploadTemplate.cloneNode(true);

/**
 *  Closes to uploader success modal when ESC key is pressed.
 * @param {KeyboardEvent} evt - The keyboard event triggered by user action.
 */
const onSuccessEscapeKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeUploadSuccess();
  }
};

/**
 * Closes the upload success message modal.
 */
function closeUploadSuccess() {
  successMessage.remove();
  document.removeEventListener('keydown', onSuccessEscapeKeydown);
}
/**
 * Displays a success message upon successful upload.
 */
const showSuccess = () => {
  body.appendChild(successMessage);
  body.appendChild(successUploadFragment);
  const successUploaderButton = document.querySelector('.success__button');
  successUploaderButton.addEventListener('click', closeUploadSuccess);
  document.addEventListener('keydown', onSuccessEscapeKeydown);
  document.addEventListener('click', closeUploadSuccess);
};

/**
 * Submits the photo upload form data to the server and handles the response.
 * @param {Function} onSuccess - Callback function to execute on successful form submission.
 */
const setFormSubmit = (onSuccess) => {
  formUpload.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const isValid = pristine.validate();
    if (isValid) {
      const formData = new FormData(evt.target);

      fetch(BASE_URL, {
        method: 'POST',
        body: formData,
      })
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

export { setFormSubmit, closeUploaderFrom };
