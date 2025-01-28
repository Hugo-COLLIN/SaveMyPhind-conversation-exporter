/*
--- SAVE ---
 */

// --- Background methods ---

/**
 * Save the markdown file
 * @param text markdown content
 * @param filename name of the file
 */
export function download(text: string, filename: string) {
  const url = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(text);

  chrome.downloads.download({
    url: url,
    filename: filename + '.md',
    saveAs: false
  });
}

// --- Content-script methods ---

/**
 * Save the markdown file
 * @param text markdown content
 * @param filename name of the file
 */
export function contentScriptDownload(text: string, filename: string) {
  const blob = new Blob([text], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename + '.md';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Save the markdown file in the clipboard
 * @param markdownContent markdown content
 * @returns {Promise<void>} nothing to be usable
 */
export async function saveToClipboard(markdownContent: string) {
  document.querySelector("body")?.click();
  // Need the user to authorize the clipboard access
  setTimeout(async()=> {
    navigator.clipboard.writeText(markdownContent).then(function() {
      console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
      console.error('Async: Could not copy text: ', err);
    })
  }, 3000)
}

export function linksToObsidian(content: string | number | boolean) {
  const encoded = encodeURIComponent(content);
  window.open(`obsidian://advanced-uri?data=${encoded}&mode=append`, '_blank');
}
