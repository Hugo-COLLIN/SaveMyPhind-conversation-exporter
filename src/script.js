/*
--- MAIN ---
 */


import {welcome} from "./activeTab/welcome/welcome";
import {catchAllThreads} from "./activeTab/extractor/extractor";
import {exporter} from "./activeTab/exporter/exporter";

main();

/**
 * Main function
 */
async function main() {
  if (document.URL.includes("phind.com")) {
    await welcome();
    const caught = await catchAllThreads();
    if (caught !== null) {
      await exporter(caught.markdownContent, caught.title);
      console.log("Export done!")
    }
  }
}

// Dans le contentScript
document.addEventListener('DOMContentLoaded', function() {
  // Créer un nouveau bouton
  let button = document.createElement('button');
  button.innerHTML = 'Send Message';

  // Ajouter un écouteur d'événements au bouton
  button.addEventListener('click', function() {
    // Envoyer le message quand le bouton est cliqué
    chrome.runtime.sendMessage({message: 'exportAllThreads', length: length}, function(response) {
      console.log(response);
    });
  });

  // Ajouter le bouton au corps du document
  document.body.appendChild(button);
});
