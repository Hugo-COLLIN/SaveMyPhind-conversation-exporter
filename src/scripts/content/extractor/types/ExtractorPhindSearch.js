import {clickElements} from "../../interact/interact";
import {capitalizeFirst, formatLineBreaks} from "../../../shared/formatter/formatText";
import {setFileHeader} from "../../../shared/formatter/formatMarkdown";
import ExtractorPhind from "./ExtractorPhind";
import {safeExecute} from "../../../shared/utils/jsShorteners";
import ExtractorSourcesPhindSearch from "../sources/ExtractorSourcesPhindSearch";
import {getPageTitle} from "../extractMetadata";

export default class ExtractorPhindSearch extends ExtractorPhind {
  async extractPage(format) {
    // Unfold user questions before export
    safeExecute(clickElements('.fe-chevron-down'));

    // Catch page interesting elements
    const newAnswerSelector = document.querySelectorAll('[name^="answer-"]');
    let markdown = await safeExecute(setFileHeader(getPageTitle('[name^="answer-"] span'), "Phind Search"));

    for (const content of newAnswerSelector) {
      const selectUserQuestion = content.querySelector('span, textarea') ?? "";

      const selectAiModel = content.querySelector('[name^="answer-"] h6')
      const selectAiAnswer = selectAiModel !== null
        ? selectAiModel.parentNode
        : "";

      const selectPagination = content.querySelectorAll('.pagination button');

      async function generateMessageText(selectUserQuestion, selectAiAnswer, selectAiModel, selectPagination) {
        const userPart = `\n## User\n` + format(formatLineBreaks(selectUserQuestion.innerHTML)).replace("  \n", "") + '\n';

        let aiName;
        if (selectAiModel!== null) {
          aiName = format(selectAiModel.innerHTML).split("|")[1].split("Model")[0].trim();
        }
        const aiIndicator = "## " + capitalizeFirst((aiName? aiName + " " : "") + "answer") + "\n";
        const aiAnswer = format(selectAiAnswer.innerHTML);
        const index = aiAnswer.indexOf('\n\n');
        const aiPart = `\n` + aiIndicator + aiAnswer.substring(index + 2);

        const paginationPart = selectPagination.length > 0
          ? `\n\n---\n**Sources:**` + await safeExecute(await new ExtractorSourcesPhindSearch().extractSources(selectPagination, format)) + "\n\n"
          : "";

        return userPart + aiPart + paginationPart;
      }

      const messageText = await generateMessageText(selectUserQuestion, selectAiAnswer, selectAiModel, selectPagination);

      if (messageText !== "") markdown += messageText + "\n";
    }

    // Fold user questions after export if they were originally folded
    safeExecute(clickElements('.fe-chevron-up'));

    return markdown;
  }
}
