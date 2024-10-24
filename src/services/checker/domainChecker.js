/**
 * Check if the host and path is allowed
 * @param allowedDomains the allowed domains
 * @param hostAndPath url of the page
 * @returns {null|{name: string, url: *}}
 */
export function domainChecker(allowedDomains, hostAndPath) {
  for (let domainName in allowedDomains) {
    const url = allowedDomains[domainName];
    if (hostAndPath?.startsWith(url)) {
      return {name: domainName, url};
    }
  }

  return null;
}
