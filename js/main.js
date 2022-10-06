// Функция, возвращающая случайное целое число из переданного диапазона включительно


let randomNumber;
function getNumber (minNumber, maxNumber) {
  if (randomNumber >= minNumber && randomNumber <= maxNumber) {
    randomNumber = Math.random();
  }
  return randomNumber;
}

getNumber (1,10);

//Функция для проверки максимальной длины строки
//Результат: true, если строка проходит по длине, и false — если не проходит


function getCommentSize (commentLine, maxCommentSize, minCommentSize) {
  if (commentLine > minCommentSize && commentLine < maxCommentSize) {
    return true;
  }
  return false;
}

getCommentSize (50, 140, 20);
