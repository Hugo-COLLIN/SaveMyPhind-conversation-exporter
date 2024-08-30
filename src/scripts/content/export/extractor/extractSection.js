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
      return extractSearchSections(content, format, metadata, options);
    default:
      return "";
  }
}

async function extractSearchSections(content, format, metadata, options) {
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
