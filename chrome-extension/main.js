/*
--- Formatting ---
 */
function formatDate(format = 0)
{
  dc = new Date();
  const yyyy = dc.getFullYear();
  let mm = dc.getMonth() + 1; // Les mois commencent à 0 !
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
      res = "Exported " + dd + "/" + mm + "/" + yyyy + " " + hh + ":" + mn + ":" + ss;
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
  return document.title;
}

function formatFilename()
{
  return formatDate() + ' ' + getPageTitle();
}

function formatMarkdown(message)
{
  if (message !== '' && message !== ' ')
  {
    const turndownService = new TurndownService();
    const conv = turndownService.turndown(message);

    return (conv + "\n\n___\n").replaceAll('\\*', '*');
  }
  return '';
}

function setFileHeader()
{
  return "# " + capitalizeFirst(getPageTitle()) + "\n" + formatDate(1) + "\n\n";
}

function capitalizeFirst(string)
{
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function exportConversation() {
  const messages = document.querySelectorAll('.row > .col-lg-8.col-xl-7 > .container-xl'); // Replace '.message-selector' with the appropriate CSS selector for the messages on phind.com
  let markdown = setFileHeader();

  messages.forEach(message => {
    let p1 = message.querySelector('.row > .col-lg-8.col-xl-7 > .container-xl > div > span');
    let p2 = message.querySelector('.row > .col-lg-8.col-xl-7 > .container-xl > h3');
    const messageText =  p1 ? `**AI answer :**\n` + p1.innerHTML : p2 ? `**You :**\n` + p2.innerHTML : '';
    markdown += formatMarkdown(messageText);
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
if(window.location.href.includes('www.phind.com/search'))
{
  // if (typeof TurndownService === 'undefined') location.reload();
    // window.alert('TurndownService is not defined. Please reload the page.');
  markdownContent = exportConversation();
  download(markdownContent, formatFilename() + '.md');
}
