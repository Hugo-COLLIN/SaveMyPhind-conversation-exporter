/*
--- MAIN ---
 */


import {welcome} from "./activeTab/welcome/welcome";
import {catchContent} from "./activeTab/extractor/extractor";
import {exporter} from "./activeTab/exporter/exporter";

main();

/**
 * Main function
 */
async function main() {
  if (document.URL.includes("phind.com")) {
    await welcome();
    const caught = await catchContent();
    if (caught !== null) {
      await exporter(caught.markdownContent, caught.title);
      console.log("Export done!")
    }
  }
}
