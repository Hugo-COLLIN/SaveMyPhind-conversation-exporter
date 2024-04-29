import {initClickIconCount} from "../state/clickIconCountContext";

export function setClickCountListener() {
  chrome.runtime.onInstalled.addListener(
    (details) => initClickIconCount(details)
  );
}
