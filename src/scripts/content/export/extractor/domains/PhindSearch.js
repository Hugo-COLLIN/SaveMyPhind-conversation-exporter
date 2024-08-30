import {capitalizeFirst, formatLineBreaks} from "../../../../shared/formatter/formatText";
import {safeExecute} from "../../../../shared/utils/jsShorteners";
import {extractSources} from "../extractSources";
import {extractSection} from "../extractSection";

export async function processMessage(content, format, metadata) {
  return extractSection(content, format, metadata, {
    userQuestionSelector: 'span, textarea',
    aiModelSelector: '[name^="answer-"] h6',
    aiAnswerSelector: '[name^="answer-"] h6',
    selectParentOfAiAnswer: true,
    paginationSelector: '.pagination button'
  });
}
