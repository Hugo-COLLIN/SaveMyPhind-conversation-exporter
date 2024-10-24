//TODO: object Clicker with array of numbers : each time click on icon, use the next number before displaying popup

import {getStorageData} from "../../../../data/chromeStorage";

// Array of click counts for each modal
export const clickCounts = [14, 25, 40, 40] //[20, 40, 60, 80, 100];

export function initClickCount() {
  chrome.runtime.onInstalled.addListener(
    (details) => {
      initClickIconCount(details);
    }
  );
}

export function initClickIconCount(details) {
  if (details.reason === "install" || details.reason === "update") {
    chrome.storage.sync.set({"clickIconCount": clickCounts[0], "modalIndex": 0});
  }
}

export async function updateClickIconCount() {
  chrome.storage.sync.set(
    {"clickIconCount": await getStorageData("clickIconCount") - 1}
  );
}

export function resetClickCount(count) {
  chrome.storage.sync.set({"clickIconCount": count}); //100
}
