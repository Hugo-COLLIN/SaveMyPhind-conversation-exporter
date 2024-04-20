import {createButtonGroup} from "./genericElements/createElements";

import {isHomepageCheck} from "../../../processing/checker/domainChecker.tab";

export function improvePhindUI() {
  chrome.runtime.sendMessage({message: 'LOAD_COMPLETE'}, async function (response) {
    if (response.message === 'exportAllThreads finished') {
      window.location.href = "https://www.phind.com";
    }
    // else if (response.message === 'LOAD_COMPLETE processed' || response.message === 'exportAllThreads in progress') {
    else {
      // let isExporting = response.message === 'exportAllThreads in progress';
      // addStyle();

      // Some UI improvements
      // await createExportButtons(response);

      // Update buttons on resizing window
      // updateButtonsOnResize();
    }
  });
  // whenDOMElementAdded('[role="dialog"]>div>div>div>div>div>div', addListFilter); // display filter input on history modal
}

export async function initVars() {
  const topBtnsGroup = await createButtonGroup("top-buttons-group");
  const isStopGenBasic = document.querySelector("[name=\"answer-0\"] > div > .container-xl > button") !== null;
  const isHomepage = isHomepageCheck();
  return {topBtnsGroup, isStopGenBasic, isHomepage};
}
