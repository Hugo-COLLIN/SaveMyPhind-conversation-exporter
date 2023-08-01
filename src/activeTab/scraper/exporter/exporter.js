import {download, saveToClipboard} from "./exportMethods";

export async function exporter(markdownContent, fileName) {
  download(markdownContent, fileName);

}

export async function exportContent(domain, extracted) {
  const {markdownContent, fileName} = extracted;
  await download(markdownContent, fileName);
  // await saveToClipboard(markdownContent);
  // linksToObsidian(markdownContent);
}