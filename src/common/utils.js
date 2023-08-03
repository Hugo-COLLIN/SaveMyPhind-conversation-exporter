/*
--- OTHERS ---
 */

/**
 * @description - Wait the corresponding time
 * @param ms time to wait in milliseconds
 * @returns {Promise<unknown>}
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * @description - Call the function of the object -
 * if the function is not found, return an error
 * Supports async functions
 * @param object object where the function is
 * @param funcToCall function to call
 * @param args
 */
export function dynamicCall(object, funcToCall, ...args) {
  return typeof object[funcToCall] === 'function' ?
    object[funcToCall](...args)
    : () => {
    console.error(`Function ${funcToCall} not found`);
    return null;
  };
}

function sanitize(filename) {
  return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

function hasSubpages(urlString) {
  const regex = /^(https?|ftp|ssh|mailto):\/\/[a-z0-9:%_+.,#?!@&=-]+\/?$/;
  return !regex.test(urlString);
}

function addStyle() {
  let styleTag = document.createElement('style');
  document.querySelector("body").appendChild(styleTag);
  let stylesheet = styleTag.sheet;

  stylesheet.insertRule(".smallScreens { display: none!important; }", 0);
  stylesheet.insertRule("@media screen and (max-width: 1025px) { .smallScreens { display: inline-block!important; } }", 1);
}

