import {getHostAndPath} from "../../utils/getters.tab";

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
