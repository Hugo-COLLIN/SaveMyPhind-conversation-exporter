import {sleep} from "../../../common/utils";
import {capitalizeFirst, formatLineBreaks} from "../../utils/format/formatText";
import {formatLink, setFileHeader} from "../../utils/format/formatMarkdown";
import {getPerplexityPageTitle, getPhindPageTitle, getMaxAIGooglePageTitle} from "./extractMetadata";
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
  extractMaxAIGooglePage,
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
  let firstQuestion = true;
  const newAnswerSelector = document.querySelectorAll('[name^="answer-"]');
  let markdown = await setFileHeader(getPhindPageTitle(), "Phind Search");

  newAnswerSelector.forEach((content) => {
    let selectUserQuestion;

    if (firstQuestion) {
      selectUserQuestion = document.querySelector('textarea');
      firstQuestion = false;
    }
    else selectUserQuestion = content.querySelector('[name^="answer-"] > div > div > span');
    selectUserQuestion = selectUserQuestion ?? '';


    let selectAiCitations = content.querySelector('div > div:nth-last-of-type(2) > div:nth-of-type(2) > div > div');
    selectAiCitations = selectAiCitations ?? "";

    const selectAiModel = content.querySelector('[name^="answer-"] > div > div > h6')
    const selectAiAnswer = selectAiModel != null ? selectAiModel.parentNode : null;
    const selectSources = content.querySelector('div:last-child > div > div > h6').parentNode.querySelectorAll('div > a:not([href="/filters"])');



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
      (selectAiCitations !== "" ? (`\n\n**Citations:**\n` + format(selectAiCitations.innerHTML)) : "") +
      (selectSources.length > 0 ? `\n\n**Sources:**` + (() => {
        let res = "";
        let i = 0;
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

export async function extractPhindAgentPage(format) {
  const messages = document.querySelectorAll('[name^="answer-"] > div > div');
  let markdown = await setFileHeader(getPhindPageTitle(), "Phind Agent");

  for (const content of messages) {
    const p1 = content.querySelectorAll('.card-body > p, .card-body > div');
    const p2 = content.querySelectorAll('.card-body > div:nth-last-of-type(1) a');
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
            const buttonsInCard = p1[2].querySelectorAll("button");
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
    const question = content.querySelector('.break-words');
    markdown += "## User\n";
    const regex = /<div class="break-words \[word-break:break-word] whitespace-pre-line  whitespace-pre-wrap default font-sans text-base font-medium text-textMain dark:text-textMainDark selection:bg-super selection:text-white dark:selection:bg-opacity-50 selection:bg-opacity-70">([\s\S]*?)<\/div>/
    const questionText = formatLineBreaks(question.innerText ?? "", regex) + "\n\n";
    markdown += questionText.replace(/(?<!`)<(?!`)/g, '\\<').replace(/(?<!`)>(?!`)/g, '\\>');

    // Display answer
    const answer = content.querySelector(".relative.default > div > div")
    const answerer = content.querySelector(".mb-lg .flex.items-center > p");
    markdown += !answerer ?
        "## AI answer\n"
      : answerer.innerHTML.toLowerCase().includes('copilot') ?
        "## Copilot answer\n"
      : answerer.toLowerCase().includes('search') ?
        "## Quick answer\n"
      : "## AI answer\n";
    markdown += format(answer.innerHTML) + "\n\n";

    // Display analysis section
    // const analysis = content.querySelectorAll('.space-y-md.mt-md > div');
    // for (const analysisSection of analysis) {
    //   const sectionTitle = analysisSection.querySelectorAll('div.taco .default')[1];
    //   const sectionContent = analysisSection.querySelector('div.grow');
    //   if (sectionTitle && analysisSection.querySelector(".grid") === null) markdown += "**" + format(sectionTitle.innerText) + ":**\n";
    //   if (sectionContent !== null && sectionContent.querySelector(".grid") === null) markdown += format(sectionContent.innerHTML) + "\n\n";
    // }
    // if (analysis[0].querySelector(".grid") !== null) markdown += "**Quick search:**\n";

    // Display sources
    const src = await extractPerplexitySources(content, format);
    if (src !== null)
      markdown += "---\n**Sources:**\n" + src;
  }

  return markdown;
}

/**
 * TODO: MaxAI download icon + Chatbot name before answer + get title from MaxAI query, not from google textarea (differences)
 */
export async function extractMaxAIGooglePage(format)
{
  const hostElement = document.querySelector('[id^=MAXAI]');
  const shadowRoot = hostElement.shadowRoot;

  const selectAnswer = shadowRoot.querySelector('.search-with-ai--text');
  const selectSources = shadowRoot.querySelector('[class*=--MuiGrid-container]').childNodes;

  let markdown = await setFileHeader(getMaxAIGooglePageTitle(), "MaxAI in Google");
  markdown += "## Answer\n" + format(selectAnswer.innerHTML) + "\n\n";
  markdown += "---\n**Sources:**\n";
  let i = 1;
  selectSources.forEach((elt) => {
    const text = elt.querySelector("a p")
    const url = elt.querySelector("a").href;
    if (text !== null) markdown += "- " + formatLink(url, i + ". " + text.innerHTML) + "\n";
    i ++;
  });
  markdown += "\n\n";

  return markdown;
}