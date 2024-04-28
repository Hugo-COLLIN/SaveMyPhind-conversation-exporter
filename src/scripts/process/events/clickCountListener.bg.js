import {initClickIconCount} from "../../units/interface/modals/clickCount.all";

export function setClickCountListener() {
  chrome.runtime.onInstalled.addListener(
    (details) => initClickIconCount(details)
  );
}
