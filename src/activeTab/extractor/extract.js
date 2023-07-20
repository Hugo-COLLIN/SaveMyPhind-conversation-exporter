import {formatMarkdown} from "./convert";
import {capitalizeFirst, getPhindPageTitle, setFileHeader, sleep} from "../utils/utils";
import {setPhindRules, setRandomPageRules} from "./ruler";


export async function exportRandomPage() {
  setRandomPageRules();

  let markdown = await setFileHeader(document.title, window.location.hostname)
  const html = document.querySelector("body").innerHTML;
  markdown += formatMarkdown(html);
  return markdown;
}

/**
 * Catch page interesting elements to convert the conversation into markdown
 * @returns {Promise<string>} markdown
 */
export async function exportPhindSearch() {
  setPhindRules();
  // Unfold user questions before export
  const possibleElements = document.querySelectorAll('[name^="answer-"] .col-lg-8.col-xl-7 .fe-chevron-down');
  const filteredElements = Array.from(possibleElements).filter( (elem) => {
    return !elem.closest('.col-lg-8.col-xl-7').querySelector('.fixed-bottom');
  });
  const chevronDown = filteredElements[0];
  if (chevronDown !== undefined) await chevronDown.click();

  // Catch page interesting elements
  let sourceQuestion = "";
  const messages = document.querySelectorAll('[name^="answer-"] > div > div');
  let markdown = await setFileHeader(getPhindPageTitle(), "Phind.com");

  messages.forEach(content => {
    let p1 = content.querySelector('.col-lg-8.col-xl-7 > .container-xl > div');
    let aiModel = content.querySelector('.col-lg-8.col-xl-7 > div > div > h6');

    let p2 = content.querySelector('.col-lg-8.col-xl-7 > .container-xl > div.mb-3');
    let p3 = Array.from(content.querySelectorAll(".col-lg-4.col-xl-4 > div > div > div > div")).filter((elem) => {
      return !elem.querySelector('.pagination');
    });
    let aiCitations = content.querySelector('.col-lg-8.col-xl-7 > .container-xl > div > div > div');
    let p4 = content.querySelector('.col-lg-4.col-xl-4 > div > span');

    sourceQuestion = p4 ? formatMarkdown(p4.innerHTML) : sourceQuestion;
    const messageText =
      p4 ? "" :

        p3.length > 0 ? (() => {
            let res = "**Sources:**";
            res += sourceQuestion ? " " + sourceQuestion : "";

            let i = 0;
            p3.forEach((elt) => {
              res += "\n- " + formatMarkdown(elt.querySelector("a").outerHTML).replace("[", `[(${i}) `);
              i++;
            });
            sourceQuestion = "";
            return res;
          })() :

          p2 ? `\n___\n**You:**\n` + formatMarkdown(p2.innerHTML).replace("  \n", "") :

            p1 ? (() => {
                let res = formatMarkdown(p1.innerHTML);
                if (aiCitations && aiCitations.innerHTML.length > 0) res += "\n\n**Citations:**\n" + formatMarkdown(aiCitations.innerHTML);

                const aiName = formatMarkdown(aiModel.innerHTML).split(" ")[2];
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
  if (chevronDown !== undefined)
  {
    const possibleElements = document.querySelectorAll('[name^="answer-"] .col-lg-8.col-xl-7 .fe-chevron-up');
    const filteredElements = Array.from(possibleElements).filter( (elem) => {
      return !elem.closest('.col-lg-8.col-xl-7').querySelector('.fixed-bottom');
    });
    const chevronUp = filteredElements[0];

    if (chevronUp !== undefined) await chevronUp.click();
  }

  return markdown;
}

export async function exportPhindPair() {
  setPhindRules();
  const messages = document.querySelectorAll('[name^="answer-"] > div > div');
  let markdown = await setFileHeader(getPhindPageTitle(), "Phind.com");

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
              res += formatMarkdown(elt.innerHTML);
              if (p3.length > 1 && putSeparator) {
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
            res += formatMarkdown(p1[0].innerHTML) + "\n";

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
                dialogLinks.forEach((link) => {
                  // If the link is in the sources, add it to the sources with the correct index
                  const p2Array = Array.from(p2);
                  if (p2Array.find((elt) => elt.getAttribute("href") === link.getAttribute("href"))) {
                    res += "\n- " + formatMarkdown(link.outerHTML).replace("[", `[(${i}) `);
                  }

                  // Add the link to the all search results with the correct index
                  allResults += "\n- " + formatMarkdown(link.outerHTML).replace("[", `[(${i}) `);
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
              res += formatMarkdown(elt.innerHTML) + "\n";
            });

          return res;
        })() :

        '';

    if (messageText !== "") markdown += messageText + "\n\n";
  }

  return markdown;
}

