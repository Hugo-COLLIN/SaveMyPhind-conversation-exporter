import {formatMarkdown} from "./convert";
import {capitalizeFirst, setFileHeader} from "./utils";


/**
 * Catch page interesting elements to convert the conversation into markdown
 * @returns {Promise<string>} markdown
 */
export async function exportPhindSearch(converterChoice) {
  // Unfold user questions before export
  const chevronDown = document.querySelector('[name^="answer-"] .col-lg-8.col-xl-7:not(:has(.fixed-bottom)) .fe-chevron-down');
  if (chevronDown !== null) await chevronDown.click();

  let sourceQuestion = "";
  const messages = document.querySelectorAll('[name^="answer-"] > div > div');
  let markdown = setFileHeader("Phind.com", converterChoice);

  messages.forEach(content => {
    let p1 = content.querySelector('.col-lg-8.col-xl-7 > .container-xl > div');
    let aiModel = content.querySelector('.col-lg-8.col-xl-7 > div > div > h6');

    let p2 = content.querySelector('.col-lg-8.col-xl-7 > .container-xl > div.mb-3');
    let p3 = content.querySelectorAll(".col-lg-4.col-xl-4 > div > div > div > div:not(:has(> .pagination))"); // .col-lg-4.col-xl-4 > div > div > div > div:not(:has(> .pagination))
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
              res += "\n- " + formatMarkdown(elt.querySelector("a").outerHTML, converterChoice).replace("[", `[(${i}) `);
              i++;
            });
            sourceQuestion = "";
            return res;
          })() :

          p2 ? `\n___\n**You:**\n` + formatMarkdown(p2.innerHTML, converterChoice).replace("  \n", "") :

            p1 ? (() => {
                let res = formatMarkdown(p1.innerHTML, converterChoice);
                if (aiCitations && aiCitations.innerHTML.length > 0) res += "\n\n**Citations:**\n" + formatMarkdown(aiCitations.innerHTML, converterChoice);

                const aiIndicator = "**" +
                  capitalizeFirst((aiModel && aiModel.innerHTML.length > 0) ? formatMarkdown(aiModel.innerHTML, converterChoice).split(" ")[2] : "AI") +
                  " answer:**\n"
                const index = res.indexOf('\n\n');
                return `___\n` + aiIndicator + res.substring(index + 2); //+ 2 : index is at the start (first character) of the \n\n
              })() :

              '';

    if (messageText !== "") markdown += messageText + "\n\n";
  });

  // Fold user questions after export if they were originally folded
  if (chevronDown !== null)
  {
    const chevronUp = document.querySelector('[name^="answer-"] .col-lg-8.col-xl-7:not(:has(.fixed-bottom)) .fe-chevron-up');
    if (chevronUp !== null) await chevronUp.click();
  }

  return markdown;
}

export function exportPhindPair(converter) {
  const messages = document.querySelectorAll('[name^="answer-"] > div > div');
  let markdown = setFileHeader("Phind.com", converter);

  messages.forEach(content => {
    let p1 = content.querySelectorAll('.card-body > p, .card-body > div');
    let p3 = content.querySelectorAll('.card-body > span');

    const messageText =
      p1.length > 0 ? (() => {
          let res = "";
          if (p3.length > 0)
          {
            res += "#### ";
            let putSeparator = true;
            p3.forEach((elt) => {
              res += formatMarkdown(elt.innerHTML, converter);
              if (p3.length > 1 && putSeparator)
              {
                res += " - ";
                putSeparator = false;
              }
            });
            res += "\n";
          }

          p1.forEach((elt) => {
            res += formatMarkdown(elt.innerHTML, converter) + "\n";
          });

          return res;
        })() :

        '';

    if (messageText !== "") markdown += messageText + "\n\n";
  });

  return markdown;
}
