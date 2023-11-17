import {iconListeners} from "./background/icon/icon";
import {clickActionListener} from "./background/export/exportOnce";
import {exportAllThreadsListener} from "./background/export/exportAll";
import {notify} from "./background/messenger/notify";

clickCountInit();
clickActionListener();
iconListeners();
exportAllThreadsListener(); // Needs to be after iconListeners and clickActionListener to work properly
notify();

function clickCountInit() {
  chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === "install" || details.reason === "update") {
      chrome.storage.sync.set({"clickIconCount": 0}, function () {
        // console.log("Click icon count set to 0");
      });
    }
  });
}

