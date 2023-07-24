import {catchContent} from "./extractor/extractor";
import {exporter} from "./exporter/exporter";
import {logWelcome} from "./console/consoleMessages";

export async function launchExport() {
  if (document.URL.includes("phind.com")) {
    logWelcome();
    const caught = await catchContent();
    if (caught !== null) {
      await exporter(caught.markdownContent, caught.title);
      console.log("Export done!")
    }
  }
}