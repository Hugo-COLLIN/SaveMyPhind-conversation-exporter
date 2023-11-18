import {createButtonGroup} from "./phind/generalElements/createElements";
import {waitAppears, waitAppend} from "./interactDOM/insertElements";
import {isHomepageCheck} from "../checker/domainChecker";
import {createModalBg, createModal, modalUpdateContent} from "./phind/modals/createModal";
import {addListFilter} from "./phind/historySearch/insertHistoryBar";

async function initVars() {
  const topBtnsGroup = await createButtonGroup("top-buttons-group");
  const isStopGenBasic = document.querySelector("[name=\"answer-0\"] > div > .container-xl > button") !== null;
  const isHomepage = isHomepageCheck();
  return {topBtnsGroup, isStopGenBasic, isHomepage};
}

function modifyingStyle() {
  document.querySelector(".row > .col-lg-2 > div").style.minWidth = "11em";
  const thread = document.querySelector(".row > .col-lg-8.mt-8");
  if (thread !== null) {
    thread.classList.add("mx-3");
    const bar = document.querySelector(".col-lg-8.col-md-12");
    if (bar !== null) bar.classList.add("mx-3");
  }

  // Remove space between buttons in left side menu
  waitAppears(".col-lg-2 > div > div > table").then((elt) => {
    document.querySelectorAll(".col-lg-2 > div > div > table").forEach((elt) => {
      elt.classList.add("mb-0");
    });
  });
  waitAppears(".col-lg-2 > div > div > table.mb-7").then((elt) => {
    if (!elt) return;
    elt.classList.remove("mb-7");
  });
}

function displayInputOnHistoryModal() { // TODO: Make it an insertElement generic function
  const targetNode = document.querySelector('body'); // Change this to a stable parent element
  const observer = new MutationObserver(async (mutationsList, observer) => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        const dialogNode = document.querySelector('[role="dialog"]>div>div>div>div>div>div');
        if (dialogNode && !dialogNode.hasAttribute('data-input-added')) {
          dialogNode.setAttribute('data-input-added', 'true');
          await addListFilter();
        }
      }
    }
  });
  observer.observe(targetNode, {attributes: false, childList: true, subtree: true});
}

export function improveUI() {
  window.addEventListener('load', function () {
    // console.log("UI Enhancer loaded")
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
    }
  });

  // displayInputOnHistoryModal(); // display filter input on history modal

}