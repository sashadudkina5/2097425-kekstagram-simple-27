import {getRandomNumber} from './util.js';

const SIMILAR_PHOTO_OBJECTS_COUNT = 25;

const createPhotoObject = () => ({
  id: getRandomNumber(1, 25),
  url: `photos/${getRandomNumber(1, 25)}.jpg`,
  description: 'Описание фотографии',
  likes: getRandomNumber(15, 200),
  comments: getRandomNumber(0, 200)
});

const createSimilarPhotoObjects = () => Array.from({length: SIMILAR_PHOTO_OBJECTS_COUNT}, createPhotoObject);

export {createSimilarPhotoObjects};
