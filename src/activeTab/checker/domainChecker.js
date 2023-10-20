import {getHostAndPath} from "../utils/webpage/getters";



export async function domainExportChecker() {
  const domains = {
    "PhindSearch": "www.phind.com/search",
    "PhindAgent": "www.phind.com/agent",
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


async function domainChecker(domains) {
  const hostAndPath = getHostAndPath();

  for (let domainName in domains) {
    const url = domains[domainName];
    if (hostAndPath.startsWith(url)) {
      return {name: domainName, url};
    }
  }

  return null;
}


export function isHomepageCheck()
{
  return window.location.href === "https://www.phind.com" || window.location.href === "https://www.phind.com/"
}