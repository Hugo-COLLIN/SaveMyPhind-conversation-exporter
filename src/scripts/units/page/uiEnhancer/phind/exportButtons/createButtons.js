import {waitAppears, waitAppend} from "../../../interact-DOM/interactDOM.tab";
import {btnBarAllInline} from "./changeButtons";
import {setBtnsExport} from "./styleExportButtons";
import {createSideMenuBtn, createTopBtn} from "../genericElements/createElements";
import {launchExport} from "../../../../process/tab/exportProcess";
import {initVars} from "../../../../process/tab/improvePhindUI";

async function setupButtons() {
  // Create elements to add to the page
  let exportAllThreadsSideBtn = await createSideMenuBtn('Export All Threads', 'fe-share', '', 'fs-6');
  let stopExportAllThreadsSideBtn = await createSideMenuBtn('Stop Exporting Threads', 'fe-x', 'none', 'fs-6');

  let exportAllThreadsTopBtn = await createTopBtn('Export All Threads', 'fe-share', 'smallScreens');
  let stopExportAllThreadsTopBtn = await createTopBtn('Stop Exporting Threads', 'fe-x', 'smallScreens');
  let exportThreadTopBtn = await createTopBtn('Save This Thread', 'fe-save');

  // Events on buttons
  exportThreadTopBtn.addEventListener('click', function (domain) {
    launchExport(domain);
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
  return {
    exportAllThreadsSideBtn,
    stopExportAllThreadsSideBtn,
    exportAllThreadsTopBtn,
    stopExportAllThreadsTopBtn,
    exportThreadTopBtn
  };
}

/*
--- Append elements ---
 */
function appendButtons(isHomepage, topBtnsGroup, exportThreadTopBtn, response, exportAllThreadsSideBtn, exportAllThreadsTopBtn, stopExportAllThreadsSideBtn, stopExportAllThreadsTopBtn) {
  if (!isHomepage) topBtnsGroup.append(exportThreadTopBtn);

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
  });
}

async function appendBtnGroup(isStopGenBasic, topBtnsGroup, isHomepage) {
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
    : await waitAppend("div > div > .container-xl", [topBtnsGroup], isHomepage ? "append" : "prepend").then(async () => {
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
}

async function createExportButtons(response) {
  const {topBtnsGroup, isStopGenBasic, isHomepage} = await initVars();

  await appendBtnGroup(isStopGenBasic, topBtnsGroup, isHomepage);

  modifyingStyle();

  let {
    exportAllThreadsSideBtn,
    stopExportAllThreadsSideBtn,
    exportAllThreadsTopBtn,
    stopExportAllThreadsTopBtn,
    exportThreadTopBtn
  } = await setupButtons();

  appendButtons(isHomepage, topBtnsGroup, exportThreadTopBtn, response, exportAllThreadsSideBtn, exportAllThreadsTopBtn, stopExportAllThreadsSideBtn, stopExportAllThreadsTopBtn);
}
