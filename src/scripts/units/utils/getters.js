/*
--- GETTERS ---
*/

/**
 * Get the url of the page
 * @returns {string} url
 */
export function getUrl() {
  return window.location.href;
}

export function getHostAndPath() {
  return window.location.host + window.location.pathname;
}