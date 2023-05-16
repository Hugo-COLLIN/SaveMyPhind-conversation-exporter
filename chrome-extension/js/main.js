/**
 * SaveMyPhind v0.12.3
 * Hugo COLLIN - 2023-05-14
 */

/*
--- Formatting ---
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

function getPageTitle()
{
  return document.querySelector('textarea').innerHTML;
}

function formatFilename()
{
  return formatDate() + ' ' + getPageTitle().replace(/[\/:*?"<>|]/g, '');
}

function formatMarkdown(message)
{
  message = DOMPurify.sanitize(message);
  if (message !== '' && message !== ' ')
  {
    return  converterChoice === turndownChoice ? turndownService.turndown(message) :
            converterChoice === showdownChoice ? showdown.makeMarkdown(message) :
            // converterChoice === markedChoice ? marked.parse(message) :
            // converterChoice === html2MarkChoice ? HTML2Markdown(message) :
            // converterChoice === html2mdChoice ? window.html2Md(message) :
            // converterChoice === reMarkedChoice ? reMarker.render(message) :
            // converterChoice === htmlArkChoice ? htmlArk.convert(message) :
            // converterChoice === htmlToMdChoice ? converter.convert(message) :
            '';
  }
  return '';
}

function setFileHeader()
{
  return "# " + capitalizeFirst(getPageTitle()) + "\n" + "Exported on " + formatDate(1) + " " + formatUrl(getUrl(), "from Phind.com") + " - with SaveMyPhind" + "\n\n";
}

function formatUrl(url, message)
{
  return "[" + message + "](" + url + ")";
}

function getUrl()
{
  return window.location.href;
}

function capitalizeFirst(string)
{
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function exportConversation() {
  const messages = document.querySelectorAll('[name^="answer-"] > div > div');
  let markdown = setFileHeader();

  messages.forEach(content => {
    let p1 = content.querySelector('.col-lg-8.col-xl-7 > .container-xl > div');
    let p2 = content.querySelector('.col-lg-8.col-xl-7 > .container-xl > div.mb-3');
    let p3 = content.querySelectorAll(".col-lg-4.col-xl-4 > .container-xl > .position-relative > div > div:not(:has(> .pagination))"); //.container-xl > .position-relative > div > div:not([class*='col'])

    const messageText =
      p3.length > 0 ? (() => {
        let res = "**Sources:**";
        p3.forEach((elt) => {
          res += "\n" + formatMarkdown(elt.querySelector("a").outerHTML);
        });
        return res;
      })() :

      p2 ? `\n___\n**You:**\n` + formatMarkdown(p2.innerHTML) :

      p1 ? (() => {
          let res = formatMarkdown(p1.innerHTML)
          const index = res.indexOf('\n\n');
          return `___\n**AI answer:**\n` + res.substring(index + 2); //+ 2 : index is at the start (first character) of the \n\n
        })() :

      '';

    if (messageText !== "") markdown += messageText + "\n\n";
  });

  return markdown;
}

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

/*
--- Main ---
 */

//Global variables
turndownChoice = "turndown";
showdownChoice = "showdown";
// markedChoice = "marked";
// html2MarkChoice = "html2Mark";
// html2mdChoice = "html2md";
// reMarkedChoice = "reMarked";
// htmlArkChoice = "htmlArk";
// htmlToMdChoice = "htmlToMd";

converterChoice = turndownChoice;

if (window.location.href.includes('www.phind.com/search')) {
  switch (converterChoice) //make function chooseHeader
  {
    case turndownChoice:
      turndownService = new TurndownService();
      turndownService.addRule('preserveLineBreaksInPre', {
        filter: function (node) {
          return node.nodeName === 'PRE' && node.querySelector('div');
        },
        replacement: function (content, node) {
          const codeBlock = node.querySelector('code');
          const codeContent = codeBlock.textContent.trim();
          return ('\n```\n' + codeContent + '\n```');
        }
      });
      break;
    case showdownChoice:
      showdown = new showdown.Converter();
      break;
    // case markedChoice: //import statement outside module
    //   marked = window.marked();
    //   break;
    // case html2MarkChoice: //error HTMLParser is not defined
    // case html2mdChoice: //error require
    //   break;
    // case reMarkedChoice: //error Refused to evaluate a string : 'unsafe-eval' not allowed source of scripts
    //   reMarker = new reMarked();
    //   break;
    // case htmlArkChoice : //need to import directory
    //   htmlArk = new HTMLarkdown();
    //   break;
    // case htmlToMdChoice : //need to import directory
    //   converter = window.htmltomarkdown();
    //   break;
  }
  markdownContent = exportConversation();
  download(markdownContent, formatFilename() + '.md');
}
