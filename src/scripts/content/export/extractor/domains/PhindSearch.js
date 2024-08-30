import {extractSection} from "../extractSection";

export async function processMessage(content, format, metadata) {
  return extractSection(content, format, metadata, {
    extractionType: 'search-sections',
    userQuestionSelector: 'span, textarea',
    aiModelSelector: '[name^="answer-"] h6',
    aiAnswerSelector: '[name^="answer-"] h6',
    selectParentOfAiAnswer: true,
    paginationSelector: '.pagination button'
  });
}
