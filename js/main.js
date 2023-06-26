/**
 * SaveMyPhind v0.20.3
 * Hugo COLLIN - 2023-06-26
 */


/*
--- MAIN ---
 */
main();

/**
 * Main function
 */
function main() {
  //Global variables
  TURNDOWN_CHOICE = "turndown";
  SHOWDOWN_CHOICE = "showdown";

  converterChoice = TURNDOWN_CHOICE;

  url = window.location.href;
  if (url.includes('www.phind.com')) {
    initConverter();
    (async () => {

      if (url.includes('www.phind.com/search'))
        markdownContent = await exportPhindSearch()
      else if (url.includes('www.phind.com/agent'))
        markdownContent = await exportPhindPair();
      else
        return

      download(markdownContent, formatFilename() + '.md');
      await saveToClipboard(markdownContent);
    })();
  }
}


/*
--- CONVERT ---
 */
/**
 * Catch page interesting elements to convert the conversation into markdown
 * @returns {Promise<string>} markdown
 */
async function exportPhindSearch() {
  // Unfold user questions before export
  const chevronDown = document.querySelector('[name^="answer-"] .col-lg-8.col-xl-7:not(:has(.fixed-bottom)) .fe-chevron-down');
  if (chevronDown !== null) await chevronDown.click();

  let sourceQuestion = "";
  const messages = document.querySelectorAll('[name^="answer-"] > div > div');
  let markdown = setFileHeader();

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

          const aiIndicator = "**" +
            capitalizeFirst((aiModel && aiModel.innerHTML.length > 0) ? formatMarkdown(aiModel.innerHTML).split(" ")[2] : "AI") +
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

async function exportPhindPair() {
  let sourceQuestion = "";
  const messages = document.querySelectorAll('[name^="answer-"] > div > div');
  console.log(messages)
  let markdown = setFileHeader();

  messages.forEach(content => {
    console.log(content)
    let p1 = content.querySelector('.card-body');

    const messageText =
      p1 ? formatMarkdown(p1.innerHTML) : '';

    // let p1 = content.querySelector('.col-lg-8.col-xl-7 > .container-xl > div');
    // let aiModel = content.querySelector('.col-lg-8.col-xl-7 > div > div > h6');
    //
    // let p2 = content.querySelector('.col-lg-8.col-xl-7 > .container-xl > div.mb-3');
    // let p3 = content.querySelectorAll(".col-lg-4.col-xl-4 > div > div > div > div:not(:has(> .pagination))"); // .col-lg-4.col-xl-4 > div > div > div > div:not(:has(> .pagination))
    // let aiCitations = content.querySelector('.col-lg-8.col-xl-7 > .container-xl > div > div > div');
    // let p4 = content.querySelector('.col-lg-4.col-xl-4 > div > span');
    //
    // sourceQuestion = p4 ? formatMarkdown(p4.innerHTML) : sourceQuestion;
    // console.log(p1, p2, p3, p4, aiCitations, sourceQuestion, aiModel)
    // const messageText =
    //   p4 ? "" :
    //
    //     p3.length > 0 ? (() => {
    //         let res = "**Sources:**";
    //         res += sourceQuestion ? " " + sourceQuestion : "";
    //
    //         let i = 0;
    //         p3.forEach((elt) => {
    //           res += "\n- " + formatMarkdown(elt.querySelector("a").outerHTML).replace("[", `[(${i}) `);
    //           i++;
    //         });
    //         sourceQuestion = "";
    //         return res;
    //       })() :
    //
    //       p2 ? `\n___\n**You:**\n` + formatMarkdown(p2.innerHTML).replace("  \n", "") :
    //
    //         p1 ? (() => {
    //             let res = formatMarkdown(p1.innerHTML);
    //             if (aiCitations && aiCitations.innerHTML.length > 0) res += "\n\n**Citations:**\n" + formatMarkdown(aiCitations.innerHTML);
    //
    //             const aiIndicator = "**" +
    //               capitalizeFirst((aiModel && aiModel.innerHTML.length > 0) ? formatMarkdown(aiModel.innerHTML).split(" ")[2] : "AI") +
    //               " answer:**\n"
    //             const index = res.indexOf('\n\n');
    //             return `___\n` + aiIndicator + res.substring(index + 2); //+ 2 : index is at the start (first character) of the \n\n
    //           })() :
    //
    //           '';
    console.log(messageText)

    if (messageText !== "") markdown += messageText + "\n\n";
  });

  return markdown;
}


/*
--- MARKDOWN FORMAT ---
 */
/**
 * Select the converter to use
 */
function initConverter() {
  try {
    switch (converterChoice) //make function chooseHeader
    {
      case TURNDOWN_CHOICE:
        turndownService = new TurndownService();
        setTurndownRules();
        break;
      case SHOWDOWN_CHOICE:
        showdown = new showdown.Converter();
        break;
    }
  }
  catch (e) {
    console.log(e);
  }
}

/**
 * Turndown rules to correctly convert the conversation content into markdown
 */
function setTurndownRules() {
  // --- Turndown custom rules ---
  turndownService.addRule('preserveLineBreaksInPre', {
    filter: function (node) {
      return node.nodeName === 'PRE' && node.querySelector('div');
    },
    replacement: function (content, node) {
      const codeBlock = node.querySelector('code');
      const codeContent = codeBlock.textContent.trim();
      const codeLang = codeBlock.className.split("-", 2)[1];
      return ('\n```' + codeLang + '\n' + codeContent + '\n```');
    }
  });

  turndownService.addRule('replaceEscapedBracketsInLinks', {
    filter: 'a',
    replacement: function (content, node) {
      const href = node.getAttribute('href');
      const linkText = content.replace(/\\\[/g, '(').replace(/\\\]/g, ')');
      return '[' + linkText + '](' + href + ')';
    }
  });
}

/**
 * Format the HTML containing special characters to be correctly converted into markdown
 * @param html html to format
 * @returns {*|string} formatted html
 */
function formatLineBreaks(html) {
  const regex = /(?:<span class="fs-5 mb-3 font-monospace" style="white-space: pre-wrap; overflow-wrap: break-word; cursor: pointer;">([\s\S]*?)<\/span>|<textarea tabindex="0" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" name="q" class="form-control bg-white darkmode-light searchbox-textarea" rows="1" placeholder="" aria-label="" style="resize: none; height: 512px;">([\s\S]*?)<\/textarea>)/;
  const match = html.match(regex);

  if (match) {
    // Split the string by newline characters
    const lines = match[1].split('\n');

    // Replace newline characters with <br> tags and join the lines back into a single string
    return lines.map(line => {
      const spaces = line.match(/^\s*/)[0];
      return (spaces.length > 0 ? "<br>" + '\u00A0'.repeat(spaces.length) : "<br>") + line.trim();
    }).join('');
  }

  return html;
}

/**
 * Sanitize and format the selected HTML into markdown using the sanitizer and the selected converter
 * @param html html to format
 * @returns {*|string|string} formatted markdown
 */
function formatMarkdown(html)
{
  html = formatLineBreaks(html);

  // Samitize HTML
  html = DOMPurify.sanitize(html);

  // Convert HTML to Markdown
  if (html !== '' && html !== ' ')
  {
    return  converterChoice === TURNDOWN_CHOICE ? turndownService.turndown(html) :
      converterChoice === SHOWDOWN_CHOICE ? showdown.makeMarkdown(html) :
        '';
  }
  return '';
}


/*
--- FORMATTING UTILITY FUNCTIONS ---
 */
/**
 * Format the date to the selected format
 * @param format format to use
 * @returns {string} formatted date
 */
function formatDate(format = 0)
{
  dc = new Date();
  const yyyy = dc.getFullYear();
  let mm = dc.getMonth() + 1; // Begins at 0 !
  let dd = dc.getDate();
  let hh = dc.getHours();
  let mn = dc.getMinutes();
  let ss = dc.getSeconds();

  if (mm < 10) mm = '0' + mm;
  if (dd < 10) dd = '0' + dd;
  if (hh < 10) hh = '0' + hh;
  if (mn < 10) mn = '0' + mn;
  if (ss < 10) ss = '0' + ss;

  let res;
  switch (format) {
    case 1 :
      res = dd + "/" + mm + "/" + yyyy + " " + hh + ":" + mn + ":" + ss;
      break;
    case 2 :
      res = dd + "/" + mm + "/" + yyyy;
      break;
    case 0 :
      res = yyyy + "-" + mm + "-" + dd + "_" + hh + "-" + mn + "-" + ss;
      break;
  }
  return res;
}

/**
 * Returns the filename to use for the export
 * @returns {string} filename
 */
function formatFilename()
{
  const filename = formatDate() + ' ' + titleShortener(getPageTitle())[0].replace(/[\n\/:*?"<>|]/g, '');
  return filename.match(/\.{3}$/g) ?
    filename.replace(/\s*\.{3}$/, '...')
  :
    filename.replace(/\s*$/, '');
}

/**
 * Returns the header to put at the beginning of the markdown file
 * @returns {string} header
 */
function setFileHeader()
{
  try {
    const titles = formatMarkdown(capitalizeFirst(titleShortener(getPageTitle())[0]));
    return "# " + titles + "\n" + "Exported on " + formatDate(1) + " " + formatUrl(getUrl(), "from Phind.com") + " - with SaveMyPhind" + "\n\n";
  } catch (e) {
    console.error(e)
  }
}

/**
 * Format a url as a markdown link
 * @param url url to format
 * @param message text to display for the link
 * @returns {string} formatted link
 */
function formatUrl(url, message)
{
  return "[" + message + "](" + url + ")";
}

/**
 * Capitalize the first letter of a string
 * @param string string to process
 * @returns {string} first-letter-capitalized string
 */
function capitalizeFirst(string)
{
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Shorten the title and put the next as a subtitle
 * @param title title to shorten
 * @returns {string[]} array containing the title and the subtitle
 */
function titleShortener(title)
{
  const TITLE_LENGTH = 77;

  title = title.replaceAll("\n", " \n ");
  const words = title.split(" ");
  let res = ["", ""];
  let next;
  let cut = false;

  // Catch a title less than 50 characters
  for (let i = 0; i < words.length; i++)
  {
    // If the next word makes the title too long or is a line break, don't add it to the title and break the loop
    if ((res[0] + words[i]).length > TITLE_LENGTH || words[i].match(/\n/g))
    {
      res[0] += (res[0] === "") ? title.substring(0, TITLE_LENGTH) : ""; // If title does not contain spaces, cut it to 50 characters
      next = i;
      break;
    }

    res[0] += (i !== 0 ? " " : "") + words[i];

  }

  // The next words are added to the subtitle
  for (let i = next; i < words.length; i++)
  {
    if (i === next)
    {
      res[0] += "...";
      res[1] += "...";
    }

    // If the next word is the only one, add the second part of it to the subtitle
    if (next === 0)
    {
      res[1] += title.substring(TITLE_LENGTH);
      break;
    }

    res[1] += words[i] + " ";
  }
  return res;
}


/*
--- GETTERS ---
 */
/**
 * Get the title of the page
 * @returns {string} title
 */
function getPageTitle()
{
  return document.querySelector('textarea').innerHTML;
}

/**
 * Get the url of the page
 * @returns {string} url
 */
function getUrl()
{
  return window.location.href;
}

/*
--- SAVE ---
 */
/**
 * Save the markdown file
 * @param text markdown content
 * @param filename name of the file
 */
function download(text, filename) {
  const blob = new Blob([text], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Save the markdown file in the clipboard
 * @param markdownContent markdown content
 * @returns {Promise<void>} nothing to be usable
 */
async function saveToClipboard(markdownContent) {
  try {
    await navigator.clipboard.writeText(markdownContent);
  } catch (e) {
    console.error("Failed to save content into clipboard.\nPlease try again in a few seconds.");
  }
}