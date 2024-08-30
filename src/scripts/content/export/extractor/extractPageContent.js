import {safeExecute} from "../../../shared/utils/jsShorteners";
import {setFileHeader} from "../../../shared/formatter/formatMarkdown";
import {defineAction} from "./defineAction";

export async function extractPageContent(format, metadata, processMessageContent) {
  if (metadata?.actions?.beforeExtraction)
    await safeExecute(defineAction(metadata.actions.beforeExtraction));

  const messages = document.querySelectorAll(metadata.contentSelector);
  let markdown = await safeExecute(setFileHeader(metadata.pageTitle, metadata.domainName));

  for (const content of messages) {
    const messageText = await processMessageContent(content, format, metadata);
    if (messageText !== "") markdown += messageText + "\n";
  }

  if (metadata?.actions?.afterExtraction)
    await safeExecute(defineAction(metadata.actions.afterExtraction));
  return markdown;
}
