import axios from 'axios';
/*
--- SAVE ---
 */

// --- Background methods ---

/**
 * Save the markdown file
 * @param text markdown content
 * @param filename name of the file
 */
export async function download(text: string, filename: string) {
  // @ts-ignore TODO defined in esbuild
  if (APP_TARGET === 'firefox') {
    return downloadFirefox(text, filename);
  }
  return downloadChrome(text, filename);
}

async function downloadChrome(text: string, filename: string) {
  const url = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(text);

  await chrome.downloads.download({
    url: url,
    filename: filename + '.md',
    saveAs: false
  });
}

async function downloadFirefox(text: string, filename: string) {
  // Create a Blob with the content and a URL from it
  const blob = new Blob([text], {type: 'text/markdown;charset=utf-8'});
  const url = URL.createObjectURL(blob);

  try {
    await chrome.downloads.download({
      url: url,
      filename: filename + '.md',
      saveAs: false,
    });
  } catch (error: any) {
    console.error("Error during download:", error);
    throw new Error("Download failed: " + error.message);
  } finally {
    // Revoke the URL to free memory
    URL.revokeObjectURL(url);
  }
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

/**
 * Send the Markdown file to a webhook
 * @param text content of the Markdown file
 * @param filename name of the file
 */
export async function sendToWebhook(text: string, filename: string) {
  chrome.storage.sync.get('webhookUrl', async (data) => {
    const webhookUrl = data.webhookUrl;
    if (!webhookUrl) {
      console.info('The webhook URL has not been configured.'); // No se ha configurado la URL del webhook.
      return;
    }
    console.log('Sending file to webhook:', webhookUrl); // Enviando archivo al webhook:
    const formData = new FormData();
    formData.append('file', new Blob([text], { type: 'text/markdown' }), filename + '.md');

    try {
      await axios.post(webhookUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('File successfully sent to webhook'); // Archivo enviado exitosamente al webhook
    } catch (error) {
      console.error('Error sending the file to the webhook:', error); // Error al enviar el archivo al webhook:
    }
  });
}
