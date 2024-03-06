/**
 * Checks if the pressed key is the Escape key.
 * @param {KeyboardEvent} evt - The keyboard event that triggered the function.
 * @returns {boolean} True if the pressed key is 'Escape', otherwise undefined.
 */
const isEscapeKey = function (evt) {
  if (evt.key === 'Escape') {
    return true;
  }
};

/**
 * Displays a modal alert with a custom message at the bottom of the page.
 * @param {string} message - The message to display in the alert modal.
 */
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


/**
 * Definitions for various filter effects that can be applied to images.
 * Each effect has a name, CSS filter function, and range of values with step increments.
 * @type {Array.<{name: string, filter: string, min: number, max: number, step: number, unit: string}>}
 */
const EFFECTS = [
  {
    name: 'none',
    filter: 'none',
    min: 0,
    max: 100,
    step: 1,
    unit: ''
  },
  {
    name: 'chrome',
    filter: 'grayscale',
    min: 0,
    max: 1,
    step: 0.1,
    unit: ''
  },
  {
    name: 'sepia',
    filter: 'sepia',
    min: 0,
    max: 1,
    step: 0.1,
    unit: ''
  },
  {
    name: 'marvin',
    filter: 'invert',
    min: 0,
    max: 100,
    step: 1,
    unit: '%'
  },
  {
    name: 'phobos',
    filter: 'blur',
    min: 0,
    max: 3,
    step: 0.1,
    unit: 'px'
  },
  {
    name: 'heat',
    filter: 'brightness',
    min: 1,
    max: 3,
    step: 0.1,
    unit: ''
  },
];

export {isEscapeKey, showAlertMiniatures, EFFECTS};
