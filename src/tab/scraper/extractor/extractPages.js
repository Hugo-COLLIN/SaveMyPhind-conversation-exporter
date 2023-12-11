import {capitalizeFirst, formatLineBreaks} from "../../formatter/formatText";
import {formatLink, setFileHeader} from "../../formatter/formatMarkdown";
import {getMaxAIGooglePageTitle, getPerplexityPageTitle, getPhindPageTitle} from "./extractMetadata";
import {foldQuestions, unfoldQuestions} from "../../uiEnhancer/phind/interact";
import {extractPerplexitySources, extractPhindSourcesFromPopup} from "./extractElements";

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

export async function extractPhindAgentPage(format) {
  const messages = document.querySelectorAll('[name^="answer-"]');
  let markdown = await setFileHeader(getPhindPageTitle(), "Phind Agent");

  for (const content of messages) {
    const allDivs = content.querySelectorAll('.col > div > div > div');
    const msgContent = Array.from(allDivs).filter(div => div.children.length > 0);
    const searchResults = content.querySelectorAll('.col > div > div > div:nth-last-of-type(1) > div > a');
    const entityName = content.querySelectorAll('.col > div > div > span');

    if (msgContent.length === 0) continue;

    let res = "";

    // Extract writer name
    if (entityName.length > 0) {
      res += "## ";
      let putSeparator = true;
      entityName.forEach((elt) => {
        res += format(elt.innerHTML);
        if (entityName.length > 1 && entityName[1].innerHTML !== "" && putSeparator) {
          res += " - ";
          putSeparator = false;
        }
      });
      res += "\n";
    }

    // Extract message
    if (searchResults.length > 0) // If there are search results
    {
      // Message
      res += format(msgContent[0].innerHTML) + "\n";

      // Export search results
      res += "___\n**Sources:**";

      if (msgContent[2]) {
        res = await extractPhindSourcesFromPopup(msgContent, searchResults, res, format);
      }
      else {
        let i = 1;
        searchResults.forEach((link) => {
          res += "\n- " + format(link.outerHTML).replace("[", `[(${i}) `);
          i ++;
        })
      }

      res += "\n";

    } else // If there are no search results
      msgContent.forEach((elt) => {
        res += format(elt.innerHTML) + "\n";
      });

    if (res !== "") markdown += res + "\n\n";
  }

  return markdown;
}

async function extractPerplexityPage(format)
{
  const messages = document.querySelectorAll('#ppl-message-scroll-target > div > div:nth-of-type(2) > [class]');
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
      markdown += "---\n**Sources:**\n" + src + "\n";
  }

  return markdown;
}

/**
 * TODO: Chatbot name before answer + get title from MaxAI query, not from google textarea (differences)
 */
export async function extractMaxAIGooglePage(format)
{
  const hostElement = document.querySelector('[id^=MAXAI]');
  if (hostElement === null) return null;
  const shadowRoot = hostElement.shadowRoot;

  const selectAnswer = shadowRoot.querySelector('.search-with-ai--text');
  if (selectAnswer === null) return null;

  let selectSources = shadowRoot.querySelector('[class*=--MuiGrid-container]');
  if (selectSources) selectSources = selectSources.childNodes

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