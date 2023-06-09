import TurndownService from 'turndown';
import DOMPurify from 'dompurify';

const turndownConverter = initConverter();

/*
--- MARKDOWN FORMAT ---
 */
/**
 * Initialize the html-to-markdown-converter
 */
export function initConverter() {
  let turndownService = new TurndownService();
  setTurndownRules(turndownService);
  return turndownService;
}

/**
 * Turndown rules to correctly convert the conversation content into markdown
 */
export function setTurndownRules(turndownService) {
  // --- Turndown custom rules ---
  turndownService.addRule('preserveLineBreaksInPre', {
    filter: function (node) {
      return node.nodeName === 'PRE' && node.querySelector('div');
    },
    replacement: function (content, node) {
      const codeBlock = node.querySelector('code');
      const codeContent = codeBlock.textContent.trim();
      const codeLang = codeBlock.className.split("-", 2)[1];
      return ('\n```' + codeLang + '\n' + codeContent + '\n```');
    }
  });

  turndownService.addRule('replaceEscapedBracketsInLinks', {
    filter: 'a',
    replacement: function (content, node) {
      const href = node.getAttribute('href');
      const linkText = content.replace(/\\\[/g, '(').replace(/\\\]/g, ')');
      return '[' + linkText + '](' + href + ')';
    }
  });
}

/**
 * Sanitize and format the selected HTML into markdown using the sanitizer and the selected converter
 * @param html html to format
 * @returns {*|string|string} formatted markdown
 */
export function formatMarkdown(html)
{
  html = formatLineBreaks(html);

  // Samitize HTML
  html = DOMPurify.sanitize(html);

  // Convert HTML to Markdown
  if (html !== '' && html !== ' ')
  {
    return  turndownConverter.turndown(html);
  }
  return '';
}


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
