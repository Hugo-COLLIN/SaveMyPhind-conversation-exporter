import {capitalizeFirst, formatLineBreaks} from "../../../shared/formatter/formatText";
import {safeExecute} from "../../../shared/utils/jsShorteners";
import {extractSources} from "./extractSources";

/**
 * Extracts the content of a message and formats it into markdown.
 * @param content {HTMLElement}
 * @param format {(text: string) => string}
 * @param metadata {Object<JSON>}
 * @param options {Object} - Custom options to handle specific logic for PhindSearch and Perplexity
 * @returns {Promise<string>}
 */
export async function extractSection(content, format, metadata, options = {}) {
  if (!content.hasChildNodes()) return "";

  switch (options.extractionType) {
    case 'search-sections':
      return extractSearchSection(content, format, metadata, options);
    case 'articles-sections':
      return extractArticleSection(content, format, metadata, options);
    case 'messages-sections':
      return extractMessageSection(content, format, metadata, options);
    default:
      return "";
  }
}

async function extractSearchSection(content, format, metadata, options) {
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
  const index = aiAnswerText.indexOf('\n\n');
  const aiPart = `\n${aiIndicator}${index !== -1 ? aiAnswerText.substring(index + 2) : aiAnswerText}`;

  // Optional pagination or additional content (like sources)
  let additionalPart = "";
  if (options.paginationSelector) {
    const selectPagination = content.querySelectorAll(options.paginationSelector);
    if (selectPagination.length > 0) {
      additionalPart = "\n" + await safeExecute(extractSources(content, format, metadata.sourcesExtraction));
    }
  } else {
    const src = await safeExecute(extractSources(content, format, metadata.sourcesExtraction));
    if (src) additionalPart = src + "\n";
  }

  return userPart + aiPart + additionalPart;
}

async function extractArticleSection(content, format, metadata) {
  if (!content.hasChildNodes())
    return '';

  let markdown = '';

  const title = content.querySelector('h2 > span');
  markdown += title
    ? `## ${title?.innerText}\n`
    : '';

  const image = content.querySelector('.flex-col > div > .group\\/section > :first-child img');
  const answer = content.querySelector('.flex-col > div .font-sans .break-words, [class="group/section"] .prose'); // first one selects the intro, second one the other article parts

  const htmlOutput = (image ? image.outerHTML + "<br><br>" : "") + answer?.innerHTML
  markdown += answer?.innerHTML && answer?.innerHTML !== ''
    ? format(htmlOutput) + '\n'
    : '';

  const src = await safeExecute(await extractSources(content, format, metadata.sourcesExtraction));
  if (src && src !== '')
    markdown += src + "\n";

  return markdown;
}

async function extractMessageSection(content, format, metadata) {
  const allDivs = content.querySelectorAll('.col > div > div > div, textarea');
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
