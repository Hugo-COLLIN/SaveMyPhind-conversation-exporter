import {getHostAndPath} from "../../../units/utils/getters.tab";

export async function domainExportChecker() {
  const domains = {
    "PhindSearch": "www.phind.com/search",
    "PhindChat": "www.phind.com/agent",
    "Perplexity": "www.perplexity.ai/search",
    "MaxAIGoogle": "www.google.com/search",
  };

  return domainChecker(domains);
}

export async function domainChecker(domains) {
  const hostAndPath = getHostAndPath();

  for (let domainName in domains) {
    const url = domains[domainName];
    if (hostAndPath.startsWith(url)) {
      return {name: domainName, url};
    }
  }

  return null;
}
