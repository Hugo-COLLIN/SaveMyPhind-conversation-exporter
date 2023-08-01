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

chrome.runtime.setUninstallURL('https://forms.gle/5stYhnaRkBR9GGBv5', function() {
  // This callback function will run when the URL is set.
  console.log('Uninstall survey URL set');
});
