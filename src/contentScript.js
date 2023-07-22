import {catchContent} from "./activeTab/extractor/extractor";

document.addEventListener('DOMContentLoaded', function() {
  let button = document.createElement('button');
  button.innerHTML = 'Send Message';

  button.addEventListener('click', function() {
    chrome.runtime.sendMessage({message: 'exportAllThreads', length: document.querySelectorAll(".table-responsive tr").length}, function(response) {
      console.log(response);
    });
  });

  document.body.appendChild(button);
});

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.message === 'clickOnThread') {
    document.querySelectorAll(".table-responsive tr")[request.index].click();
  }

  if (request.message === 'exportCurrentThread') {
    // export method
    console.log("exportCurrentThread");
  }
  return true;  // will respond asynchronously
});

// vvvvvvvvvvvvv TODO: test
//document.addEventListener('DOMContentLoaded', function() {
//   chrome.runtime.sendMessage({message: 'READY'}, function(response) {
//     console.log(response);
//   });
//
//   chrome.runtime.sendMessage({message: 'exportAllThreads', length: document.querySelectorAll(".table-responsive tr").length}, function(response) {
//     console.log(response);
//   });
// });
//
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.message === 'clickOnThread') {
//     document.querySelectorAll(".table-responsive tr")[request.index].click();
//     return true;  // will respond asynchronously
//   }
//   if (request.message === 'exportCurrentThread') {
//     // Add your code here to export the current thread
//     return true;  // will respond asynchronously
//   }
//   if (request.message === 'checkIfContentExists') {
//     // Add your code here to check if the content exists and return true if so
//     return true;  // will respond asynchronously
//   }
//   return true;  // will respond asynchronously
// });