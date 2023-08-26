import {sleep} from "../../../common/utils";
import {capitalizeFirst} from "../../utils/format/formatText";
import {setFileHeader} from "../../utils/format/formatMarkdown";
import {getPhindPageTitle} from "./extractMetadata";
import {foldQuestions, unfoldQuestions} from "../../utils/webpage/interact";

/**
 * Exported functions
 */
export default {
  extractArbitraryPage,
  extractPhindSearchPage,
  extractPhindAgentPage
}

/**
 * Catch page interesting elements to convert the content into markdown
 * @returns {Promise<string>} markdown
 */
export async function extractArbitraryPage(format) {
  let markdown = await setFileHeader(document.title, window.location.hostname)
  const html = document.querySelector("body").innerHTML;
  markdown += format(html);
  return markdown;
}

/**
 * Catch page interesting elements to convert the conversation into markdown
 * @returns {Promise<string>} markdown
 */
export async function extractPhindSearchPage(format) {
  // Unfold user questions before export
  const unfolded = await unfoldQuestions();

  // Catch page interesting elements
  let sourceQuestion = "";
  const messages = document.querySelectorAll('[name^="answer-"] > div > div');
  let markdown = await setFileHeader(getPhindPageTitle(), "Phind Search");

  messages.forEach(content => {
    let p1 = content.querySelector('.col-lg-8.col-xl-7 > .container-xl > div');
    let aiModel = content.querySelector('.col-lg-8.col-xl-7 > div > div > h6');

    let p2 = content.querySelector('.col-lg-8.col-xl-7 > .container-xl > div.mb-3');
    let p3 = Array.from(content.querySelectorAll(".col-lg-4.col-xl-4 > div > div > div > div")).filter((elem) => {
      return !elem.querySelector('.pagination');
    });
    let aiCitations = content.querySelector('.col-lg-8.col-xl-7 > .container-xl > div > div > div');
    let p4 = content.querySelector('div > div > span');

    const isSources = p4 && p4.querySelector("img") === null;
    sourceQuestion = isSources ? format(p4.innerHTML) : sourceQuestion;
    const messageText =
      isSources ? "" :

        p3.length > 0 ? (() => {
            let res = "---\n**Sources:**";
            res += sourceQuestion ? " " + sourceQuestion : "";

            let i = 0;
            p3.forEach((elt) => {
              res += "\n- " + format(elt.querySelector("a").outerHTML).replace("[", `[(${i}) `);
              i++;
            });
            sourceQuestion = "";
            return res;
          })() :

          p2 ? `\n## User:\n` + format(p2.innerHTML).replace("  \n", "") :

            p1 ? (() => {
                let res = format(p1.innerHTML);
                if (aiCitations && aiCitations.innerHTML.length > 0) res += "\n\n**Citations:**\n" + format(aiCitations.innerHTML);

                let aiName;
                if (aiModel !== null)
                  aiName = format(aiModel.innerHTML).split(" ")[2];
                const aiIndicator = "## " +
                  capitalizeFirst((aiName ? aiName + " " : "") + "answer:") +
                  "\n"
                const index = res.indexOf('\n\n');
                return `\n` + aiIndicator + res.substring(index + 2); //+ 2 : index is at the start (first character) of the \n\n
              })() :

              '';

    if (messageText !== "") markdown += messageText + "\n\n";
  });

  // Fold user questions after export if they were originally folded
  if (unfolded)
    await foldQuestions();

  return markdown;
}

export async function extractPhindAgentPage(format) {
  const messages = document.querySelectorAll('[name^="answer-"] > div > div');
  let markdown = await setFileHeader(getPhindPageTitle(), "Phind Agent");

  for (const content of messages) {
    const p1 = content.querySelectorAll('.card-body > p, .card-body > div');
    const p2 = content.querySelectorAll('.card-body > div:nth-of-type(2) a');
    const p3 = content.querySelectorAll('.card-body > span');

    const messageText =
      p1.length > 0 ? await (async () => {
          let res = "";

          // Extract writer name
          if (p3.length > 0) {
            res += "#### ";
            let putSeparator = true;
            p3.forEach((elt) => {
              res += format(elt.innerHTML);
              if (p3.length > 1 && p3[1].innerHTML !== "" && putSeparator) {
                res += " - ";
                putSeparator = false;
              }
            });
            res += "\n";
          }

          // Extract message
          if (p2.length > 0) // If there are search results
          {
            // Message
            res += format(p1[0].innerHTML) + "\n";

            // Export search results
            res += "___\n**Sources:**";
            const buttonsInCard = p1[1].querySelectorAll("button");
            for (const btn of buttonsInCard) {
              if (btn.textContent.toLowerCase() === "view all search results") {
                // Open modal
                btn.click();
                await sleep(0); // Needed to wait for the modal to open (even if it's 0!)

                // Export sources and all search results, put correct index in front of each link
                let i = 1;
                let allResults = "**All search results:**";

                const dialogLinks = Array.from(document.querySelectorAll("[role='dialog'] a"));
                const p2Array = Array.from(p2);
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

            res += "\n";

          } else // If there are no search results
            p1.forEach((elt) => {
              res += format(elt.innerHTML) + "\n";
            });

          return res;
        })() :

        '';

    if (messageText !== "") markdown += messageText + "\n\n";
  }

  return markdown;
}

