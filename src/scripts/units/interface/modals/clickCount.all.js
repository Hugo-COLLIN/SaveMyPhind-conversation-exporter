//TODO: object Clicker with array of numbers : each time click on icon, use the next number before displaying popup

import ModalMessage from "./ModalMessage.tab";
import {getStorageData} from "../../utils/chromeStorage.all";

export function clickCountInit() {
  chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === "install" || details.reason === "update") {
      chrome.storage.sync.set({"clickIconCount": clickCounts[0], "modalIndex": 0});
    }
  });
}

export async function updateClickIconCount() {
  chrome.storage.sync.set(
    {"clickIconCount": await getStorageData("clickIconCount") - 1}
  );
}

export function resetClickCount(count) {
  chrome.storage.sync.set({"clickIconCount": count}); //100
}

// Array of click counts for each modal
const clickCounts = [14,25,40,40] //[20, 40, 60, 80, 100];

// Array of modals
const MODAL_SURVEY = 'assets/modalMessages/modalSurvey.md';
const MODAL_DONATION = 'assets/modalMessages/modalDonation.md';
const modals = [MODAL_SURVEY, MODAL_DONATION, MODAL_SURVEY, MODAL_DONATION];

// Function to check click count and display modal
export function checkClickCountAndDisplayModal(domain) {
  chrome.storage.sync.get(['clickIconCount', 'modalIndex'], async (result) => {
    if (result.clickIconCount <= 0) {
      await new ModalMessage(modals[result.modalIndex]).appendModal();
      let nextIndex = (result.modalIndex + 1) % modals.length;
      resetClickCount(clickCounts[nextIndex]);
      chrome.storage.sync.set({"modalIndex": nextIndex});
      updateClickIconCount();
    }
  });
}



//Mode: loop, keep last modal
