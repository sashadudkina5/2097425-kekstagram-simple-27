import {getRandomNumber} from './util.js';

const SIMILAR_PHOTO_OBJECTS_COUNT = 25;

// функция, генерирующая объект случайного фото

const createPhotoObject = () => ({
  id: getRandomNumber(1, 25),
  url: `photos/${getRandomNumber(1, 25)}.jpg`,
  description: 'Описание фотографии',
  likes: getRandomNumber(15, 200),
  comments: getRandomNumber(0, 200)
});

// функция, генерирующая 25 массивов случайных фото-объектов

const createSimilarPhotoObjects = () => Array.from({length: SIMILAR_PHOTO_OBJECTS_COUNT}, createPhotoObject);
