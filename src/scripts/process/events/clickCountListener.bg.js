import {initClickIconCount} from "../../units/page/modals/clickCount.all";

export function setClickCountListener() {
  chrome.runtime.onInstalled.addListener(
    (details) => initClickIconCount(details)
  );
}
