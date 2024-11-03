/*
--- FORMATTING UTILITY FUNCTIONS ---
 */

/**
 * Format the HTML containing special characters to be correctly converted into markdown
 * @param html html to format
 * @returns {*|string} formatted html
 */
export function formatLineBreaks(html: string): any | string {
  // Split the string by newline characters
  const lines = html.split('\n');

  // Replace newline characters with <br> tags and join the lines back into a single string
  return lines.map(line => {
    // @ts-ignore TODO
    const spaces = line.match(/^\s*/)[0];
    return (spaces.length > 0 ? "<br>" + '\u00A0'.repeat(spaces.length) : "<br>") + line.trim();
  }).join('');
}

/**
 * Format the date to the selected format
 * @param format format to use
 * @param date
 * @returns {string} formatted date
 */
export function formatDate(format = 0, date = new Date()): string | undefined {
  const yyyy = date.getFullYear();
  let mm: number | string = date.getMonth() + 1; // Begins at 0 !
  let dd: number | string = date.getDate();
  let hh: number | string = date.getHours();
  let mn: number | string = date.getMinutes();
  let ss: number | string = date.getSeconds();

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
    case 3 :
      res = hh + ":" + mn + ":" + ss;
      break;
    case 0 :
      res = yyyy + "-" + mm + "-" + dd + "_" + hh + "-" + mn + "-" + ss;
      break;
  }
  return res;
}

/**
 * Shorten the title and put the next as a subtitle
 * @param title title to shorten
 * @param titleLength maximum length of the title
 * @returns {string[]} array containing the title and the subtitle
 */
export function titleShortener(title: string, titleLength = 100): string[] {
  if (!title) return ["", ""];
  title = title.replaceAll("\n", " \n ");
  const words = title.split(" ");
  let res = ["", ""];
  let next: number = 0;

  // Catch a title less than 50 characters
  for (let i = 0; i < words.length; i++) {
    // If the next word makes the title too long or is a line break, don't add it to the title and break the loop
    if ((res[0] + words[i]).length > titleLength || words[i].match(/\n/g)) {
      res[0] += (res[0] === "") ? title.substring(0, titleLength) : ""; // If title does not contain spaces, cut it to 50 characters
      next = i;
      break;
    }

    res[0] += (i !== 0 ? " " : "") + words[i]; // Add the word to the title

  }

  // The next words are added to the subtitle
  for (let i = next; i < words.length; i++) {
    if (i === next) {
      res[0] += "...";
      res[1] += "...";
    }

    // If the next word is the only one, add the second part of it to the subtitle
    if (next === 0) {
      res[1] += title.substring(titleLength);
      break;
    }

    res[1] += words[i] + " ";
  }
  return res;
}

/**
 * Returns the filename to use for the export
 * @returns {string} filename
 */
export function formatFilename(title: string, siteName: string) {
  const filename = titleShortener(formatDate() + '_' + siteName + '_' + title)[0].replace(/[\n\/:*?"<>|]/g, '');
  return filename.match(/\.{3}$/g) ?
    filename.replace(/\s*\.{3}$/, '...')
    :
    filename.replace(/\s*$/, '');
}

export async function patternBasedFormatFilename(title: string, siteName: string) {
  const now = new Date();
  const yyyy = now.getFullYear().toString();
  const mm = (now.getMonth() + 1).toString().padStart(2, '0');
  const dd = now.getDate().toString().padStart(2, '0');
  const hh = now.getHours().toString().padStart(2, '0');
  const mn = now.getMinutes().toString().padStart(2, '0');
  const ss = now.getSeconds().toString().padStart(2, '0');
  const timestamp = Math.floor(now.getTime() / 1000);

  let filenameTemplate = await chrome.storage.sync.get('filenameTemplate');
  filenameTemplate = filenameTemplate['filenameTemplate']
    .replace(/%Y/g, yyyy)
    .replace(/%M/g, mm)
    .replace(/%D/g, dd)
    .replace(/%h/g, hh)
    .replace(/%m/g, mn)
    .replace(/%s/g, ss)
    .replace(/%t/g, timestamp.toString())
    .replace(/%W/g, siteName)
    .replace(/%T/g, titleShortener(title, 60)[0]);

  return filenameTemplate.replace(/[\n\/:*?"<>|]/g, '');
}


/**
 * Capitalize the first letter of a string
 * @param string string to process
 * @returns {string} first-letter-capitalized string
 */
export function capitalizeFirst(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
