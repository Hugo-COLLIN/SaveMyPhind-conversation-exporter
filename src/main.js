/**
 * SaveMyPhind v0.21.1
 * Hugo COLLIN - 2023-06-26
 */

// import
/*
--- MAIN ---
 */
import {exportPhindPair, exportPhindSearch} from "./modules/converters";
import {download, formatFilename, saveToClipboard} from "./modules/utils";

main();

/**
 * Main function
 */
function main() {
  const url = window.location.href;
  if (url.includes('www.phind.com')) {
    (async () => {
      let markdownContent;
      if (url.includes('www.phind.com/search'))
        markdownContent = await exportPhindSearch()
      else if (url.includes('www.phind.com/agent'))
        markdownContent = exportPhindPair();
      else
        return

      download(markdownContent, formatFilename() + '.md');
      await saveToClipboard(markdownContent);
    })();
  }
}