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

export function isHomepageCheck() {
  return window.location.href === "https://www.phind.com" || window.location.href === "https://www.phind.com/"
}

function hasSubpages(urlString) {
  const regex = /^(https?|ftp|ssh|mailto):\/\/[a-z0-9:%_+.,#?!@&=-]+\/?$/;
  return !regex.test(urlString);
}
