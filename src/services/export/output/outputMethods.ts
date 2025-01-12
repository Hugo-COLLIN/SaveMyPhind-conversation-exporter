import axios from 'axios';

// TODO: Execute in background
/*
--- SAVE ---
 */

/**
 * Save the markdown file
 * @param text markdown content
 * @param filename name of the file
 */
export function download(text: BlobPart, filename: string) {
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
 * Enviar el archivo Markdown a un webhook
 * @param text contenido del archivo Markdown
 * @param filename nombre del archivo
 */
export async function sendToWebhook(text: BlobPart, filename: string) {
  chrome.storage.sync.get('webhookUrl', async (data) => {
    const webhookUrl = data.webhookUrl;
    if (!webhookUrl) {
      console.error('No se ha configurado la URL del webhook.');
      return;
    }
    console.log('Enviando archivo al webhook:', webhookUrl);
    const formData = new FormData();
    formData.append('file', new Blob([text], { type: 'text/markdown' }), filename + '.md');

    try {
      await axios.post(webhookUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Archivo enviado exitosamente al webhook');
    } catch (error) {
      console.error('Error al enviar el archivo al webhook:', error);
    }
  });
}