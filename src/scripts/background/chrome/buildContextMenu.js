import {setPopup} from "./alert";

export function buildContextMenu() {
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

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    setPopup(info);
  });
}
