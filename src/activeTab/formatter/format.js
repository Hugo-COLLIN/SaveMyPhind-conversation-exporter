/*
--- FORMATTING UTILITY FUNCTIONS ---
 */

import {formatMarkdown} from "./formatter";
import {fetchInfos, getUrl} from "../extractor/getters";

/**
 * Format the HTML containing special characters to be correctly converted into markdown
 * @param html html to format
 * @returns {*|string} formatted html
 */
export function formatLineBreaks(html) {
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
 * Format a url as a markdown link
 * @param url url to format
 * @param message text to display for the link
 * @returns {string} formatted link
 */
export function formatUrl(url, message) {
  return "[" + message + "](" + url.replace(/\)/g, "%29") + ")";
}

/**
 * Format the date to the selected format
 * @param format format to use
 * @param date
 * @returns {string} formatted date
 */
export function formatDate(format = 0, date = new Date()) {
  const yyyy = date.getFullYear();
  let mm = date.getMonth() + 1; // Begins at 0 !
  let dd = date.getDate();
  let hh = date.getHours();
  let mn = date.getMinutes();
  let ss = date.getSeconds();

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
 * Shorten the title and put the next as a subtitle
 * @param title title to shorten
 * @returns {string[]} array containing the title and the subtitle
 */
export function titleShortener(title) {
  if (!title) return ["", ""];
  const TITLE_LENGTH = 77;
  title = title.replaceAll("\n", " \n ");
  const words = title.split(" ");
  let res = ["", ""];
  let next;

  // Catch a title less than 50 characters
  for (let i = 0; i < words.length; i++) {
    // If the next word makes the title too long or is a line break, don't add it to the title and break the loop
    if ((res[0] + words[i]).length > TITLE_LENGTH || words[i].match(/\n/g)) {
      res[0] += (res[0] === "") ? title.substring(0, TITLE_LENGTH) : ""; // If title does not contain spaces, cut it to 50 characters
      next = i;
      break;
    }

    res[0] += (i !== 0 ? " " : "") + words[i];

  }

  // The next words are added to the subtitle
  for (let i = next; i < words.length; i++) {
    if (i === next) {
      res[0] += "...";
      res[1] += "...";
    }

    // If the next word is the only one, add the second part of it to the subtitle
    if (next === 0) {
      res[1] += title.substring(TITLE_LENGTH);
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
export function formatFilename(title, siteName) {
  const filename = formatDate() + '_' + siteName + '_' + titleShortener(title)[0].replace(/[\n\/:*?"<>|]/g, '');
  return filename.match(/\.{3}$/g) ?
    filename.replace(/\s*\.{3}$/, '...')
    :
    filename.replace(/\s*$/, '');
}

/**
 * Returns the header to put at the beginning of the markdown file
 * @returns {string} header
 */
export async function setFileHeader(title, linkSite) {
  try {
    const titles = formatMarkdown(capitalizeFirst(titleShortener(title)[0]));
    const json = await fetchInfos();
    return "# " + titles + "\n" + "Exported on " + formatDate(1, new Date()) + " " + formatUrl(getUrl(), `from ${linkSite}`) + ` - with ` + formatUrl(`${json.APP_REPO_URL ?? ""}`, `${json.APP_SNAME ?? ""}`) + "\n\n";
  } catch (e) {
    console.error(e)
  }
}

/**
 * Capitalize the first letter of a string
 * @param string string to process
 * @returns {string} first-letter-capitalized string
 */
export function capitalizeFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}