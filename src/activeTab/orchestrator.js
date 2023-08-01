import {catchContent} from "./extractor/extractor";
import {exporter} from "./exporter/exporter";
import {logWelcome} from "./useStoredData/consoleMessages";

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