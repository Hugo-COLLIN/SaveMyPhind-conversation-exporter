import {createWindow} from "../alert/managePopups";
import {defineStoreLink} from "../../../content/data/defineStoreLink";
import {isEmojiSupported} from "../../../shared/utils/isEmojiSupported";
import appInfos from "../../../../infos.json";

export function buildContextMenu() {
  const emojiSupported = isEmojiSupported();
  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "openOptions",
      title: (emojiSupported ? "⚙️ " : "") + "Export Options",
      contexts: ["all"]
    });
  });

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
      case "openOptions":
        createWindow("pages/options.html");
        break;
      case "feedback":
        chrome.tabs.create({url: defineStoreLink().url});
        break;
      case "donation":
        chrome.tabs.create({url: appInfos.URLS.SUPPORT});
        break;
      // case "openIconPopup":
      //   setOneTimePopup("pages/popup.html");
      //   break;
    }
  });
}
