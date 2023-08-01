import TurndownService from 'turndown';
import DOMPurify from 'dompurify';
import {formatLineBreaks} from "./formatText";

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
export function formatMarkdown(html)
{
  const regex = /(?:<span class="fs-5 mb-3 font-monospace" style="white-space: pre-wrap; overflow-wrap: break-word; cursor: pointer;">([\s\S]*?)<\/span>|<textarea tabindex="0" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" name="q" class="form-control bg-white darkmode-light searchbox-textarea" rows="1" placeholder="" aria-label="" style="resize: none; height: 512px;">([\s\S]*?)<\/textarea>)/;
  html = formatLineBreaks(html, regex);

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


