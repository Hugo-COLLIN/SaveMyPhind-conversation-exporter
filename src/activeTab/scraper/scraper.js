import {extract} from "./extractor/extractor";
import {exportContent} from "./exporter/exporter";
import {logWelcome} from "../storedData/consoleMessages";
import {getHostAndPath} from "../webpage/getters";
import {setFormatRules} from "./formatter/ruler";

function authorisedDomain() {
  const url = window.location.href,
        authorisedDomains = ["phind.com"];

  for (let authorisedDomain of authorisedDomains) {
    if (url.includes(authorisedDomain)) {
      return true;
    }
  }
  return false;
}

// export async function launchExport() {
//   if (authorisedDomain()) {
//     logWelcome();
//     const caught = await catchContent();
//     if (caught !== null) {
//       await exporter(caught.markdownContent, caught.fileName);
//       console.log("Export done!")
//     }
//   }
// }

// export async function launchExport() {
//   const domains = ["www.phind.com/search", "www.phind.com/agent"];
//   const hostAndPath = getHostAndPath();
//   for (let domain of domains) {
//     if (hostAndPath.startsWith(domain)) {
//       logWelcome();
//       setFormatRules(domain);
//       const extracted = await extract(domain);
//       if (extracted !== null)
//       {
//         await exportContent(extracted);
//         console.log("Export done!")
//       }
//       break;
//     }
//   }
// }

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

export async function launchExport() {
  const domain = await domainChecker();
  if (domain === null) return;

  logWelcome();
  setFormatRules(domain.name);
  const extracted = await extract(domain);

  if (extracted === null) return;

  await exportContent(domain, extracted);
  console.log("Export done!")
}