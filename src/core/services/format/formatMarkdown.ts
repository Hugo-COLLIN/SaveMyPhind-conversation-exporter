import {getUrl} from "../../utils/cs/getters";
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
export let turndownConverter: TurndownService;

export function initTurndown(options = {}) {
  turndownConverter = new TurndownService(options);
}

/**
 * Sanitize and format the selected HTML into markdown using the sanitizer and the selected converter
 * @param html html to format
 * @returns {*|string|string} formatted markdown
 */
export function formatMarkdown(html: string | Node): any | string | string {
  // Sanitize HTML
  html = DOMPurify.sanitize(html);

  // Replace spaces and line breaks in the div.whitespace-pre-wrap content only
  const regex = /<div\s+class="whitespace-pre-wrap">(.*?)<\/div>/gs;
  html = html.replace(regex, (match, content) => {
    const replacedContent = content.replace(/ /g, '&nbsp;').replace(/\n/g, '&#x2028;');
    return `<div class="whitespace-pre-wrap">${replacedContent}</div>`;
  });


  // Convert HTML to Markdown
  if (html !== '' && html !== ' ') {
    let markdown = turndownConverter.turndown(html)
      // .replace(/{{@LT}}/g, '\\<').replace(/{{@GT}}/g, '\\>')
      .replace(/\n\n /g, '\n\n');

    // Fix ChatGPT whitespaces and newlines before links
    const nonCodeBlockRegex = /(?!```[\s\S]*?```)[\s\S]+/g;
    markdown = markdown.replace(nonCodeBlockRegex, (block) => block.replace(/\( *\n *\n *\[/g, '(['));
    return markdown;
  }
  return '';
}

/**
 * Format a url as a markdown link
 * @param url url to format
 * @param message text to display for the link
 * @returns {string} formatted link
 */
export function formatLink(url: string | HTMLElement, message: string): string {
  // console.log(message)
  // @ts-ignore
  const res = "[" + message.replaceAll("`", "") + "](" + url?.replace(/\)/g, "%29") + ")";
  // console.log(res)
  return res;
}

/**
 * Returns the header to put at the beginning of the markdown file
 * @returns {string} header
 */
export async function setFileHeader(title: string, linkSite: any) {
  try {
    const titles = formatMarkdown(capitalizeFirst(titleShortener(title)[0]));
    return "# " + titles + "\n" + "Exported on " + formatDate(2, new Date()) + " at " + formatDate(3, new Date()) + " " + formatLink(getUrl(), `from ${linkSite}`) + ` - with ` + formatLink(`${appInfos.URLS.WEBSITE ?? ""}`, `${appInfos.APP_SNAME ?? ""}`) + "\n\n";
  } catch (e) {
    console.error(e)
  }
}
