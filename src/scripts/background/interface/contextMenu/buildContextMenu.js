import {createWindow} from "../alert/managePopups";
import {defineStoreLink} from "../../../content/data/defineStoreLink";
import {isEmojiSupported} from "../../../shared/utils/isEmojiSupported";
import appInfos from "../../../../data/infos.json";
import {launchIconClickAction} from "../icon/iconAction";

export function buildContextMenu() {
  const emojiSupported = isEmojiSupported();
  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "openOptions",
      title: (emojiSupported ? "⚙️ " : "") + "Export Options",
      contexts: ["action"]
    });
    chrome.contextMenus.create({
      id: "tutorial",
      title: (emojiSupported ? "❓ " : "") + "User's Guide",
      contexts: ["action"]
    });
    chrome.contextMenus.create({
      id: "separator",
      type: "separator",
      contexts: ["action"]
    });
    chrome.contextMenus.create({
      id: "feedback",
      title: (emojiSupported ? "🤩 " : "") + "Share your feedback on the store",
      contexts: ["action"]
    });
    chrome.contextMenus.create({
      id: "bugReport",
      title: (emojiSupported ? "🐞 " : "") + "Report a bug",
      contexts: ["action"]
    });
    chrome.contextMenus.create({
      id: "donation",
      title: (emojiSupported ? "❤️ " : "") + "Support the project",
      contexts: ["action"]
    });
    chrome.contextMenus.create({
      id: "exportPage",
      title: "Export this page",
      contexts: ["page"]
    });
  });

  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    switch (info.menuItemId) {
      case "openOptions":
        createWindow("options.html");
        break;
      case "feedback":
        await chrome.tabs.create({url: defineStoreLink().url});
        break;
      case "donation":
        await chrome.tabs.create({url: appInfos.URLS.SUPPORT});
        break;
      case "tutorial":
        await chrome.windows.create({url: appInfos.URLS.TUTORIALS, type: "popup", width: 500, height: 600});
        break;
      case "exportPage":
        await launchIconClickAction(tab);
        break;
      case "bugReport":
        await chrome.tabs.create({url: appInfos.URLS.REPORT_BUG});
        break;
      // case "openIconPopup":
      //   setOneTimePopup("pages/popup.html");
      //   break;
    }
  });
}
