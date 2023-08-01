import TurndownService from 'turndown';
import DOMPurify from 'dompurify';
import {formatLineBreaks} from "../../formatUtils/formatText";

/*
--- MARKDOWN FORMAT ---
*/

/**
 * Initialize the html-to-markdown-converter
 */
export const turndownConverter = new TurndownService();


/**
 * Sanitize and format the selected HTML into markdown using the sanitizer and the selected converter
 * @param html html to format
 * @returns {*|string|string} formatted markdown
 */
export function formatMarkdown(html)
{
  html = formatLineBreaks(html);

  // Sanitize HTML
  html = DOMPurify.sanitize(html);

  // Convert HTML to Markdown
  if (html !== '' && html !== ' ')
  {
    return turndownConverter.turndown(html)
      .replace(/{{@LT}}/g, '\\<').replace(/{{@GT}}/g, '\\>');
  }
  return '';
}


