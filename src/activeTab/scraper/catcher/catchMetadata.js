/**
 * Get the title of the page
 * @returns {string} title
 */
export function getPhindPageTitle() { //extractMetadata
  const textarea = document.querySelector('textarea');
  return textarea !== null && textarea.innerHTML !== "" ? textarea.innerHTML : document.querySelector(".card-body p").innerHTML ?? "";
}