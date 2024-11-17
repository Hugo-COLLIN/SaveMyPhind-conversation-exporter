import {safeExecute} from "../../../utils/jsShorteners";
import {setFileHeader} from "../../format/formatMarkdown";
import {defineAction} from "./defineAction";
import {extractSection} from "./extractSection";

export async function extractPageContent(format: (html: string) => string, metadata: {
  actions: {
    beforeExtraction: { type: any; selector: string | undefined; };
    afterExtraction: { type: any; selector: string | undefined; };
  };
  contentSelector: any;
  pageTitle: string;
  domainName: any;
  extractor: any;
}, processMessageContent: any) {
  if (metadata?.actions?.beforeExtraction)
    await safeExecute(defineAction(metadata.actions.beforeExtraction));

  const messages = document.querySelectorAll(metadata.contentSelector);
  let markdown: string = await safeExecute(setFileHeader(metadata.pageTitle, metadata.domainName)) as unknown as string;

  const processMessage = metadata?.extractor
    ? extractSection
    : processMessageContent;

  markdown += await extractSections(messages, metadata, format, processMessage);

  if (metadata?.actions?.afterExtraction)
    await safeExecute(defineAction(metadata.actions.afterExtraction));

  return markdown;
}

async function extractSections(messages: NodeListOf<any>, metadata: {
  actions: {
    beforeExtraction: { type: any; selector: string | undefined; };
    afterExtraction: { type: any; selector: string | undefined; };
  }; contentSelector: any; pageTitle: string; domainName: any; extractor: any;
}, format: (html: string) => string, processMessageContent: (arg0: any, arg1: any, arg2: any) => any) {
  let markdown = "";
  for (const content of messages) {
    const messageText = await processMessageContent(content, format, metadata);
    if (messageText !== "") markdown += messageText + "\n";
  }
  return markdown;
}
