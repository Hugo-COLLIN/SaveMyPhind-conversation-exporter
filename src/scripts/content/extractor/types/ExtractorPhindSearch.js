import {clickElements} from "../../interact/interact";
import {capitalizeFirst, formatLineBreaks} from "../../../shared/formatter/formatText";
import {setFileHeader} from "../../../shared/formatter/formatMarkdown";
import ExtractorPhind from "./ExtractorPhind";
import {safeExecute, sleep} from "../../../shared/utils/jsShorteners";


export default class ExtractorPhindSearch extends ExtractorPhind {
  getPageTitle() {
    const searchFirstMsg = document.querySelector('[name^="answer-"] span');
    return searchFirstMsg !== null && searchFirstMsg.innerHTML !== ""
      ? searchFirstMsg.innerHTML
      : "";
  }

  async extractPage(format) {
    // Unfold user questions before export
    safeExecute(clickElements('.fe-chevron-down'));

    // Catch page interesting elements
    const newAnswerSelector = document.querySelectorAll('[name^="answer-"]');
    let markdown = await safeExecute(setFileHeader(this.getPageTitle(), "Phind Search"));

    for (const content of newAnswerSelector) {
      const selectUserQuestion = content.querySelector('span, textarea') ?? "";

      const selectAiModel = content.querySelector('[name^="answer-"] h6')
      const selectAiAnswer = selectAiModel !== null
        ? selectAiModel.parentNode
        : "";

      const selectPagination = content.querySelectorAll('.pagination button');

      // Create formatted document for each answer message
      async function fetchSources(selectPagination) {
        let res = "";
        let i = 1;
        for (const elt of selectPagination) {
          elt.click();
          await sleep(1);
          const selectSources = document.querySelectorAll('a.mb-0');
          selectSources.forEach((sourceElt) => {
            res += "\n- " + format(sourceElt.outerHTML).replace("[", `[(${i}) `);
            i++;
          });
        }
        selectPagination[0] && selectPagination[0].click();
        return res;
      }

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
          ? `\n\n---\n**Sources:**` + await fetchSources(selectPagination) + "\n\n"
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

  getPageSource() {
    return "Phind-Search";
  }
}
