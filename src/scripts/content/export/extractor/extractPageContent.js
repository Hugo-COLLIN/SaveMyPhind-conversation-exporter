import {safeExecute} from "../../../../utils/jsShorteners";
import {setFileHeader} from "../../../../services/format/formatMarkdown";
import {defineAction} from "./defineAction";
import {extractSection} from "./extractSection";

export async function extractPageContent(format, metadata, processMessageContent) {
  if (metadata?.actions?.beforeExtraction)
    await safeExecute(defineAction(metadata.actions.beforeExtraction));

  const messages = document.querySelectorAll(metadata.contentSelector);
  let markdown = await safeExecute(setFileHeader(metadata.pageTitle, metadata.domainName));

  const processMessage = metadata?.extractor
    ? extractSection
    : processMessageContent;

  markdown += await extractSections(messages, metadata, format, processMessage);

  if (metadata?.actions?.afterExtraction)
    await safeExecute(defineAction(metadata.actions.afterExtraction));

  return markdown;
}

async function extractSections(messages, metadata, format, processMessageContent) {
  let markdown = "";
  for (const content of messages) {
    const messageText = await processMessageContent(content, format, metadata);
    if (messageText !== "") markdown += messageText + "\n";
  }
  return markdown;
}
