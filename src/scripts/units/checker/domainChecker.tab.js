import {getHostAndPath} from "../utils/getters.tab";

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

export function isHomepageCheck() {
  return window.location.href === "https://www.phind.com" || window.location.href === "https://www.phind.com/"
}
