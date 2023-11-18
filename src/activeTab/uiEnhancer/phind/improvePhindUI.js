import {createModal, createModalBg, modalUpdateContent} from "./modals/createModal";
import {waitAppend} from "../interactDOM/interactDOM";
import {createButtonGroup} from "./genericElements/createElements";
import {isHomepageCheck} from "../../checker/domainChecker";

export function improvePhindUI() {
  if (window.location.href.includes("phind.com")) {
    // console.log("PASSED2")
    chrome.runtime.sendMessage({message: 'LOAD_COMPLETE'}, async function (response) {
      // console.log("PASSED3")
      if (response.message === 'exportAllThreads finished') {
        // console.log("PASSED4-1")
        window.location.href = "https://www.phind.com";
      }
      // else if (response.message === 'LOAD_COMPLETE processed' || response.message === 'exportAllThreads in progress') {
      else {
        // console.log("PASSED4-2")
        // let isExporting = response.message === 'exportAllThreads in progress';
        // addStyle();

        // Some UI improvements
        // const {topBtnsGroup, isStopGenBasic, isHomepage} = await initVars();

        // await appendBtnGroup(isStopGenBasic, topBtnsGroup, isHomepage);

        // modifyingStyle();

        // let {
        //   exportAllThreadsSideBtn,
        //   stopExportAllThreadsSideBtn,
        //   exportAllThreadsTopBtn,
        //   stopExportAllThreadsTopBtn,
        //   exportThreadTopBtn
        // } = await setupButtons();

        // appendButtons(isHomepage, topBtnsGroup, exportThreadTopBtn, response, exportAllThreadsSideBtn, exportAllThreadsTopBtn, stopExportAllThreadsSideBtn, stopExportAllThreadsTopBtn);

        // Create "last update" modal if needed
        chrome.storage.sync.get(['displayModalUpdate'], async function (result) {
          if (result.displayModalUpdate) {
            // Create modal
            let modalbg = createModalBg()
            // let modalUpdateLogs = await createModalUpdate(modalbg, modalUpdateContent);
            let modalUpdateLogs = await createModal(modalbg, modalUpdateContent);

            // console.log("Passed HERE")
            // Append modal
            waitAppend("body", [modalbg, modalUpdateLogs], 'appendChild');

            // Update storage
            chrome.storage.sync.set({displayModalUpdate: false}, function () {
              console.log("Last update modal will not be displayed until the next update");
            });
          }
        });

        // // Update buttons on resizing window
        // window.addEventListener('resize', function () {
        //   setBtnsExport(isExporting, exportAllThreadsSideBtn, exportAllThreadsTopBtn, stopExportAllThreadsSideBtn, stopExportAllThreadsTopBtn);
        //
        //   btnBarAllInline(topBtnsGroup);
        // });
      }
    });
    // whenDOMElementAdded('[role="dialog"]>div>div>div>div>div>div', addListFilter); // display filter input on history modal
  }
}

async function initVars() {
  const topBtnsGroup = await createButtonGroup("top-buttons-group");
  const isStopGenBasic = document.querySelector("[name=\"answer-0\"] > div > .container-xl > button") !== null;
  const isHomepage = isHomepageCheck();
  return {topBtnsGroup, isStopGenBasic, isHomepage};
}