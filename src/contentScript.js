import {launchExport} from "./activeTab/orchestrator";
import {sleep} from "./activeTab/utils/utils";
import {logWaitElts} from "./activeTab/console/consoleMessages";
import {clickOnListElt} from "./activeTab/interact/interact";

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.message === 'executeScript') {
    if (request.index > 0) launchExport();
    clickOnListElt(request.index)
    setTimeout(function () {
      sendResponse({message: 'scriptExecuted'});
    }, 1);
  }
  return true; // will respond asynchronously
});

window.addEventListener('load', function() {
  chrome.runtime.sendMessage({message: 'LOAD_COMPLETE'}, function(response) {
    if (response.message === 'exportAllThreads finished')
      window.location.href = "https://www.phind.com";
    else
    if (response.message === 'LOAD_COMPLETE processed' || response.message === 'exportAllThreads in progress') {
      // Create buttons
      let exportAllThreadsSideBtn = createSideMenuBtn('Export All Threads', 'fe-share');
      let stopExportAllThreadsSideBtn = createSideMenuBtn('Stop Exporting Threads', 'fe-x', 'none');

      let exportAllThreadsTopBtn = createTopBtn('Export All Threads', 'fe-share');
      let stopExportAllThreadsTopBtn = createTopBtn('Stop Exporting Threads', 'fe-x');
      let exportThreadTopBtn = createTopBtn('Save This Thread', 'fe-save');


      // Events on buttons
      exportThreadTopBtn.addEventListener('click', function() {
        launchExport();
      });

      exportAllThreadsSideBtn.addEventListener('click', function() {
        let redirect = false;
        if (window.location.href !== "https://www.phind.com/" && window.location.href !== "https://www.phind.com")
        {
          window.location.href = "https://www.phind.com";
          redirect = true;
        }
        chrome.runtime.sendMessage({message: 'exportAllThreads', length: document.querySelectorAll(".table-responsive tr").length}, function(response) {
          console.log(response.message);
        });
        setBtnsExport(true, exportAllThreadsSideBtn, exportAllThreadsTopBtn, stopExportAllThreadsSideBtn, stopExportAllThreadsTopBtn);
      });

      stopExportAllThreadsSideBtn.addEventListener('click', function() {
        chrome.runtime.sendMessage({message: 'stopExportingThreads'}, function(response) {
          console.log(response.message);
        });
        setBtnsExport(false, exportAllThreadsSideBtn, exportAllThreadsTopBtn, stopExportAllThreadsSideBtn, stopExportAllThreadsTopBtn);
        window.location.href = "https://www.phind.com";
      });

      exportAllThreadsTopBtn.addEventListener('click', function() {
        let redirect = false;
        if (window.location.href !== "https://www.phind.com/" && window.location.href !== "https://www.phind.com")
        {
          window.location.href = "https://www.phind.com";
          redirect = true;
        }

        chrome.runtime.sendMessage({message: 'exportAllThreads', length: document.querySelectorAll(".table-responsive tr").length, redirect: redirect}, function(response) {
          console.log(response.message);
        });
        setBtnsExport(true, exportAllThreadsSideBtn, exportAllThreadsTopBtn, stopExportAllThreadsSideBtn, stopExportAllThreadsTopBtn);
      });

      stopExportAllThreadsTopBtn.addEventListener('click', function() {
        chrome.runtime.sendMessage({message: 'stopExportingThreads'}, function(response) {
          console.log(response.message);
        });
        setBtnsExport(false, exportAllThreadsSideBtn, exportAllThreadsTopBtn, stopExportAllThreadsSideBtn, stopExportAllThreadsTopBtn);
        window.location.href = "https://www.phind.com";
      });


      // Show/hide buttons
      if (response.message === 'exportAllThreads in progress') {
        setBtnsExport(true, exportAllThreadsSideBtn, exportAllThreadsTopBtn, stopExportAllThreadsSideBtn, stopExportAllThreadsTopBtn)
      }
      else
      {
        setBtnsExport(false, exportAllThreadsSideBtn, exportAllThreadsTopBtn, stopExportAllThreadsSideBtn, stopExportAllThreadsTopBtn)
      }

      // Append buttons
      waitAppend(".col-lg-2 > div > div > table", [exportAllThreadsSideBtn, stopExportAllThreadsSideBtn], 'appendChild');

      waitAppend(":not(.row.justify-content-center) > div > .container-xl", [exportThreadTopBtn], 'prepend')

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
    }
  });
});

function setBtnsExport(exporting, exportAllThreadsSideBtn, exportAllThreadsTopBtn, stopExportAllThreadsSideBtn, stopExportAllThreadsTopBtn) {
  if (exporting) {
    exportAllThreadsSideBtn.style.display = 'none';
    exportAllThreadsTopBtn.style.display = 'none';
    stopExportAllThreadsSideBtn.style.display = 'block';
    stopExportAllThreadsTopBtn.style.display = 'inline-block';
  }
  else
  {
    exportAllThreadsSideBtn.style.display = 'block';
    exportAllThreadsTopBtn.style.display = 'inline-block';
    stopExportAllThreadsSideBtn.style.display = 'none';
    stopExportAllThreadsTopBtn.style.display = 'none';
  }
}

async function waitAppend(select, htmlTableSectionElements, mode= 'append') {
  let nester = null;
  if (typeof select === 'string') {
    nester = document.querySelector(select);
    while (nester === null) {
      // logWaitElts();
      await sleep(1000)
      nester = document.querySelector(select);
    }
  }
  else if (typeof select === 'object') {
    let added = false;
    let res = select.filter(elt => document.querySelector(elt.selector))
    while (res === []) {
      await sleep(1000)
      res = select.filter(selector => document.querySelector(selector))
    }
    mode = res[0].mode;
    nester = document.querySelector(res[0].selector);
  }
  else return false;

  if (mode === 'prepend') {
    for (let button of htmlTableSectionElements) {
      nester.prepend(button);
    }
  }
  else if (mode === 'appendChild')
  {
    for (let button of htmlTableSectionElements) {
      nester.appendChild(button);
    }
  }
  else
  {
    for (let button of htmlTableSectionElements) {
      nester.append(button);
    }
  }
  return true;
}


/*
--- ELTS CREATION ---
 */
function createSideMenuBtn(title, icon, display = 'block') {
// Step 2: Create the tbody element.
  var button = document.createElement('tbody');

// Step 3: Create the tr element and set its style.
  var tr = document.createElement('tr');
  tr.style.cursor = 'pointer';

// Step 4: Create the td element.
  var td = document.createElement('td');

// Step 5: Create the first div with the class row.
  var div1 = document.createElement('div');
  div1.classList.add('row');

// Step 6: Create the col-1 fs-5 div
  var div2 = document.createElement('div');
  div2.classList.add('col-1', 'fs-5');

// Step 7: Create the fw-bold col-10 fs-5 div.
  var div3 = document.createElement('div');
  div3.classList.add('fw-bold', 'col-10', 'fs-5');

// Step 8: Create the i element with the class 'mx-2 fe fe-message-square'
  var iElement = document.createElement('i');
  iElement.classList.add('mx-2', 'fe', icon);

// Step 9: Set the rest of the div's innerHTML.
  div3.innerHTML += title;

// Step 10: Append the iElement to div3 before the text.
  div3.insertBefore(iElement, div3.childNodes[0]);

// Step 11: Append the div2 and div3 to div1.
  div1.appendChild(div2);
  div1.appendChild(div3);

// Step 12: Append div1 to td.
  td.appendChild(div1);

// Step 13: Append td to tr.
  tr.appendChild(td);

// Step 14: Append tr to tbody.
  button.appendChild(tr);

  return button;
}

function createTopBtn(title, icon) {
  let buttonElement = document.createElement('button');

// Step 3: Set the type and class attributes of the button.
  buttonElement.setAttribute('type', 'button');
  buttonElement.classList.add('btn', 'btn-primary', 'btn-sm');

// Step 4: Create the i element and set its class.
  var iElement = document.createElement('i');
  iElement.classList.add('mx-2', 'fe', icon);

// Step 5: Set the button's innerHTML.
  buttonElement.innerHTML = title;

  buttonElement.style.margin = '2px';

// Step 6: Append the iElement to the button before the text.
  buttonElement.insertBefore(iElement, buttonElement.childNodes[0]);

  return buttonElement;
}
