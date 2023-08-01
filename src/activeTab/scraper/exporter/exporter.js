import {download, saveToClipboard} from "./exportMethods";

export async function exporter(markdownContent, fileName) {
  download(markdownContent, fileName);
  // await saveToClipboard(markdownContent);
  // linksToObsidian(markdownContent);
}