

//Функция для проверки максимальной длины строки
//Результат: true, если строка проходит по длине, и false — если не проходит


/* function getCommentSize (commentLine, maxCommentSize, minCommentSize) {
  if (commentLine > minCommentSize && commentLine < maxCommentSize) {
    return true;
  }
  return false;
}

getCommentSize (50, 140, 20);

// Стрелочная функция

const getCommentSize = (commentLine, maxCommentSize, minCommentSize) => {
  if (commentLine > minCommentSize && commentLine < maxCommentSize) {
    return true;
  }
  return false;
}

getCommentSize (50, 140, 20);

//Функция для проверки максимальной длины строки

function checkStringLength (string, length) {
  return string.length <= length;
} */

const SIMILAR_PHOTO_OBJECTS_COUNT = 25;

const getNumber = (a, b) => {
  if (a < 0 || b < 0) {
    return NaN;
  }
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const createPhotoObject = () => {
  return {
    id: getNumber(1, 25),
    url: `photos/${getNumber(1, 25)}.jpg`,
    description: 'Описание фотографии',
    likes: getNumber(15, 200),
    comments: getNumber(0, 200)
  };
};

const similarPhotoObjects = Array.from({length: SIMILAR_PHOTO_OBJECTS_COUNT}, createPhotoObject);

console.log(similarPhotoObjects);
