/**
 * @description - init appInfos
 * @type {null|Object} Contains the infos of the application
 */
let appInfos = null;
fetchInfos().then(res => appInfos = res); // Fetch application infos

/**
 * Get application infos
 * @returns {Promise<any|undefined>}
 */
export async function fetchInfos() {
  try {
    const response = await fetch(chrome.runtime.getURL('infos.json'));
    return await response.json();
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

/**
 * @description - Ensure getting application infos (~2ms)
 * @returns {Promise<unknown>}
 */
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

export {getAppInfos};