export default {
  extractPhindSearchMetadata,
  extractPhindAgentMetadata,
  extractArbitraryPageMetadata,
}

/**
 * Get the title of the page
 * @returns {string} title
 */
export function getPhindPageTitle() { //extractMetadata
  const textarea = document.querySelector('textarea');
  return textarea !== null && textarea.innerHTML !== "" ? textarea.innerHTML : document.querySelector(".card-body p").innerHTML ?? "";
}

function extractPhindSearchMetadata() {
  return {
    title: getPhindPageTitle(),
    source: "Phind Search",
  }
}

function extractPhindAgentMetadata() {
  return {
    title: getPhindPageTitle(),
    source: "Phind Agent",
  }
}

function extractArbitraryPageMetadata() {
  return {
    title: document.title ?? "",
    source: window.location.hostname,
  }
}