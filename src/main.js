/*
--- MAIN ---
 */


import {welcome} from "./modules/welcome/welcome";
import {catchContent} from "./modules/extractor/extractor";
import {exporter} from "./modules/exporter/exporter";

main().then(r => console.log("Export done!"));

/**
 * Main function
 */
async function main() {
  await welcome();
  const caught = await catchContent();
  await exporter(caught.markdownContent, caught.title);
}
