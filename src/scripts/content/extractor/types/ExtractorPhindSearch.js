import {clickElements} from "../../interact/interact";
import {capitalizeFirst, formatLineBreaks} from "../../../shared/formatter/formatText";
import {setFileHeader} from "../../../shared/formatter/formatMarkdown";
import ExtractorPhind from "./ExtractorPhind";
import {safeExecute} from "../../../shared/utils/jsShorteners";


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

    newAnswerSelector.forEach((content) => {
      const selectUserQuestion = content.querySelector('span, textarea') ?? "";

      const selectAiModel = content.querySelector('[name^="answer-"] h6')
      const selectAiAnswer = selectAiModel != null
        ? selectAiModel.parentNode
        : "";
      const selectSources = content.querySelectorAll('a.mb-0');

      // Create formatted document for each answer message
      const messageText =
        `\n## User\n` + format(formatLineBreaks(selectUserQuestion.innerHTML)).replace("  \n", "") + '\n' +
        (() => {
          let res = format(selectAiAnswer.innerHTML);
          let aiName;
          if (selectAiModel !== null)
            aiName = format(selectAiModel.innerHTML).split("|")[1].split("Model")[0].trim();
          const aiIndicator = "## " +
            capitalizeFirst((aiName ? aiName + " " : "") + "answer") +
            "\n"
          const index = res.indexOf('\n\n');
          return `\n` + aiIndicator + res.substring(index + 2); //+ 2 : index is at the start (first character) of the \n\n
        })() +
        (selectSources.length > 0 ? `\n\n---\n**Sources:**` + (() => {
          let res = "";
          let i = 1;
          selectSources.forEach((elt) => {
            res += "\n- " + format(elt.outerHTML).replace("[", `[(${i}) `);
            i++;
          });
          return res;
        })() + "\n\n"
          : "");

      if (messageText !== "") markdown += messageText + "\n";
    });

    // Fold user questions after export if they were originally folded
    safeExecute(clickElements('.fe-chevron-up'));

    return markdown;
  }

  getPageSource() {
    return "Phind-Search";
  }
}
