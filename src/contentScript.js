import {threadFromList} from "./threadFromList";

let clickIndex = 0;

document.addEventListener('DOMContentLoaded', function() {
  let button = document.createElement('button');
  button.innerHTML = 'Send Message';

  button.addEventListener('click', function() {
    clickIndex = 0;
    chrome.runtime.sendMessage({message: 'exportAllThreads', length: document.querySelectorAll(".table-responsive tr").length}, function(response) {
      console.log(response);
    });
  });

  document.body.appendChild(button);
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'executeScript') {
    if(clickIndex === request.index) {
      threadFromList(request.index);
      setTimeout(function() {
        sendResponse({message: 'scriptExecuted'});
      }, 1);
    }
  }
  return true; // will respond asynchronously
});


window.addEventListener('load', function() {
  clickIndex++;
  chrome.runtime.sendMessage({message: 'LOAD_COMPLETE'}, function(response) {
    console.log(response);
  });
});





// BEGINS TO WORK vvvvv
// import {threadFromList} from "./threadFromList";
//
// document.addEventListener('DOMContentLoaded', function() {
//   chrome.runtime.sendMessage({message: 'READY'}, function (response) {
//     console.log(response);
//   });
// });
//
//
//
// document.addEventListener('DOMContentLoaded', function() {
//   let button = document.createElement('button');
//   button.innerHTML = 'Send Message';
//
//   button.addEventListener('click', function() {
//     chrome.runtime.sendMessage({message: 'exportAllThreads', length: document.querySelectorAll(".table-responsive tr").length}, function(response) {
//       console.log(response);
//     });
//   });
//
//   document.body.appendChild(button);
// });
//
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   if (request.message === 'executeScript') {
//     threadFromList(request.index);
//     sendResponse({message: 'scriptExecuted'});
//   }
//   return true; // will respond asynchronously
// });










// document.addEventListener('DOMContentLoaded', function() {
//   chrome.runtime.sendMessage({message: 'READY'}, function (response) {
//     console.log(response);
//   });
// });
//
//
//
// document.addEventListener('DOMContentLoaded', function() {
//   let button = document.createElement('button');
//   button.innerHTML = 'Send Message';
//
//   button.addEventListener('click', function() {
//     chrome.runtime.sendMessage({message: 'exportAllThreads', length: document.querySelectorAll(".table-responsive tr").length}, function(response) {
//       console.log(response);
//     });
//   });
//
//   document.body.appendChild(button);
// });
//
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   if (request.message === 'executeScript') {
//     threadFromList(request.index);
//     sendResponse({message: 'scriptExecuted'});
//   }
//   return true; // will respond asynchronously
// });
//
//

























// function listAllEventListeners() {
//   const allElements = Array.prototype.slice.call(document.querySelectorAll('*'));
//   allElements.push(document);
//   allElements.push(window);
//
//   const types = [];
//
//   for (let ev in window) {
//     if (/^on/.test(ev)) types[types.length] = ev;
//   }
//
//   let elements = [];
//   for (let i = 0; i < allElements.length; i++) {
//     const currentElement = allElements[i];
//     for (let j = 0; j < types.length; j++) {
//       if (typeof currentElement[types[j]] === 'function') {
//         elements.push({
//           "node": currentElement,
//           "type": types[j],
//           "func": currentElement[types[j]].toString(),
//         });
//       }
//     }
//   }
//
//   return elements.sort(function(a,b) {
//     return a.type.localeCompare(b.type);
//   });
// }
//
// document.addEventListener('DOMContentLoaded', function() {
//   console.log(listAllEventListeners());
// });



















// function getEventListenersForElement(element) {
//   const listeners = getEventListeners(element);
//   return listeners;
// }
//
// // Example usage:
// const element = document.querySelector('#myElement');
// const listeners = getEventListenersForElement(element);
//
// console.log(listeners)
//
// // Send the listeners to the background script
// // chrome.runtime.sendMessage({listeners: listeners}, function(response) {
// //   console.log(response);
// // });












































// import {catchContent} from "./activeTab/extractor/extractor";
//
// document.addEventListener('DOMContentLoaded', function() {
//   let button = document.createElement('button');
//   button.innerHTML = 'Send Message';
//
//   button.addEventListener('click', function() {
//     chrome.runtime.sendMessage({message: 'exportAllThreads', length: document.querySelectorAll(".table-responsive tr").length}, function(response) {
//       console.log(response);
//     });
//   });
//
//   document.body.appendChild(button);
// });
//
// chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
//   if (request.message === 'clickOnThread') {
//     document.querySelectorAll(".table-responsive tr")[request.index].click();
//   }
//
//   if (request.message === 'exportCurrentThread') {
//     // export method
//     console.log("exportCurrentThread");
//   }
//   return true;  // will respond asynchronously
// });
//
// // vvvvvvvvvvvvv TODO: test
// //document.addEventListener('DOMContentLoaded', function() {
// //   chrome.runtime.sendMessage({message: 'READY'}, function(response) {
// //     console.log(response);
// //   });
// //
// //   chrome.runtime.sendMessage({message: 'exportAllThreads', length: document.querySelectorAll(".table-responsive tr").length}, function(response) {
// //     console.log(response);
// //   });
// // });
// //
// // chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
// //   if (request.message === 'clickOnThread') {
// //     document.querySelectorAll(".table-responsive tr")[request.index].click();
// //     return true;  // will respond asynchronously
// //   }
// //   if (request.message === 'exportCurrentThread') {
// //     // Add your code here to export the current thread
// //     return true;  // will respond asynchronously
// //   }
// //   if (request.message === 'checkIfContentExists') {
// //     // Add your code here to check if the content exists and return true if so
// //     return true;  // will respond asynchronously
// //   }
// //   return true;  // will respond asynchronously
// // });