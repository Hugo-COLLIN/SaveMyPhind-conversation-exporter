/**
 * @description - Get data from the chrome storage
 * @param key key of the data to get
 * @param storageType storage type (sync, local or session)
 * @returns {Promise<unknown>} - Promise of the data
 */
export async function getStorageData(key: string, storageType = 'sync'): Promise<unknown> {
  return new Promise((resolve, reject) => {
    // @ts-ignore TODO
    chrome.storage[storageType].get([key], function (result: { [x: string]: unknown; }) {
      if (result[key] === undefined) {
        reject('No data found for key: ' + key);
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
export function setStorageData(key: any, value: any, storageType = 'sync') {
  // @ts-ignore TODO
  chrome.storage[storageType].set({[key]: value}, function () {
    console.log(`${key} set`);
  });
}

export async function getTabData(tabId: number | undefined) {
  return await new Promise((resolve, reject) => {
    if (!tabId)
      reject("No tabId" + tabId + " found")
    else
      chrome.tabs.get(tabId, (tab) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else {
          resolve(tab);
        }
      });
  });
}
