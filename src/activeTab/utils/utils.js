/*
--- OTHERS ---
 */

export  function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function sanitize(filename) {
  return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

function hasSubpages(urlString) {
  const regex = /^(https?|ftp|ssh|mailto):\/\/[a-z0-9:%_+.,#?!@&=-]+\/?$/;
  return !regex.test(urlString);
}