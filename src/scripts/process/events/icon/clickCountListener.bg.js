import {initClickIconCount} from "../../storage/clickIconCountContext.tab";

export function setClickCountListener() {
  chrome.runtime.onInstalled.addListener(
    (details) => initClickIconCount(details)
  );
}
