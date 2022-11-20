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

// вспомогательная функция для закрытия окна по клавише Esc

const isEscapeKey = function (evt) {
  if (evt.key === 'Escape') {
    return true;
  }
};

// Если при загрузке данных с сервера произошла ошибка запроса

const showAlertMiniatures = (message) => {
  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = '100';
  alertContainer.style.position = 'absolute';
  alertContainer.style.left = '0';
  alertContainer.style.bottom = '0';
  alertContainer.style.right = '0';
  alertContainer.style.padding = '10px 3px';
  alertContainer.style.fontSize = '20px';
  alertContainer.style.textAlign = 'center';
  alertContainer.style.backgroundColor = 'red';

  alertContainer.textContent = message;

  document.body.append(alertContainer);
};

export {getRandomNumber, isEscapeKey, showAlertMiniatures};
