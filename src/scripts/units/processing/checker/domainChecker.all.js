import {domainChecker} from "./domainChecker.tab";


export async function domainExportChecker() {
  const domains = {
    "PhindSearch": "www.phind.com/search",
    "PhindChat": "www.phind.com/agent",
    "Perplexity": "www.perplexity.ai/search",
    "MaxAIGoogle": "www.google.com/search",
  };

  return domainChecker(domains);
}

export async function domainLoadChecker() {
  const domains = {
    "Phind": "www.phind.com",
    "Perplexity": "www.perplexity.ai",
    "MaxAIGoogle": "www.google.com",
  };

  return domainChecker(domains);
}


export function detectPageLoad(domain) {
  if (domain.name === "MaxAIGoogle") {
    window.addEventListener('load', function () {
      const isMaxAI = document.querySelector('[id^=MAXAI]') !== null;
      chrome.storage.local.set({isMaxAI: isMaxAI});
      return isMaxAI;
    })
  }
  else return true;
}

function hasSubpages(urlString) {
  const regex = /^(https?|ftp|ssh|mailto):\/\/[a-z0-9:%_+.,#?!@&=-]+\/?$/;
  return !regex.test(urlString);
}
