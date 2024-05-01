import {foldQuestions, unfoldQuestions} from "../../interact-DOM/interact";
import {capitalizeFirst} from "../../../shared/formatter/formatText";
import {setFileHeader} from "../../../shared/formatter/formatMarkdown";
import ExtractorPhind from "./ExtractorPhind";

export default class ExtractorPhindSearch extends ExtractorPhind {
  getPageTitle() {
    const searchFirstMsg = document.querySelector('[name^="answer-"] span');
    return searchFirstMsg !== null && searchFirstMsg.innerHTML !== ""
      ? searchFirstMsg.innerHTML
      : "";
  }

  async extractPage(format) {
    // Unfold user questions before export
    const unfolded = await unfoldQuestions();

    // Catch page interesting elements
    const newAnswerSelector = document.querySelectorAll('[name^="answer-"]');
    let markdown = await setFileHeader(this.getPageTitle(), "Phind Search");

    newAnswerSelector.forEach((content) => {
      const selectUserQuestion = content.querySelector('[name^="answer-"] span') ?? "";

      const selectAiModel = content.querySelector('[name^="answer-"] h6')
      const selectAiAnswer = selectAiModel != null
        ? selectAiModel.parentNode
        : "";
      const selectSources = content.querySelectorAll('div > div:nth-child(5) > div:first-child > div > div > div > div > div > a');


      // Create formatted document for each answer message
      const messageText =
        `\n## User\n` + format(selectUserQuestion.innerHTML).replace("  \n", "") + '\n' +
        (() => {
          let res = format(selectAiAnswer.innerHTML);
          let aiName;
          if (selectAiModel !== null)
            aiName = format(selectAiModel.innerHTML).split(" ")[2];
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

      if (messageText !== "") markdown += messageText;
    });

    // Fold user questions after export if they were originally folded
    if (unfolded)
      await foldQuestions();

    return markdown;
  }

  getPageSource() {
    return "Phind-Search";
  }
}
