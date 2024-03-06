import { showAlertMiniatures } from './util.js';
import { BASE_URL } from './api-URLs.js';

/**
 * @const {number} SIMILAR_PHOTO_OBJECTS_COUNT - The number of photo objects to display.
 */
const SIMILAR_PHOTO_OBJECTS_COUNT = 25;

/**
 * Container element for photos.
 * @type {Element}
 */
const otherPhotosContainer = document.querySelector('.pictures');
const otherPhotosTitle = document.querySelector('.pictures__title');
otherPhotosTitle.classList.remove('visually-hidden');

/**
 * Template element for individual photo items.
 * @type {Element}
 */
const otherPhotosTemplate = document
  .querySelector('#picture')
  .content.querySelector('.picture');

/**
 * Renders a list of similar photo objects to the DOM.
 * @param {Object[]} similarPhotoObjects - An array of photo objects to be rendered.
 */
const renderSimilarList = (similarPhotoObjects) => {
  const similarPhotoObjectsFragment = document.createDocumentFragment();

  similarPhotoObjects.forEach(({ comments, likes, url }) => {
    const photoElement = otherPhotosTemplate.cloneNode(true);
    photoElement.querySelector('.picture__comments').textContent = comments;
    photoElement.querySelector('.picture__likes').textContent = likes;
    photoElement.querySelector('.picture__img').src = url;
    otherPhotosContainer.appendChild(photoElement);
  });

  otherPhotosContainer.appendChild(similarPhotoObjectsFragment);
};

/**
 * // Fetchies pictures from the server and renders them on the webpage.
 */
fetch(`${BASE_URL}/data`)
  .then((response) => response.json())
  .then((photos) => {
    renderSimilarList(photos.slice(0, SIMILAR_PHOTO_OBJECTS_COUNT));
  })
  .catch(() => {
    showAlertMiniatures(
      'Не удалось загрузить изображения. Попробуйте перезагрузить страницу'
    );
  });
