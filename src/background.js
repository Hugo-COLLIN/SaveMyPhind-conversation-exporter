import {iconListeners} from "./background/icon/iconMain";
import {clickActionListener} from "./background/action/actionMain";

clickActionListener();
iconListeners();


// getMessage fromBtnInContentScript (longueur de la liste)
//   pour $i < longueur de la liste
//     lancer le threadFromList $i : welcome + extract + export + clickOn($i ème elt)

let currentIndex = 0;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'exportAllThreads') {

    currentIndex = 0;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {message: 'executeScript', index: currentIndex}, function(response) {
        console.log(response);
      });
    });
    sendResponse({message: 'exportAllThreads started'});
  }

  if (request.message === 'LOAD_COMPLETE') {
    currentIndex++;
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      if (currentIndex < request.length) { // prevents sending 'executeScript' message if last tr was already clicked
        chrome.tabs.sendMessage(tabs[0].id, {message: 'executeScript', index: currentIndex}, function (response) {
          console.log(response);
        });
      }
    });
  }
  return true; // will respond asynchronously
});
















// BEGINS TO WORK vvvvv
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   if (request.message === 'exportAllThreads') {
//     console.log("exportAllThreads");
//     let promises = [];
//     for (let i = 0; i < request.length; i++) {
//       let promise = new Promise((resolve, reject) => {
//         chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//           chrome.tabs.sendMessage(tabs[0].id, {message: 'executeScript', index: i}, function(response) {
//             console.log(response);
//             resolve();
//           });
//         });
//       });
//       promises.push(promise);
//     }
//     Promise.all(promises).then(() => sendResponse({message: 'All scripts executed'}));
//     return true; // will respond asynchronously
//   }
//   if (request.message === 'READY') {
//     // Handle READY message
//   }
//   return true; // will respond asynchronously
// });






























// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   if (request.message === 'exportAllThreads') {
//     console.log("exportAllThreads");
//     for (let i = 0; i < request.length; i++)
//     {
//       chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//         if (request.message === 'READY') {
//           chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//             chrome.tabs.sendMessage(tabs[0].id, {message: 'executeScript', index: i}, function(response) {
//               console.log(response);
//             });
//           });
//           // chrome.scripting.executeScript({
//           //   args: [i],
//           //   target: {tabId: getTabId(), allFrames : true},
//           //   func: threadFromList
//           // });
//         }
//         return true;
//       });
//     }
//     return true; // will respond asynchronously
//   }
// });















// // background.js
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   if (request.message === 'exportAllThreads') {
//     console.log("exportAllThreads");
//     for (let i = 0; i < request.length; i++)
//     {
//       chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//         chrome.tabs.sendMessage(tabs[0].id, {message: 'executeScript', index: i}, function(response) {
//           console.log(response);
//         });
//       });
//     }
//     return true; // will respond asynchronously
//   }
//   if (request.message === 'READY') {
//     console.log('Content script is ready');
//   }
//   return true; // will respond asynchronously
// });









































//
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   if (request.message === 'exportAllThreads') {
//     console.log("exportAllThreads");
//     for (let i = 0; i < request.length; i++)
//     {
//       chrome.runtime.sendMessage({message: 'clickOnThread', index: i}, function(response) {
//         console.log(response);
//
//         chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//           if (changeInfo.status === 'complete') {
//             chrome.tabs.sendMessage(tabId, {message: 'exportCurrentThread'}, function(response) {
//               console.log(response);
//             });
//           }
//         });
//
//       });
//     }
//     return true; // will respond asynchronously
//   }
// });
//
// // vvvvvvvvvvvvv TODO: test
// //chrome.runtime.onMessage.addListener(
// //   function(request, sender, sendResponse) {
// //     if (request.message === 'READY') {
// //       console.log('Content script is ready');
// //     }
// //     if (request.message === 'exportAllThreads') {
// //       console.log("exportAllThreads");
// //       for (let i = 0; i < request.length; i++) {
// //         chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
// //           var tabId = tabs[0].id;
// //           chrome.runtime.sendMessage({message: 'clickOnThread', index: i}, function(response) {
// //             console.log(response);
// //
// //             const checkIfContentLoaded = setInterval(() => {
// //               chrome.tabs.sendMessage(tabId, {message: 'checkIfContentExists'}, function(responseExists) {
// //                 if (responseExists) {
// //                   clearInterval(checkIfContentLoaded);
// //                   chrome.tabs.sendMessage(tabId, {message: 'exportCurrentThread'}, function(response) {
// //                     console.log(response);
// //                   });
// //                 }
// //               });
// //             }, 2000);  // checks every 2 seconds
// //           });
// //         });
// //       }
// //     }
// //     return true; // will respond asynchronously
// //   }
// // );