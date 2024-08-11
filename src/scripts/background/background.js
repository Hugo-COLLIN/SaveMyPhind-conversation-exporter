import {setTabsListeners} from "./chrome/setTabsListeners";
import {setRuntimeListeners} from "./chrome/setRuntimeListeners";
import {setActionListeners} from "./chrome/setActionListeners";

background();

function background() {
  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "openOptions",
      title: "Options",
      contexts: ["all"]
    });
    chrome.contextMenus.create({
      id: "openIconPopup",
      title: "Test popup",
      contexts: ["all"]
    });
  });

  // chrome.contextMenus.onClicked.addListener((info, tab) => {
  //   if (info.menuItemId === "openOptions") {
  //     chrome.action.openPopup();
  //   }
  // });

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "openOptions") {
      chrome.windows.create({
        url: chrome.runtime.getURL("pages/options.html"),
        type: "popup",
        width: 400,
        height: 600
      });
    }
    else if (info.menuItemId === "openIconPopup") {
      chrome.action.setPopup({popup: "pages/popup.html"}, () => {
        chrome.action.openPopup().then(r =>
          chrome.action.setPopup({popup: ""})
        );
      });
    }
  });



  // chrome.contextMenus.onClicked.addListener((info, tab) => {
  //   if (info.menuItemId === "openOptions") {
  //     chrome.windows.create({
  //       url: chrome.runtime.getURL("pages/options.html"),
  //       type: "popup",
  //       width: 400,
  //       height: 600
  //     });
  //   }
  // });

  setActionListeners();
  setTabsListeners();
  setRuntimeListeners();
}

