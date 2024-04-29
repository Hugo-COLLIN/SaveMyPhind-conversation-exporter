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
export function setStorageData(key, value, storageType = 'sync') {
  chrome.storage[storageType].set({[key]: value}, function () {
    console.log(`${key} set`);
  });
}

export async function getTabData(tabId) {
  return await new Promise((resolve, reject) => {
    chrome.tabs.get(tabId, (tab) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError));
      } else {
        resolve(tab);
      }
    });
  });
}
