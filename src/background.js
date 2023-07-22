import {iconListeners} from "./background/icon/iconMain";
import {clickActionListener} from "./background/action/actionMain";

clickActionListener();
iconListeners();

// event (length)
// {
//   if (length > 0)
//   {
//
//   }
// }
// chrome.tabs.onUpdated.addListener(function (tabId , info) {
//   if (info.status === 'complete') {
//     // Insert button to export all threads in the page
//
//     // sessionStorage.setItem("phindThreadIndex", 0);
//     // while (sessionStorage.getItem("phindThreadIndex") < document.querySelectorAll(".table-responsive tr").length)
//     // {
//     //   document.querySelectorAll(".table-responsive tr")[sessionStorage.getItem("phindThreadIndex")].click();
//     //   console.log(sessionStorage.getItem("phindThreadIndex"));
//     //   sessionStorage.setItem("phindThreadIndex", sessionStorage.getItem("phindThreadIndex") + 1);
//     // }
//   }
// });

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'exportAllThreads') {
    // sessionStorage.setItem("phindThreadIndex", "0");
    console.log("exportAllThreads");
    for (let i = 0; i < request.length; i++)
    {
      console.log("i: " + i);
      chrome.runtime.sendMessage({message: 'clickOnThread', index: i}, function(response) {
        console.log(response);
        chrome.runtime.sendMessage({message: 'exportCurrentThread', index: i}, function(response) {
          console.log(response);
        });
      });

      // sessionStorage.setItem("phindThreadIndex", i);
      // document.querySelectorAll(".table-responsive tr")[i].click();
    }

    return true;  // will respond asynchronously
  }
});