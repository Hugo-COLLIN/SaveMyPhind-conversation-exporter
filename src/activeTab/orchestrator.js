import {catchContent} from "./scraper/extractor/extractor";
import {exporter} from "./scraper/exporter/exporter";
import {logWelcome} from "./storedData/consoleMessages";

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

export async function launchExport() {
  if (authorisedDomain()) {
    logWelcome();
    const caught = await catchContent();
    if (caught !== null) {
      await exporter(caught.markdownContent, caught.title, caught.siteName);
      console.log("Export done!")
    }
  }
}