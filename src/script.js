/*
--- MAIN ---
 */


import {welcome} from "./activeTab/welcome/welcome";
import {catchAllThreads} from "./activeTab/extractor/extractor";
import {exporter} from "./activeTab/exporter/exporter";

main();

/**
 * Main function
 */
async function main() {
  if (document.URL.includes("phind.com")) {
    await welcome();
    const caught = await catchAllThreads();
    if (caught !== null) {
      await exporter(caught.markdownContent, caught.title);
      console.log("Export done!")
    }
  }
}
