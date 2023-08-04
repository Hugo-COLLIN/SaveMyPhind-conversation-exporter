import {sleep} from "../../../common/utils";
import {capitalizeFirst, formatLineBreaks} from "../../utils/format/formatText";
import {setFileHeader} from "../../utils/format/formatMarkdown";
import {getPerplexityPageTitle, getPhindPageTitle} from "./extractMetadata";
import {foldQuestions, unfoldQuestions} from "../../utils/webpage/interact";
import {extractPerplexitySources} from "./extractElements";

/**
 * Exported functions
 */
export default {
  extractArbitraryPage,
  extractPhindSearchPage,
  extractPhindAgentPage,
  extractPerplexityPage,
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
    let p4 = content.querySelector('.col-lg-4.col-xl-4 > div > span');

    sourceQuestion = p4 ? format(p4.innerHTML) : sourceQuestion;
    const messageText =
      p4 ? "" :

        p3.length > 0 ? (() => {
            let res = "**Sources:**";
            res += sourceQuestion ? " " + sourceQuestion : "";

            let i = 0;
            p3.forEach((elt) => {
              res += "\n- " + format(elt.querySelector("a").outerHTML).replace("[", `[(${i}) `);
              i++;
            });
            sourceQuestion = "";
            return res;
          })() :

          p2 ? `\n___\n**You:**\n` + format(p2.innerHTML).replace("  \n", "") :

            p1 ? (() => {
                let res = format(p1.innerHTML);
                if (aiCitations && aiCitations.innerHTML.length > 0) res += "\n\n**Citations:**\n" + format(aiCitations.innerHTML);

                const aiName = format(aiModel.innerHTML).split(" ")[2];
                const aiIndicator = "**" +
                  capitalizeFirst((aiName ? aiName + " " : "") + "answer:") +
                  "**\n"
                const index = res.indexOf('\n\n');
                return `___\n` + aiIndicator + res.substring(index + 2); //+ 2 : index is at the start (first character) of the \n\n
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

async function extractPerplexityPage(format)
{
  const messages = document.querySelectorAll('main .pb-md.mb-md');
  let markdown = await setFileHeader(getPerplexityPageTitle(), "Perplexity.ai");

  for (const content of messages) {
    // Display question
    const question = content.querySelector('.pb-md.mb-md .mb-md > div');
    markdown += "## User\n";
    const regex = /<div class="break-words \[word-break:break-word] whitespace-pre-line  whitespace-pre-wrap default font-sans text-base font-medium text-textMain dark:text-textMainDark selection:bg-super selection:text-white dark:selection:bg-opacity-50 selection:bg-opacity-70">([\s\S]*?)<\/div>/
    const questionText = formatLineBreaks(question.innerText, regex) + "\n\n";
    markdown += questionText.replace(/(?<!`)<(?!`)/g, '\\<').replace(/(?<!`)>(?!`)/g, '\\>');

    // Display answer
    const answer = content.querySelector(".relative.default")
    // console.log(answer.innerHTML)
    const answerer = content.querySelector(".mb-lg .flex.items-center > p").innerHTML;
    markdown += answerer.toLowerCase().includes('copilot') ?
        "## Copilot answer\n"
      : answerer.toLowerCase().includes('search') ?
        "## Quick answer\n"
      : "## AI answer\n";
    markdown += format(answer.innerHTML) + "\n\n";

    // Display analysis section
    const analysis = content.querySelectorAll('.space-y-md.mt-md > div');
    // console.log(analysis)
    for (const analysisSection of analysis) {
      // console.log(analysisSection)
      const sectionTitle = analysisSection.querySelectorAll('div.taco .default')[1];
      const sectionContent = analysisSection.querySelector('div.grow');
      if (sectionTitle && analysisSection.querySelector(".grid") === null) markdown += "**" + format(sectionTitle.innerText) + ":**\n";
      if (sectionContent !== null && sectionContent.querySelector(".grid") === null) markdown += format(sectionContent.innerHTML) + "\n\n";
    }
    if (analysis[0].querySelector(".grid") !== null) markdown += "**Quick search:**\n";

    markdown += await extractPerplexitySources(content, format) + "\n\n";
  }

  return markdown;
  // return await extractArbitraryPage(format);
}