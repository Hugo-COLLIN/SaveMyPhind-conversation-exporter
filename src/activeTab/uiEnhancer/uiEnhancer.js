import {createModalBg, createModalUpdate, createSideMenuBtn, createTopBtn} from "../utils/webpage/createElements";
import {launchExport} from "../scraper/scraper";
import {setBtnsExport} from "../utils/webpage/styleElements";
import {waitAppears, waitAppend} from "../utils/webpage/insertElements";
import {addListFilter} from "../listFilter/filter";

export function improveUI() {
  window.addEventListener('load', function () {
    if (window.location.href.includes("phind.com")) {
      chrome.runtime.sendMessage({message: 'LOAD_COMPLETE'}, async function (response) {
        if (response.message === 'exportAllThreads finished')
          window.location.href = "https://www.phind.com";
        else if (response.message === 'LOAD_COMPLETE processed' || response.message === 'exportAllThreads in progress') {
          let isExporting = response.message === 'exportAllThreads in progress';
          // addStyle();

          // Create elements to add to the page
          let exportAllThreadsSideBtn = await createSideMenuBtn('Export All Threads', 'fe-share');
          let stopExportAllThreadsSideBtn = await createSideMenuBtn('Stop Exporting Threads', 'fe-x', 'none');

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

          waitAppend(":not(.row.justify-content-center) > div > .container-xl", [exportThreadTopBtn], 'prepend');

          // Show/hide "Export all threads" buttons
          if (response.message === 'exportAllThreads in progress') {
            setBtnsExport(true, exportAllThreadsSideBtn, exportAllThreadsTopBtn, stopExportAllThreadsSideBtn, stopExportAllThreadsTopBtn)
          } else {
            setBtnsExport(false, exportAllThreadsSideBtn, exportAllThreadsTopBtn, stopExportAllThreadsSideBtn, stopExportAllThreadsTopBtn)
          }

          // Append buttons
          waitAppend(".col-lg-2 > div > div > table", [exportAllThreadsSideBtn, stopExportAllThreadsSideBtn], 'appendChild');

          let doublePlace = [
            {
              selector: ".row.justify-content-center > div > .container-xl",
              mode: 'append'
            },
            {
              selector: ":not(.row.justify-content-center) > div > .container-xl",
              mode: 'prepend'
            }
          ];
          waitAppend(doublePlace, [exportAllThreadsTopBtn, stopExportAllThreadsTopBtn]);


          // Wait for the list to be displayed to add the corresponding elements
          waitAppears('.container.p-0.mt-6 > .row tbody > tr', 100).then(async (isListDisplayed) => {
            if (!isListDisplayed) return;
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
                console.log("Last update modal will not be displayed anymore");
              });
            }
          });

          // Update buttons on resizing window
          window.addEventListener('resize', function () {
            setBtnsExport(isExporting, exportAllThreadsSideBtn, exportAllThreadsTopBtn, stopExportAllThreadsSideBtn, stopExportAllThreadsTopBtn)
          });
        }
      });
    }
  });

}