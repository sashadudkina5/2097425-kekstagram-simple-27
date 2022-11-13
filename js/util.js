// Функция, возвращающая случайное число из диапазона

const getRandomNumber = (a, b) => {
  if (a < 0 || b < 0) {
    return NaN;
  }
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const isEscapeKey = function (evt) {
  if (evt.key === 'Escape') {
    return true;
  }
};

export {getRandomNumber, isEscapeKey};
