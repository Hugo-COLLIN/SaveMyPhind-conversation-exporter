/*
--- Load CDN ---
 */
function loadScript(url, callback) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;

  script.onload = function() {
    callback();
  };

  document.head.appendChild(script);
}

const cdnUrl = 'https://unpkg.com/turndown/dist/turndown.js';



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
      res = "Modifiée le " + dd + "/" + mm + "/" + yyyy + " à " + hh + ":" + mn + ":" + ss;
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
    let conv;

    // if (showdown !== undefined) {
    //   conv = new showdown.Converter();
    //   conv = conv.makeMarkdown(message);
    // }
    // else if (turndown !== undefined) {
      conv = new TurndownService();
      conv = conv.turndown(message);
    // }

    return `**Answer**:\n` + conv + "\n\n";
  }
  return ''; //`\${message}\n\n`; /** *\${username}**: */
}


function exportConversation() {
  const messages = document.querySelectorAll('.container-xl'); // Replace '.message-selector' with the appropriate CSS selector for the messages on phind.com
  let markdown = '';

  messages.forEach(message => {
    //const username = message.querySelector('.username-selector') // Replace '.username-selector' with the appropriate CSS selector for the username
    const messageText = message.querySelector('.container-xl > div > span'); // Replace '.message-text-selector' with the appropriate CSS selector for the message text
    //console.log(messageText === null ? '' : messageText.textContent);
    markdown += formatMarkdown(messageText === null ? '' : messageText.innerHTML);
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
loadScript(cdnUrl, function() {
  console.log('Library loaded');

  const markdownContent = exportConversation();
  download(markdownContent, formatFilename() + '.md');
});

