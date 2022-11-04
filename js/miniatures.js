import {createSimilarPhotoObjects} from './data.js';

const otherPhotosContainer = document.querySelector('.pictures');
const otherPhotosTitle = document.querySelector('.pictures__title');
otherPhotosTitle.classList.remove('visually-hidden');

const otherPhotosTemplate = document.querySelector('#picture').content.querySelector('.picture');


const similarPhotoObjects = createSimilarPhotoObjects();

const similarPhotoObjectsFragment = document.createDocumentFragment();

similarPhotoObjects.forEach(({comments, likes, url}) => {
  const photoElement = otherPhotosTemplate.cloneNode(true);
  photoElement.querySelector('.picture__comments').textContent = comments;
  photoElement.querySelector('.picture__likes').textContent = likes;
  photoElement.querySelector('.picture__img').src = url;

  otherPhotosContainer.appendChild(photoElement);
});

otherPhotosContainer.appendChild(similarPhotoObjectsFragment);
