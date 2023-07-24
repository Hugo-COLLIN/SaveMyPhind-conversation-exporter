export function exportAllThreadsListener() {
  let currentIndex = 0;
  let lengthList = 0;
  let isExporting = false;
  let eventCount = 0;

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === 'exportAllThreads') {
      isExporting = true;
      currentIndex = 0;
      lengthList = request.length;
      chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {message: 'executeScript', index: currentIndex}, function (response) {
          console.log(response);
        });
      });
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
                console.log(response);
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
  });
}