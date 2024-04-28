import {getStorageData} from "../../units/utils/chromeStorage.all";

// Array of click counts for each modal
export const clickCounts = [14, 25, 40, 40] //[20, 40, 60, 80, 100];

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

