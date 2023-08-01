import {download, saveToClipboard} from "./exportMethods";

export async function exporter(markdownContent, title, siteName) {
  download(markdownContent, title, siteName);
  // await saveToClipboard(markdownContent);
  // linksToObsidian(markdownContent);
}