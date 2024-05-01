import {initClickIconCount} from "./clickIconCountContext";

export function setClickCountListener() {
  chrome.runtime.onInstalled.addListener(
    (details) => initClickIconCount(details)
  );
}
