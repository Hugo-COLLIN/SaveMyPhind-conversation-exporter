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

/**
 * @description - Get data from the chrome storage
 * @param key key of the data to get
 * @param storageType storage type (sync, local or session)
 * @returns {Promise<unknown>} - Promise of the data
 */
export async function getStorageData(key, storageType = 'sync') {
  return new Promise((resolve, reject) => {
    chrome.storage[storageType].get([key], function (result) {
      if (result[key] === undefined) {
        reject('No data found');
      } else {
        resolve(result[key]);
      }
    });
  });
}

/**
 * @description - Set data in the chrome storage
 * @param key key of the data to set
 * @param value value of the data to set
 * @param storageType storage type (sync, local or session)
 */
export function setStorageData(key, value, storageType) {
  chrome.storage[storageType].set({[key]: value}, function () {
    console.log(`${key} set`);
  });
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

// /**
//  * @description - init appInfos
//  * @type {null|Object} Contains the infos of the application
//  */
// export let appInfos = null;
//
// (async function() {
//   appInfos = await fetchInfos();
// })();
//
// /**
//  * Get application infos
//  * @returns {Promise<any|undefined>}
//  */
// export function fetchInfos() {
//   return (async () => {
//     try {
//       const response = await fetch(chrome.runtime.getURL('infos.json'));
//       return await response.json().then(json => json);
//     } catch (error) {
//       console.error('An error occurred:', error);
//     }
//   })();
// }

// let appInfos = null;
//
// export async function fetchInfos() {
//   try {
//     const response = await fetch(chrome.runtime.getURL('infos.json'));
//     const json = await response.json();
//     return json;
//   } catch (error) {
//     console.error('An error occurred:', error);
//   }
// }
//
// async function init() {
//   appInfos = await fetchInfos();
// }
//
// init();
//
// export { appInfos };

let appInfos = null;

export async function fetchInfos() {
  try {
    const response = await fetch(chrome.runtime.getURL('infos.json'));
    const json = await response.json();
    return json;
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

(async function() {
  appInfos = await fetchInfos();
})();

function getAppInfos() {
  return new Promise((resolve, reject) => {
    function check() {
      if (appInfos !== null) {
        resolve(appInfos);
      } else {
        setTimeout(check, 1); // check again in a moment
      }
    }
    check();
  });
}

export { getAppInfos };
