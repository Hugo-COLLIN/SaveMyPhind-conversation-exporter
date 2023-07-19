/*
--- MAIN ---
 */


import {welcome} from "./modules/welcome/welcome";
import {catchContent} from "./modules/extractor/extractor";
import {exporter} from "./modules/exporter/exporter";

main();

/**
 * Main function
 */
async function main() {
  if (document.URL.includes("phind.com")) {
    await welcome();
    const caught = await catchContent();
    await exporter(caught.markdownContent, caught.title);
    console.log("Export done!")
  }
}
