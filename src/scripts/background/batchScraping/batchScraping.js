import {launchScrappingActionOnPage} from "../../content/launch/launchScraperOnPage";

let currentIndex = 0;
let lengthList = 0;
let isExporting = false;
let eventCount = 0;

function exportAllThreadsListener() {
  // Needs to be after setTabsListeners and setActionListeners to work properly
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    return defineProcessingState(request, sendResponse);
  });
  // chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  //   if (request.action === "exportAllThreads") {
  //     chrome.storage.local.set({exportAllThreads: request.value});
  //   }
  // });
}

function scrapOnLoadListener() {
  chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    return launchScrappingActionOnPage(request, domain, sendResponse);
  });
}

export function defineProcessingState(request, sendResponse) {
  if (request.message === 'exportAllThreads') {
    isExporting = true;
    currentIndex = request.redirect ? -1 : 0;
    lengthList = request.length;
    if (!request.redirect) {
      chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {message: 'executeScript', index: currentIndex}, function (response) {
          console.log(response.message);
        });
      });
    }
    setTimeout(function () {
      sendResponse({message: 'exportAllThreads started'});
    }, 1);
  }

  if (request.message === 'stopExportingThreads') {
    isExporting = false;
    sendResponse({message: 'exportAllThreads stopped'});
  }

  if (request.message === 'LOAD_COMPLETE') {
    eventCount++;
    if (eventCount % 2 === 0) {
      if (isExporting) {
        if (currentIndex >= lengthList) {
          isExporting = false;
          sendResponse({message: 'exportAllThreads finished'});
          return;
        }

        currentIndex++;
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
          if (currentIndex < lengthList) {
            chrome.tabs.sendMessage(tabs[0].id, {message: 'executeScript', index: currentIndex}, function (response) {
              console.log(response.message);
            });
          }
        });
        setTimeout(function () {
          sendResponse({message: 'exportAllThreads in progress'});
        }, 1);

      } else {
        setTimeout(function () {
          sendResponse({message: 'LOAD_COMPLETE processed'});
        }, 1);
      }
    } else {
      setTimeout(function () {
        sendResponse({message: 'Before load complete'});
      }, 1);
    }
  }
  return true;
}
