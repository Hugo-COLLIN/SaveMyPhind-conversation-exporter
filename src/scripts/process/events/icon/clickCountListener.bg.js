import {initClickIconCount} from "../../../units/internals/icon/clickIconCountContext.bg";

export function setClickCountListener() {
  chrome.runtime.onInstalled.addListener(
    (details) => initClickIconCount(details)
  );
}
