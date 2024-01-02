import {ChatbotExtractor} from "./ChatbotExtractor";
import {foldQuestions, unfoldQuestions} from "../../uiEnhancer/phind/interact";
import {capitalizeFirst} from "../../formatter/formatText";
import {setFileHeader} from "../../formatter/formatMarkdown";
import {sleep} from "../../../common/utils";

export class ChatbotExtractorPhindSearch extends ChatbotExtractor {
  constructor(domain) {
    super(domain);
  }

  async extractPage(format) {
    // Unfold user questions before export
    const unfolded = await unfoldQuestions();

    // Catch page interesting elements
    const newAnswerSelector = document.querySelectorAll('[name^="answer-"]');
    let markdown = await setFileHeader(getPhindPageTitle(), "Phind Search");

    newAnswerSelector.forEach((content) => {
      const selectUserQuestion = content.querySelector('[name^="answer-"] > div > div > span') ?? "";

      const selectAiModel = content.querySelector('[name^="answer-"] h6')
      const selectAiAnswer = selectAiModel != null
        ? selectAiModel.parentNode
        : "";
      const selectSources = content.querySelectorAll('div:nth-child(3) > div:nth-child(5) > div:first-child > div > div > div > div > div > a');


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
        (selectSources.length > 0 ? `\n\n**Sources:**` + (() => {
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

  getPageTitle() {
    const searchFirstMsg = document.querySelector('[name^="answer-"] > div > div > span');
    const agentFirstMsg = document.querySelector('[tabindex="0"]');
    return searchFirstMsg !== null && searchFirstMsg.innerHTML !== ""
      ? searchFirstMsg.innerHTML
      : agentFirstMsg
        ? agentFirstMsg.innerText.replace(/\u00A0/g, " ")
        : "";
  }

  getPageSource() {
    return "Phind-Search";
  }

  async extractSources(msgContent, searchResults, res, format) {
    const buttonsInCard = msgContent[2].querySelectorAll("button");
    for (const btn of buttonsInCard) {
      if (btn.textContent.toLowerCase() === "view all search results") {
        // Open modal
        btn.click();
        await sleep(0); // Needed to wait for the modal to open (even if it's 0!)

        // Export sources and all search results, put correct index in front of each link
        let i = 1;
        let allResults = "**All search results:**";

        const dialogLinks = Array.from(document.querySelectorAll("[role='dialog'] a"));
        const p2Array = Array.from(searchResults);
        dialogLinks.forEach((link) => {
          // If the link is in the sources, add it to the sources with the correct index
          if (p2Array.find((elt) => elt.getAttribute("href") === link.getAttribute("href"))) {
            res += "\n- " + format(link.outerHTML).replace("[", `[(${i}) `);
          }

          // Add the link to the all search results with the correct index
          allResults += "\n- " + format(link.outerHTML).replace("[", `[(${i}) `);
          i++;
        });

        // Append all search results after the sources
        res += "\n\n" + allResults;

        // Close modal
        document.querySelectorAll("[role='dialog'] [type='button']").forEach((btn) => {
          if (btn.textContent.toLowerCase() === "close") btn.click();
        });
      }
    }
    return res;
  }
}
