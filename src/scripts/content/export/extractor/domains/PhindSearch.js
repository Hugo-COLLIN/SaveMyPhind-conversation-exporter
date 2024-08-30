import {capitalizeFirst, formatLineBreaks} from "../../../../shared/formatter/formatText";
import {safeExecute} from "../../../../shared/utils/jsShorteners";
import {extractSources} from "../extractSources";

export async function processMessage(content, format, metadata) {
  const selectUserQuestion = content.querySelector('span, textarea') ?? "";
  const selectAiModel = content.querySelector('[name^="answer-"] h6');
  const selectAiAnswer = selectAiModel !== null ? selectAiModel.parentNode : "";
  const selectPagination = content.querySelectorAll('.pagination button');

  const userPart = `\n## User\n` + format(formatLineBreaks(selectUserQuestion.innerHTML)).replace("  \n", "") + '\n';

  let aiName;
  if (selectAiModel !== null) {
    aiName = format(selectAiModel.innerHTML).split("|")[1].split("Model")[0].trim();
  }
  const aiIndicator = "## " + capitalizeFirst((aiName ? aiName + " " : "") + "answer") + "\n";
  const aiAnswer = format(selectAiAnswer.innerHTML);
  const index = aiAnswer.indexOf('\n\n');
  const aiPart = `\n` + aiIndicator + aiAnswer.substring(index + 2);

  const paginationPart = selectPagination.length > 0
    ? "\n" + await safeExecute(extractSources(content, format, metadata.sourcesExtraction))
    : "";

  return userPart + aiPart + paginationPart;
}
