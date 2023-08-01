import {extract} from "./extractor/extractor";
import {exportContent} from "./exporter/exporter";
import {logWelcome} from "../storedData/consoleMessages";
import {getHostAndPath} from "../webpage/getters";
import {setFormatRules} from "./formatRules/ruler";

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