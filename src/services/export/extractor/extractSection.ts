import {capitalizeFirst, formatLineBreaks} from "../../format/formatText";
import {safeExecute} from "../../../utils/jsShorteners";
import {extractSources} from "./extractSources";

/**
 * Extracts the content of a message and formats it into markdown.
 * @param content {HTMLElement}
 * @param format {(text: string) => string}
 * @param metadata {Object<JSON>}
 * @param options {Object} - Custom options to handle specific logic for PhindSearch and Perplexity
 * @returns {Promise<string>}
 */
export async function extractSection(content: { hasChildNodes: () => any; }, format: any, metadata: { extractor: { extractionType: any; }; }, options: object = {}): Promise<string> {
  if (!content.hasChildNodes()) return "";

  switch (metadata?.extractor?.extractionType) {
    case 'search-sections':
      // @ts-ignore TODO
      return extractSearchSection(content, format, metadata, options);
    case 'articles-sections':
      // @ts-ignore TODO
      return extractArticleSection(content, format, metadata, options);
    case 'messages-sections':
      // @ts-ignore TODO
      return extractMessageSection(content, format, metadata, options);
    default:
      return "";
  }
}

async function extractSearchSection(content: HTMLElement, format: (arg0: any) => string, metadata: { extractor: any; sourcesExtraction?: any; }) {
  const options = metadata.extractor;

  // Extract and format the user question
  const userQuestionSelector = options.userQuestionSelector ?? 'span, textarea';
  const userQuestionElement = content.querySelector(userQuestionSelector) ?? "";
  const userQuestionText = userQuestionElement.innerHTML || userQuestionElement.innerText || "";
  const userPart = `\n## User\n` + format(formatLineBreaks(userQuestionText)).replace("  \n", "") + '\n';

  // Determine the AI name and section title if applicable
  let aiName;
  if (options.aiModelSelector) {
    const aiModelElement = content.querySelector(options.aiModelSelector);
    if (aiModelElement) {
      aiName = format(aiModelElement.innerHTML).split("|")[1].split("Model")[0].trim();
    } else {
      const answerer = content.querySelector(".mb-lg .flex.items-center > p");
      if (answerer && answerer.innerHTML.toLowerCase().includes('pro')) // Perplexity Pro Search
        aiName = "Pro";
    }
  }
  const aiIndicator = "## " + capitalizeFirst((aiName ?? "AI") + " " + (options.aiIndicatorLabel || "answer")) + "\n";

  // Extract and format the AI answer, handle parent node selection if needed
  let aiAnswerElement = content.querySelector(options.aiAnswerSelector);
  if (options.selectParentOfAiAnswer && aiAnswerElement) {
    aiAnswerElement = aiAnswerElement.parentNode;
  }
  const aiAnswerText = aiAnswerElement ? format(aiAnswerElement.innerHTML) : "";
  const aiPart = `\n${aiIndicator}${aiAnswerText.replace(/^\s+|\s+$/g, '')}`; // trim newlines at the beginning and end

  // Optional pagination or additional content (like sources)
  let additionalPart = "";
  if (options.paginationSelector) {
    const selectPagination = content.querySelectorAll(options.paginationSelector);
    if (selectPagination.length > 0) {
      additionalPart = "\n" + await safeExecute(extractSources(content, format, metadata.sourcesExtraction));
    }
  } else {
    const src: string = await safeExecute(extractSources(content, format, metadata.sourcesExtraction)) as unknown as string;
    if (src) additionalPart = src + "\n";
  }

  return userPart + aiPart + additionalPart;
}

async function extractArticleSection(content: HTMLElement, format: (arg0: string) => string, metadata: { extractor?: { extractionType: any; }; sourcesExtraction?: any; }) {
  if (!content.hasChildNodes())
    return '';

  let markdown = '';

  const title = content.querySelector('h2 > span');
  markdown += title
    // @ts-ignore
    ? `## ${title?.innerText}\n`
    : '';

  const image = content.querySelector('.flex-col > div > .group\\/section > :first-child img');
  const answer = content.querySelector('.flex-col > div .font-sans .break-words, [class="group/section"] .prose'); // first one selects the intro, second one the other article parts

  const htmlOutput = (image ? image.outerHTML + "<br><br>" : "") + answer?.innerHTML
  markdown += answer?.innerHTML && answer?.innerHTML !== ''
    ? format(htmlOutput) + '\n'
    : '';

  const src = await safeExecute(await extractSources(content, format, metadata.sourcesExtraction));
  // @ts-ignore
  if (src && src !== '')
    markdown += src + "\n";

  return markdown;
}

async function extractMessageSection(content: HTMLElement, format: (arg0: string) => string, metadata: { extractor?: { extractionType: any; }; sourcesExtraction?: any; }) {
  const allDivs = content.querySelectorAll('.col > div > div > div, textarea');
  // @ts-ignore
  const msgContent = Array.from(allDivs).filter(elt => (elt.children.length > 0 && elt.children.item(0).tagName !== "A") || elt.tagName === "TEXTAREA");
  const searchResults = content.querySelectorAll('.col > div > div > div:nth-last-of-type(1) > div > a');
  const entityName = content.querySelectorAll('.col > div > div > span');

  if (msgContent.length === 0) return "";

  let res = "";

  // Extract writer name
  if (entityName.length > 0) {
    res += "## ";
    let putSeparator = true;
    entityName.forEach((elt) => {
      res += format(elt.innerHTML);
      if (entityName.length > 1 && entityName[1].innerHTML !== "" && putSeparator) {
        res += " - ";
        putSeparator = false;
      }
    });
    res += "\n";
  }

  // Extract message
  if (searchResults.length > 0) // If there are search results
  {
    // Message
    res += format(msgContent[0].innerHTML) + "\n";

    // Export search results
    res += await safeExecute(extractSources(content, format, metadata.sourcesExtraction));

  } else { // If there are no search results, export each component of the message
    msgContent.forEach((elt) => {
      const filteredElt = [...elt.children].filter((child) => !child.querySelector("button[style=\"display: none;\"]"));
      res += format(filteredElt.map((child) => child.innerHTML).join("\n")) + "\n";
    });
  }

  return res;
}
