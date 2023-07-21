/*
--- GETTERS ---
*/
/**
 * Get application infos
 * @returns {Promise<any|undefined>}
 */
export function fetchInfos() {
  return (async () => {
    try {
      const response = await fetch(chrome.runtime.getURL('infos.json'));
      return await response.json().then(json => json);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  })();
}

/**
 * Get the title of the page
 * @returns {string} title
 */
export function getPhindPageTitle() {
  const textarea = document.querySelector('textarea').innerHTML;
  return textarea !== "" ? textarea : document.querySelector(".card-body p").innerHTML;
}

/**
 * Get the url of the page
 * @returns {string} url
 */
export function getUrl() {
  return window.location.href;
}