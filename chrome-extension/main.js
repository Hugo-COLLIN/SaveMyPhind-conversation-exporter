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
      res = "Exported on " + dd + "/" + mm + "/" + yyyy + " " + hh + ":" + mn + ":" + ss + " from phind.com - with SaveMyPhind";
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
    // const conv = turndownService.turndown(message);
    // const conv = HTML2Markdown(message);
    // const conv = md.render(message);
    // const conv = md.render()

    // const tokens = md.parse(md.render(message), {});
    // const conv = tokens.map(token => token.content).join('\n');
    // const conv = marked(message)
    // const conv = reMarker.render(message);
    const conv = showdown.makeMarkdown(message);
    return conv;
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
  const messages = document.querySelectorAll('.row > div > .container-xl');
  let markdown = setFileHeader();

  messages.forEach(content => {
    let p1 = content.querySelector('.row > .col-lg-8.col-xl-7 > .container-xl > div > span');
    let p2 = content.querySelector('.row > .col-lg-8.col-xl-7 > .container-xl > div.mb-3');
    let p3 = content.querySelectorAll('.col-xl-4.col-lg-4 > .container-xl > .position-relative > div > div.pb-3');
    const messageText =
      p3.length > 0 ? (() => {
        let res = "**Sources :**";
        p3.forEach((elt) => {
          res += "\n" + formatMarkdown(elt.querySelector("div.pb-3 > :not(.d-flex)").outerHTML)
        });
        return res;
      })() :
      p2 ? `\n___\n**You :**\n` + formatMarkdown(p2.innerHTML) :
      p1 ? `___\n**AI answer :**\n` + formatMarkdown(p1.innerHTML) :
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

if(window.location.href.includes('www.phind.com/search'))
{
  // reMarker = new reMarked();
  // console.log(reMarker.render("<strong>test</strong>"));

  turndownService = new TurndownService();
  showdown = new showdown.Converter();
  markdownContent = exportConversation();
  download(markdownContent, formatFilename() + '.md');
}
