import {threadFromList} from "./threadFromList";

// let exportAllThreadsBtn = document.createElement('button');


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'executeScript') {
      threadFromList(request.index);
      setTimeout(function() {
        sendResponse({message: 'scriptExecuted'});
      }, 1);
  }
  return true; // will respond asynchronously
});

window.addEventListener('load', function() {
  console.log(document.readyState)
  chrome.runtime.sendMessage({message: 'LOAD_COMPLETE'}, function(response) {
    console.log(response);
    if (response.message === 'LOAD_COMPLETE processed') {
      // let exportAllThreadsBtn = document.querySelector(".col-lg-2 > div > div > table > tbody").cloneNode(true);

// Step 2: Create the tbody element.
      var exportAllThreadsBtn = document.createElement('tbody');

// Step 3: Create the tr element and set its style.
      var tr = document.createElement('tr');
      tr.style.cursor = 'pointer';

// Step 4: Create the td element.
      var td = document.createElement('td');

// Step 5: Create the first div with the class row.
      var div1 = document.createElement('div');
      div1.classList.add('row');

// Step 6: Create the col-1 fs-5 div
      var div2 = document.createElement('div');
      div2.classList.add('col-1', 'fs-5');

// Step 7: Create the fw-bold col-10 fs-5 div.
      var div3 = document.createElement('div');
      div3.classList.add('fw-bold', 'col-10', 'fs-5');

// Step 8: Create the i element with the class 'mx-2 fe fe-message-square'
      var iElement = document.createElement('i');
      iElement.classList.add('mx-2', 'fe', 'fe-share');

// Step 9: Set the rest of the div's innerHTML.
      div3.innerHTML += 'Export All Threads';

// Step 10: Append the iElement to div3 before the text.
      div3.insertBefore(iElement, div3.childNodes[0]);

// Step 11: Append the div2 and div3 to div1.
      div1.appendChild(div2);
      div1.appendChild(div3);

// Step 12: Append div1 to td.
      td.appendChild(div1);

// Step 13: Append td to tr.
      tr.appendChild(td);

// Step 14: Append tr to tbody.
      exportAllThreadsBtn.appendChild(tr);



      tr.addEventListener('click', function() {
        chrome.runtime.sendMessage({message: 'exportAllThreads', length: document.querySelectorAll(".table-responsive tr").length}, function(response) {
          console.log(response);
        });
      });

      document.querySelector(".col-lg-2 > div > div > table").appendChild(exportAllThreadsBtn);
    }
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