import {catchContent} from "./activeTab/extractor/extractor";

// Dans le contentScript
document.addEventListener('DOMContentLoaded', function() {
  // Créer un nouveau bouton
  let button = document.createElement('button');
  button.innerHTML = 'Send Message';

  // Ajouter un écouteur d'événements au bouton
  button.addEventListener('click', function() {
    // Envoyer le message quand le bouton est cliqué
    chrome.runtime.sendMessage({message: 'exportAllThreads', length: document.querySelectorAll(".table-responsive tr").length}, function(response) {
      console.log(response);
    });
  });

  // Ajouter le bouton au corps du document
  document.body.appendChild(button);
});


chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.message === 'clickOnThread') {
    await document.querySelectorAll(".table-responsive tr")[request.index].click();
    return true;  // will respond asynchronously
  }

  if (request.message === 'exportCurrentThread') {
    // export method
    return true;  // will respond asynchronously
  }
});
