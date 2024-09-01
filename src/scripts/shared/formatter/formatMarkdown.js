import {getUrl} from "../../content/utils/getters";
import {capitalizeFirst, formatDate, formatLineBreaks, titleShortener} from "./formatText";
import TurndownService from "turndown";
import DOMPurify from "dompurify";
import appInfos from "../../../data/infos.json";

/*
--- MARKDOWN FORMAT ---
*/

export default {
  formatMarkdown: formatMarkdown
}

/**
 * Initialize the html-to-markdown-converter
 */
export let turndownConverter;

export function initTurndown(options = {}) {
  turndownConverter = new TurndownService(options);
}

/**
 * Sanitize and format the selected HTML into markdown using the sanitizer and the selected converter
 * @param html html to format
 * @returns {*|string|string} formatted markdown
 */
export function formatMarkdown(html) {
  // Sanitize HTML
  html = DOMPurify.sanitize(html);

  // Convert HTML to Markdown
  if (html !== '' && html !== ' ') {
    return turndownConverter.turndown(html)
      .replace(/{{@LT}}/g, '\\<').replace(/{{@GT}}/g, '\\>')
      .replace(/\n\n /g, '\n\n');
  }
  return '';
}

/**
 * Format a url as a markdown link
 * @param url url to format
 * @param message text to display for the link
 * @returns {string} formatted link
 */
export function formatLink(url, message) {
  return "[" + message.replaceAll("`", "") + "](" + url.replace(/\)/g, "%29") + ")";
}

/**
 * Returns the header to put at the beginning of the markdown file
 * @returns {string} header
 */
export async function setFileHeader(title, linkSite) {
  try {
    const titles = formatMarkdown(capitalizeFirst(titleShortener(title)[0]));
    return "# " + titles + "\n" + "Exported on " + formatDate(2, new Date()) + " at " + formatDate(3, new Date()) + " " + formatLink(getUrl(), `from ${linkSite}`) + ` - with ` + formatLink(`${appInfos.URLS.WEBSITE ?? ""}`, `${appInfos.APP_SNAME ?? ""}`) + "\n\n";
  } catch (e) {
    console.error(e)
  }
}
