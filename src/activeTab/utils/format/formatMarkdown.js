import {fetchInfos, getUrl} from "../webpage/getters";
import {capitalizeFirst, formatDate, formatLineBreaks, titleShortener} from "./formatText";
import TurndownService from "turndown";
import DOMPurify from "dompurify";

/*
--- MARKDOWN FORMAT ---
*/

export default {
  formatMarkdown
}

/**
 * Initialize the html-to-markdown-converter
 */
export const turndownConverter = new TurndownService();

/**
 * Sanitize and format the selected HTML into markdown using the sanitizer and the selected converter
 * @param html html to format
 * @returns {*|string|string} formatted markdown
 */
export function formatMarkdown(html) {
  const regex = /(?:<span class="fs-5 mb-3 font-monospace" style="white-space: pre-wrap; overflow-wrap: break-word; cursor: pointer;">([\s\S]*?)<\/span>|<textarea tabindex="0" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" name="q" class="form-control bg-white darkmode-light searchbox-textarea" rows="1" placeholder="" aria-label="" style="resize: none; height: 512px;">([\s\S]*?)<\/textarea>)/;
  html = formatLineBreaks(html, regex);

  // Sanitize HTML
  html = DOMPurify.sanitize(html);

  // Convert HTML to Markdown
  if (html !== '' && html !== ' ') {
    return turndownConverter.turndown(html)
      .replace(/{{@LT}}/g, '\\<').replace(/{{@GT}}/g, '\\>');
  }
  return '';
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