import {
  createButtonGroup,
  createModalBg,
  createModalUpdate,
  createSideMenuBtn,
  createTopBtn
} from "./elements/createElements";
import {launchExport} from "../scraper/scraper";
import {setBtnsExport} from "./elements/styleCreatedElements";
import {waitAppears, waitAppend} from "./elements/insertElements";
import {addListFilter} from "../listFilter/filter";
import {btnBarAllInline} from "./elements/changeElements";
import {isHomepageCheck} from "../scraper/checker/domainChecker";

export function improveUI() {
  window.addEventListener('load', function () {
    if (window.location.href.includes("phind.com")) {
      chrome.runtime.sendMessage({message: 'LOAD_COMPLETE'}, async function (response) {
        if (response.message === 'exportAllThreads finished')
          window.location.href = "https://www.phind.com";
        else if (response.message === 'LOAD_COMPLETE processed' || response.message === 'exportAllThreads in progress') {
          let isExporting = response.message === 'exportAllThreads in progress';
          // addStyle();

          // Some UI improvements
          const topBtnsGroup = await createButtonGroup("top-buttons-group");
          const isStopGenBasic = document.querySelector("[name=\"answer-0\"] > div > .container-xl > button")  !== null;
          const isHomepage = isHomepageCheck();

          // Adds the top button bar
          isStopGenBasic ?
            // Adds the top button bar on Basic search
            await waitAppend("[name=\"answer-0\"] > div > .container-xl", [topBtnsGroup], "prepend").then(() => {
              // Wait the "Stop generating" button to appear
              waitAppears('[name=\"answer-0\"] > div > .container-xl > button:not([style="visibility: hidden;"])', 5, 20000).then(() => {
                // Wait the "Stop generating" button to disappear
                waitAppears('[name=\"answer-0\"] > div > .container-xl > [style="visibility: hidden;"]', 5, 20000).then(async (elt) => {
                  // Adds the top button bar (because it disappears with the "Stop generating" button)
                  await waitAppend("[name=\"answer-0\"] > div > .container-xl", [topBtnsGroup], "prepend");
                });
              })
            })
            // Adds the top button bar on Phind homepage and Pair Programmer
            : await waitAppend("div > div > .container-xl", [topBtnsGroup], isHomepage?"append":"prepend").then(async () => {
              // const space = document.createElement("span");
              // space.style.display = "block";
              // space.classList.add("mb-2");
              // topBtnsGroup.after(space);
            });

          btnBarAllInline(topBtnsGroup);

          // setBtnsDefault();
          // const topBtns = document.querySelectorAll(".container-xl > div > button");
          // topBtns.forEach(btn => {
          //   btn.classList.remove("mb-4");
          //   waitAppend("#top-buttons-group", [btn], "append");
          // });

          document.querySelector(".row > .col-lg-2 > div").style.minWidth = "11em";
          const thread = document.querySelector(".row > .col-lg-8.mt-8");
          if (thread !== null)
          {
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

          // Create elements to add to the page
          let exportAllThreadsSideBtn = await createSideMenuBtn('Export All Threads', 'fe-share', '', 'fs-6');
          let stopExportAllThreadsSideBtn = await createSideMenuBtn('Stop Exporting Threads', 'fe-x', 'none', 'fs-6');

          let exportAllThreadsTopBtn = await createTopBtn('Export All Threads', 'fe-share', 'smallScreens');
          let stopExportAllThreadsTopBtn = await createTopBtn('Stop Exporting Threads', 'fe-x', 'smallScreens');
          let exportThreadTopBtn = await createTopBtn('Save This Thread', 'fe-save');

          // Events on buttons
          exportThreadTopBtn.addEventListener('click', function () {
            launchExport();
          });

          exportAllThreadsSideBtn.addEventListener('click', function () {
            let redirect = false;
            if (window.location.href !== "https://www.phind.com/" && window.location.href !== "https://www.phind.com") {
              window.location.href = "https://www.phind.com";
              redirect = true;
            }
            chrome.runtime.sendMessage({
              message: 'exportAllThreads',
              length: document.querySelectorAll(".table-responsive tr").length,
              redirect: redirect
            }, function (response) {
              console.log(response.message);
            });
            setBtnsExport(true, exportAllThreadsSideBtn, exportAllThreadsTopBtn, stopExportAllThreadsSideBtn, stopExportAllThreadsTopBtn);
          });

          stopExportAllThreadsSideBtn.addEventListener('click', function () {
            chrome.runtime.sendMessage({message: 'stopExportingThreads'}, function (response) {
              console.log(response.message);
            });
            setBtnsExport(false, exportAllThreadsSideBtn, exportAllThreadsTopBtn, stopExportAllThreadsSideBtn, stopExportAllThreadsTopBtn);
            window.location.href = "https://www.phind.com";
          });

          exportAllThreadsTopBtn.addEventListener('click', function () {
            let redirect = false;
            if (window.location.href !== "https://www.phind.com/" && window.location.href !== "https://www.phind.com") {
              window.location.href = "https://www.phind.com";
              redirect = true;
            }

            chrome.runtime.sendMessage({
              message: 'exportAllThreads',
              length: document.querySelectorAll(".table-responsive tr").length,
              redirect: redirect
            }, function (response) {
              console.log(response.message);
            });
            setBtnsExport(true, exportAllThreadsSideBtn, exportAllThreadsTopBtn, stopExportAllThreadsSideBtn, stopExportAllThreadsTopBtn);
          });

          stopExportAllThreadsTopBtn.addEventListener('click', function () {
            chrome.runtime.sendMessage({message: 'stopExportingThreads'}, function (response) {
              console.log(response.message);
            });
            setBtnsExport(false, exportAllThreadsSideBtn, exportAllThreadsTopBtn, stopExportAllThreadsSideBtn, stopExportAllThreadsTopBtn);
            window.location.href = "https://www.phind.com";
          });

          /*
          --- Append elements ---
           */

          if(!isHomepage) topBtnsGroup.append(exportThreadTopBtn);

          // Show/hide "Export all threads" buttons
          if (response.message === 'exportAllThreads in progress') {
            setBtnsExport(true, exportAllThreadsSideBtn, exportAllThreadsTopBtn, stopExportAllThreadsSideBtn, stopExportAllThreadsTopBtn)
          } else {
            setBtnsExport(false, exportAllThreadsSideBtn, exportAllThreadsTopBtn, stopExportAllThreadsSideBtn, stopExportAllThreadsTopBtn)
          }

          // Append buttons
          waitAppend(".col-lg-2 > div > div > table:nth-of-type(1)", [exportAllThreadsSideBtn, stopExportAllThreadsSideBtn], 'after');

          topBtnsGroup.append(exportAllThreadsTopBtn, stopExportAllThreadsTopBtn);

          // Wait for the list to be displayed to add the corresponding elements
          waitAppears('.container.p-0 > .row tbody > tr', 100).then(async (threadsList) => {
            if (!threadsList) return;
            document.querySelector(".row > .table-responsive").classList.add("p-0");
            document.querySelector(".container.p-0 > .row").style.width = '108%';

            const listGlobal = document.querySelector(".container.p-0");
            listGlobal.classList.remove("mt-6");
            listGlobal.classList.add("mt-3");

            const logoPhind = document.querySelector(".d-lg-block.container");
            logoPhind.classList.remove("mb-5", "mt-8");
            logoPhind.classList.add("mb-4", "mt-7");
            await addListFilter();
          });

          // Create "last update" modal if needed
          chrome.storage.sync.get(['displayModalUpdate'], async function (result) {
            if (result.displayModalUpdate) {
              // Create modal
              let modalbg = createModalBg()
              let modalUpdateLogs = await createModalUpdate(modalbg);

              // Append modal
              waitAppend("body", [modalbg, modalUpdateLogs], 'appendChild');

              // Update storage
              chrome.storage.sync.set({displayModalUpdate: false}, function () {
                console.log("Last update modal will not be displayed until the next update");
              });
            }
          });

          // Update buttons on resizing window
          window.addEventListener('resize', function () {
            setBtnsExport(isExporting, exportAllThreadsSideBtn, exportAllThreadsTopBtn, stopExportAllThreadsSideBtn, stopExportAllThreadsTopBtn);

            btnBarAllInline(topBtnsGroup);
          });
        }
      });
    }
  });

}