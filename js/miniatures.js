import {showAlertMiniatures} from './util.js';
import {BASE_URL} from './api-URLs.js';

const SIMILAR_PHOTO_OBJECTS_COUNT = 25;

const otherPhotosContainer = document.querySelector('.pictures');
const otherPhotosTitle = document.querySelector('.pictures__title');
otherPhotosTitle.classList.remove('visually-hidden');

const otherPhotosTemplate = document.querySelector('#picture').content.querySelector('.picture');

const renderSimilarList = (similarPhotoObjects) => {

  const similarPhotoObjectsFragment = document.createDocumentFragment();

  similarPhotoObjects.forEach(({comments, likes, url}) => {
    const photoElement = otherPhotosTemplate.cloneNode(true);
    photoElement.querySelector('.picture__comments').textContent = comments;
    photoElement.querySelector('.picture__likes').textContent = likes;
    photoElement.querySelector('.picture__img').src = url;
    otherPhotosContainer.appendChild(photoElement);
  });

  otherPhotosContainer.appendChild(similarPhotoObjectsFragment);
};

// pictures fetched from the server

fetch(`${BASE_URL}/data`)
  .then((response) => response.json())
  .then((photos) => {
    renderSimilarList(photos.slice(0, SIMILAR_PHOTO_OBJECTS_COUNT));
  })
  .catch(() => {
    showAlertMiniatures('Не удалось загрузить изображения. Попробуйте перезагрузить страницу');
  });
