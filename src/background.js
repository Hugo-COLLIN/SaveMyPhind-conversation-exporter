import {iconListeners} from "./background/icon/icon";
import {clickActionListener} from "./background/export/exportOnce";
import {exportAllThreadsListener} from "./background/export/exportAll";

clickActionListener();
iconListeners();
exportAllThreadsListener(); // Needs to be after iconListeners and clickActionListener to work properly


chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({displayModalUpdate: true}, function () {
    console.log("Last update modal will be displayed");
  });
});