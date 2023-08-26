import {getHostAndPath} from "../../utils/webpage/getters";

export async function domainChecker() {
  const domains = {
    "PhindSearch": "www.phind.com/search",
    "PhindAgent": "www.phind.com/agent"
  };
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